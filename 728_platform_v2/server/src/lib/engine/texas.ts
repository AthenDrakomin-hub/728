// Texas Hold'em engine — backed by @pokertools/engine (mature, tested OSS)
// Adapter layer: maps PokerEngine state to our HandState so the rest of the app is untouched.
import { PokerEngine, ActionType } from "@pokertools/engine";
import {
  HandState,
  ActionOption,
  GameEngine,
  Phase,
  Seat,
  HandPlayerResult,
} from "./types";
import { chipsFor, capFor } from "../rooms";
import { Card, cardLabel, texasScore } from "../cards";

// ---- @pokertools/engine card format ("As","Kd") -> our Card {rank,suit} ----
function pkCardToCard(pk: string): Card {
  const rankCh = pk[0];
  const suit = pk[1].toUpperCase() as Card["suit"];
  const rank =
    rankCh === "A" ? 14 :
    rankCh === "K" ? 13 :
    rankCh === "Q" ? 12 :
    rankCh === "J" ? 11 :
    rankCh === "T" ? 10 :
    parseInt(rankCh, 10);
  return { rank, suit };
}

const STREET_MAP: Record<string, Phase> = {
  PREFLOP: "preflop",
  FLOP: "flop",
  TURN: "turn",
  RIVER: "river",
  SHOWDOWN: "showdown",
};

function restoreEngine(st: HandState): PokerEngine {
  if (!st._pkSnapshot) throw new Error("texas: missing engine snapshot");
  return PokerEngine.restore(st._pkSnapshot as any);
}

/** Pull live state from PokerEngine into our HandState shape. */
function syncFromEngine(engine: PokerEngine, st: HandState) {
  const s = engine.state;

  st.phase = STREET_MAP[s.street] ?? "preflop";
  st.community = (s.board as string[]).map(pkCardToCard);
  st.currentBet = Math.max(0, ...Array.from(s.currentBets.values()));
  st.minRaise = s.minRaise;
  st.finished = s.street === "SHOWDOWN";

  // pot: sum of pots (settled streets) + current bets (active street)
  const settledPot = s.pots.reduce((sum, p) => sum + p.amount, 0);
  const activeBets = Array.from(s.currentBets.values()).reduce((a, b) => a + b, 0);
  st.pot = settledPot + activeBets;

  // seats — only map actual players (skip null empty seats)
  const activePlayers = s.players.filter((p: any) => p !== null);
  st.seats = activePlayers.map((p: any): Seat => ({
    userId: Number(p.id),
    account: p.name,
    cards: ((p.hand as string[]) ?? []).map(pkCardToCard),
    points: p.stack,
    streetBet: p.betThisStreet,
    totalBet: p.totalInvestedThisHand,
    folded: p.status === "FOLDED",
    allin: p.status === "ALL_IN",
    acted: false,
    looked: false,
    diceRoll: null,
  }));

  // translate raw seat indices to filtered-seat indices
  const rawToFiltered = new Map<number, number>();
  s.players.forEach((p: any, i: number) => {
    if (p !== null) {
      rawToFiltered.set(i, activePlayers.findIndex((ap: any) => ap.id === p.id));
    }
  });
  st.turn = s.actionTo !== null ? (rawToFiltered.get(s.actionTo) ?? -1) : -1;
  st.dealer = s.buttonSeat !== null ? (rawToFiltered.get(s.buttonSeat) ?? 0) : 0;

  // result on showdown — compute from point delta, NOT from engine winners.amount
  // (winners.amount is inconsistent: total pot on showdown, net win on fold-wins)
  const initial = st._initialPoints ?? {};
  const winnerIds = st.seats
    .filter((seat) => (seat.points - (initial[seat.userId] ?? seat.points)) > 0)
    .map((s) => s.userId);

  if (s.street === "SHOWDOWN" || winnerIds.length > 0 || st.seats.filter((x) => !x.folded).length <= 1) {
    // 第一遍：计算总流水
    let flow = 0;
    const playerData = st.seats.map((seat) => {
      const start = initial[seat.userId] ?? seat.points;
      const gross = seat.points - start;
      if (gross > 0) flow += gross;
      return { seat, start, gross, rake: 0 };
    });

    // 统一抽水：总流水 × 抽水比例
    const rate = (st.rakeRate ?? 3) / 100;
    const totalRake = flow > 0 ? Math.round(flow * rate) : 0;

    // 第二遍：按赢家盈利比例分摊抽水
    const winners = playerData.filter(p => p.gross > 0);
    let allocatedRake = 0;
    const hands: HandPlayerResult[] = playerData.map((pd, idx) => {
      if (pd.gross > 0 && totalRake > 0) {
        const winnerIdx = winners.indexOf(pd);
        if (winnerIdx === winners.length - 1) {
          pd.rake = totalRake - allocatedRake;
        } else {
          pd.rake = Math.round(totalRake * pd.gross / flow);
          allocatedRake += pd.rake;
        }
        pd.seat.points -= pd.rake;
      }
      const delta = pd.seat.points - pd.start;
      return {
        userId: pd.seat.userId,
        account: pd.seat.account,
        cards: pd.seat.cards.map(cardLabel),
        handName: pd.seat.folded
          ? "已弃牌"
          : texasScore([...pd.seat.cards, ...st.community]).name,
        diceRoll: null,
        delta,
        gross: pd.gross,
        rake: pd.rake,
        mult: 1,
        folded: pd.seat.folded,
      };
    });

    st.result = {
      hands,
      winnerUserId: winnerIds[0] ?? st.seats.find((s) => !s.folded)?.userId ?? st.seats[0].userId,
      community: st.community.map(cardLabel),
      bankerUserId: null,
      pot: st.pot,
      rake: totalRake,
      flow,
    };
  } else {
    st.result = null;
  }

  st._pkSnapshot = engine.snapshot;
}

// ---- createHand ----
function createTexasHand(
  players: { userId: number; account: string; points: number }[],
  level: string,
  roundNo: number,
  dealer: number
): HandState {
  const chips = chipsFor(level);
  const base = chips[0];
  // 确保 bigBlind > smallBlind（引擎要求），小盲=大盲/2向上取整
  const smallBlind = Math.max(1, Math.ceil(base / 2));
  const bigBlind = smallBlind * 2;

  const engine = new PokerEngine({
    smallBlind,
    bigBlind,
    maxPlayers: Math.max(6, players.length),
    rakePercent: 0, // engine does not rake — we apply rake uniformly in adapter
    validateIntegrity: true,
  });

  players.forEach((p, i) => {
    engine.sit(i, String(p.userId), p.account, p.points);
  });
  engine.deal();

  const st: HandState = {
    gameType: "texas",
    roundNo,
    phase: "preflop",
    seats: [],
    deck: [],
    community: [],
    turn: 0,
    dealer: dealer % players.length,
    pot: 0,
    currentBet: 0,
    minRaise: base,
    baseBet: base,
    chips,
    cap: capFor(level),
    bankerIdx: null,
    log: [],
    finished: false,
    result: null,
    _initialPoints: Object.fromEntries(players.map((p) => [p.userId, p.points])),
    lastActionTime: Date.now(),
  };

  syncFromEngine(engine, st);
  st.log.push(`— 第 ${roundNo} 局 —`);
  return st;
}

// ---- optionsFor ----
function texasOptionsFor(
  st: HandState,
  userId: number
): ActionOption[] {
  if (st.finished || st.turn < 0) return [];
  const engine = restoreEngine(st);
  const s = engine.state;
  if (s.actionTo === null) return [];
  const me = s.players[s.actionTo];
  if (!me || Number(me.id) !== userId) return [];

  const toCall = Math.max(0, st.currentBet - me.betThisStreet);
  const opts: ActionOption[] = [];

  // fold (always available when facing a bet, not when checking)
  opts.push({ action: "fold", label: "弃牌" });

  // check / call
  if (toCall === 0) {
    opts.push({ action: "check", label: "过牌" });
  } else {
    opts.push({
      action: "call",
      label: `跟注 ${Math.min(toCall, me.stack)}`,
      amount: Math.min(toCall, me.stack),
    });
  }

  // raise / bet
  if (me.stack > toCall) {
    const minTotal = toCall + st.minRaise;
    opts.push({
      action: "raise",
      label: toCall === 0 ? "下注" : "加注",
      min: Math.min(minTotal, me.betThisStreet + me.stack),
      max: Math.min(toCall + st.cap, me.betThisStreet + me.stack),
      chips: st.chips,
    });
  }

  // all-in
  if (me.stack > 0) {
    const total = me.betThisStreet + me.stack;
    if (total > st.currentBet) {
      opts.push({ action: "allin", label: `All-in ${me.stack}`, amount: me.stack });
    } else {
      opts.push({ action: "allin", label: `全下跟注 ${me.stack}`, amount: me.stack });
    }
  }

  return opts;
}

// ---- applyAction ----
function texasApplyAction(
  st: HandState,
  userId: number,
  action: string,
  amount?: number
): { ok: boolean; error?: string } {
  if (st.finished) return { ok: false, error: "本局已结束" };
  const engine = restoreEngine(st);
  const s = engine.state;
  if (s.actionTo === null) return { ok: false, error: "无人需要行动" };
  const me = s.players[s.actionTo];
  if (!me || Number(me.id) !== userId) return { ok: false, error: "还没轮到你" };

  const playerId = String(userId);

  try {
    switch (action) {
      case "fold":
        engine.act({ type: ActionType.FOLD, playerId });
        st.log.push(`${me.name} 弃牌`);
        break;
      case "check":
        engine.act({ type: ActionType.CHECK, playerId });
        st.log.push(`${me.name} 过牌`);
        break;
      case "call": {
        engine.act({ type: ActionType.CALL, playerId });
        const paid = Math.min(Math.max(0, st.currentBet - me.betThisStreet), me.stack);
        st.log.push(`${me.name} 跟注 ${paid}`);
        break;
      }
      case "raise": {
        // amount = total bet this street (matches @pokertools/engine semantics)
        let amt = Math.floor(Number(amount ?? 0));
        const toCall = Math.max(0, st.currentBet - me.betThisStreet);
        const minTotal = toCall + st.minRaise;
        if (amt < minTotal) amt = minTotal;
        amt = Math.min(amt, toCall + st.cap, me.betThisStreet + me.stack);
        engine.act({ type: ActionType.RAISE, playerId, amount: amt });
        st.log.push(`${me.name} 加注到 ${amt}`);
        break;
      }
      case "allin": {
        // all-in = bet entire remaining stack
        // 如果总下注超过当前下注，是RAISE；否则是CALL（筹码不足以跟注时全下跟注）
        const total = me.betThisStreet + me.stack;
        if (total > st.currentBet) {
          engine.act({ type: ActionType.RAISE, playerId, amount: total });
        } else {
          engine.act({ type: ActionType.CALL, playerId });
        }
        st.log.push(`${me.name} All-in ${me.stack}`);
        break;
      }
      default:
        return { ok: false, error: "未知操作" };
    }
  } catch (e: any) {
    return { ok: false, error: e?.message ?? "操作被拒绝" };
  }

  syncFromEngine(engine, st);
  return { ok: true };
}

export const texasEngine: GameEngine = {
  createHand: createTexasHand,
  optionsFor: texasOptionsFor,
  applyAction: texasApplyAction,
};

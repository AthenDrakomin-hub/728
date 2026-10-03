// Shared utility functions used by all game engines
import {
  Card,
  cardLabel,
  freshDeck,
  shuffle,
  texasScore,
  jinhuaScore,
  jinhuaCompare,
  sangongScore,
  niuniuScore,
} from "../cards";
import { chipsFor, capFor } from "../rooms";
import {
  Seat,
  HandState,
  HandPlayerResult,
  HandResult,
  RAKE,
} from "./types";

export function mkSeat(
  p: { userId: number; account: string; points: number },
  cards: Card[]
): Seat {
  return {
    userId: p.userId,
    account: p.account,
    cards,
    points: p.points,
    streetBet: 0,
    totalBet: 0,
    folded: false,
    allin: false,
    acted: false,
    looked: false,
    diceRoll: null,
  };
}

/** Build a base HandState with deck, seats, chips — game-specific init happens after. */
export function baseHandState(
  gameType: HandState["gameType"],
  players: { userId: number; account: string; points: number }[],
  level: string,
  roundNo: number,
  dealer: number,
  cardsPer: number
): HandState {
  const deck = shuffle(freshDeck());
  const chips = chipsFor(level);
  const cap = capFor(level);
  const base = chips[0];

  const seats: Seat[] = players.map((p) => {
    const c: Card[] = [];
    for (let i = 0; i < cardsPer; i++) c.push(deck.pop()!);
    return mkSeat(p, c);
  });

  return {
    gameType,
    roundNo,
    phase: "preflop",
    seats,
    deck,
    community: [],
    turn: 0,
    dealer: dealer % seats.length,
    pot: 0,
    currentBet: 0,
    minRaise: base,
    baseBet: base,
    chips,
    cap,
    bankerIdx: null,
    log: [],
    finished: false,
    result: null,
    lastActionTime: Date.now(),
  };
}

export function postBlind(
  st: HandState,
  idx: number,
  amt: number,
  label: string
) {
  const s = st.seats[idx];
  const pay = Math.min(amt, s.points);
  s.points -= pay;
  s.streetBet += pay;
  s.totalBet += pay;
  st.pot += pay;
  if (s.points === 0) s.allin = true;
  st.log.push(`${s.account} ${label} ${pay}`);
}

export function activeIdx(st: HandState) {
  return st.seats
    .map((s, i) => ({ s, i }))
    .filter((x) => !x.s.folded)
    .map((x) => x.i);
}

export function nextActive(st: HandState, from: number): number {
  const n = st.seats.length;
  for (let k = 1; k <= n; k++) {
    const i = (from + k) % n;
    const s = st.seats[i];
    if (!s.folded && !s.allin) return i;
  }
  return -1;
}

export function nextGrab(st: HandState, from: number): number {
  const n = st.seats.length;
  for (let k = 1; k <= n; k++) {
    const i = (from + k) % n;
    if (st.seats[i].diceRoll === null) return i;
  }
  return -1;
}

export function putIn(st: HandState, idx: number, amt: number) {
  const s = st.seats[idx];
  const pay = Math.max(0, Math.min(amt, s.points));
  s.points -= pay;
  s.streetBet += pay;
  s.totalBet += pay;
  st.pot += pay;
  if (s.points === 0) s.allin = true;
}

export function scoreOf(
  st: HandState,
  s: Seat
): { score: number; name: string; mult: number } {
  if (st.gameType === "texas")
    return { ...texasScore([...s.cards, ...st.community]), mult: 1 };
  if (st.gameType === "jinhua") return { ...jinhuaScore(s.cards), mult: 1 };
  if (st.gameType === "sangong") return sangongScore(s.cards);
  return niuniuScore(s.cards);
}

// 边池计算：按每位玩家的总投入分层，逐层分配给该层有资格的最佳牌
export function distributePots(st: HandState) {
  const n = st.seats.length;
  const contrib = st.seats.map((x) => x.totalBet);
  const levels = [...new Set(contrib.filter((c) => c > 0))].sort(
    (a, b) => a - b
  );

  let prev = 0;
  let potIdx = 0;
  for (const lvl of levels) {
    let amount = 0;
    for (let i = 0; i < n; i++) {
      amount += Math.min(contrib[i], lvl) - Math.min(contrib[i], prev);
    }
    prev = lvl;
    if (amount <= 0) continue;

    const eligible: number[] = [];
    for (let i = 0; i < n; i++) {
      if (!st.seats[i].folded && contrib[i] >= lvl) eligible.push(i);
    }
    if (eligible.length === 0) {
      const fallback = st.seats.findIndex((x) => !x.folded);
      if (fallback >= 0) st.seats[fallback].points += amount;
      continue;
    }

    let winners: number[] = [];
    for (const i of eligible) {
      if (winners.length === 0) {
        winners = [i];
      } else {
        const bestIdx = winners[0];
        const cmp =
          st.gameType === "jinhua"
            ? jinhuaCompare(st.seats[bestIdx].cards, st.seats[i].cards)
            : scoreOf(st, st.seats[bestIdx]).score -
              scoreOf(st, st.seats[i]).score;
        if (cmp < 0) {
          winners = [i];
        } else if (cmp === 0) {
          winners.push(i);
        }
      }
    }
    const share = Math.floor(amount / winners.length);
    let remainder = amount - share * winners.length;
    winners.forEach((i) => {
      st.seats[i].points += share;
      if (remainder > 0) {
        st.seats[i].points += 1;
        remainder--;
      }
    });
    st.log.push(
      `${potIdx === 0 ? "主池" : `边池${potIdx}`} ${amount} → ${winners
        .map((i) => st.seats[i].account)
        .join("、")}`
    );
    potIdx++;
  }
}

export function finalize(
  st: HandState,
  startStacks: Map<number, number>
) {
  const hands: HandPlayerResult[] = [];
  let winnerUserId = st.seats[0].userId;
  let bestDelta = -Infinity;

  // 第一遍：计算每个玩家的盈利，累加总流水
  const playerResults: { seat: Seat; start: number; gross: number; rake: number }[] = [];
  let flow = 0;
  for (const s of st.seats) {
    const start = startStacks.get(s.userId) ?? s.points;
    const gross = s.points - start;
    playerResults.push({ seat: s, start, gross, rake: 0 });
    if (gross > 0) flow += gross;
  }

  // 统一抽水：总流水 × 抽水比例
  const rate = (st.rakeRate ?? 3) / 100;
  const totalRake = flow > 0 ? Math.round(flow * rate) : 0;

  // 第二遍：按赢家盈利比例分摊抽水，从筹码中扣除
  const winners = playerResults.filter(p => p.gross > 0);
  let allocatedRake = 0;
  for (let i = 0; i < playerResults.length; i++) {
    const pr = playerResults[i];
    if (pr.gross > 0 && totalRake > 0) {
      // 最后一个赢家承担取整误差
      const winnerIdx = winners.indexOf(pr);
      if (winnerIdx === winners.length - 1) {
        pr.rake = totalRake - allocatedRake;
      } else {
        pr.rake = Math.round(totalRake * pr.gross / flow);
        allocatedRake += pr.rake;
      }
      pr.seat.points -= pr.rake;
    }
    const delta = pr.seat.points - pr.start;
    if (delta > bestDelta) {
      bestDelta = delta;
      winnerUserId = pr.seat.userId;
    }
    const sc = scoreOf(st, pr.seat);
    hands.push({
      userId: pr.seat.userId,
      account: pr.seat.account,
      cards: pr.seat.cards.map(cardLabel),
      handName: pr.seat.folded ? "已弃牌" : sc.name,
      diceRoll: pr.seat.diceRoll,
      delta,
      gross: pr.gross,
      rake: pr.rake,
      mult: sc.mult,
      folded: pr.seat.folded,
    });
  }

  st.result = {
    hands,
    winnerUserId,
    community: st.community.map(cardLabel),
    bankerUserId:
      st.bankerIdx !== null ? st.seats[st.bankerIdx].userId : null,
    pot: st.pot,
    rake: totalRake,
    flow,
  };
}

// Client-safe projection — shared by all games
export function publicState(
  st: HandState,
  viewerId: number | null,
  isSpectator = false
) {
  return {
    gameType: st.gameType,
    roundNo: st.roundNo,
    phase: st.phase,
    pot: st.pot,
    currentBet: st.currentBet,
    baseBet: st.baseBet,
    community: st.community.map(cardLabel),
    dealer: st.dealer,
    turnUserId: st.turn >= 0 ? st.seats[st.turn].userId : null,
    bankerUserId:
      st.bankerIdx !== null ? st.seats[st.bankerIdx].userId : null,
    finished: st.finished,
    log: st.log.slice(-8),
    result: st.result
      ? {
          ...st.result,
          hands: st.result.hands.map((h) => ({
            ...h,
            cards: isSpectator ? [] : h.cards,
          })),
        }
      : null,
    seats: st.seats.map((s) => {
      const isMe = s.userId === viewerId;
      const isCurrentActing =
        st.turn >= 0 && st.seats[st.turn].userId === s.userId;
      // 三公/牛牛：只有dealt阶段及之后才能看自己的牌（抢庄/下注阶段不发牌）
      const canSeeOwn =
        st.gameType === "texas" ||
        st.gameType === "jinhua" ||
        st.phase === "dealt" ||
        st.finished;
      const reveal = isSpectator
        ? false
        : (isMe && (st.gameType !== "jinhua" || s.looked) && canSeeOwn) ||
          (st.finished && !s.folded) ||
          (st.phase === "dealt" && isCurrentActing);
      return {
        userId: s.userId,
        account: s.account,
        points: s.points,
        streetBet: s.streetBet,
        totalBet: s.totalBet,
        folded: s.folded,
        allin: s.allin,
        looked: s.looked,
        diceRoll: s.diceRoll,
        cardCount: s.cards.length,
        cards: reveal ? s.cards.map(cardLabel) : null,
        handName:
          (st.finished && !s.folded) || (isMe && canSeeOwn && (st.gameType === "niuniu" || st.gameType === "sangong"))
            ? scoreOf(st, s).name
            : null,
      };
    }),
  };
}

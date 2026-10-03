// Zha Jin Hua (炸金花) engine — fully independent
import { HandState, ActionOption, GameEngine } from "./types";
import {
  baseHandState,
  postBlind,
  activeIdx,
  nextActive,
  putIn,
  distributePots,
  finalize,
} from "./common";
import { jinhuaScore, jinhuaCompare } from "../cards";

function createJinhuaHand(
  players: { userId: number; account: string; points: number }[],
  level: string,
  roundNo: number,
  dealer: number
): HandState {
  const st = baseHandState("jinhua", players, level, roundNo, dealer, 3);
  const base = st.baseBet;

  // everyone antes base
  st.seats.forEach((_, i) => postBlind(st, i, base, "底注"));
  st.currentBet = base;
  st.minRaise = base;
  st.seats.forEach((s) => (s.streetBet = 0));
  st.currentBet = base; // per-round call amount
  st.phase = "betting";
  st.turn = nextActive(st, st.dealer);
  st._bettingRound = 0;
  st.log.push(`每人下底注 ${base}`);
  return st;
}

function jinhuaOptionsFor(
  st: HandState,
  userId: number
): ActionOption[] {
  if (st.finished || st.turn < 0) return [];
  const idx = st.seats.findIndex((s) => s.userId === userId);
  if (idx !== st.turn) return [];
  const me = st.seats[idx];

  const opts: ActionOption[] = [];
  const mult = me.looked ? 1 : 0.5;
  const callAmt = Math.max(1, Math.round(st.currentBet * mult));
  const maxRounds = 20;
  const reachedMax = (st._bettingRound ?? 0) >= maxRounds;
  const cantAfford = me.points < callAmt;

  // 达到最大下注轮次 或 筹码不足以跟注 → 只能比牌或弃牌
  if (reachedMax || cantAfford) {
    opts.push({ action: "fold", label: "弃牌" });
    if (activeIdx(st).length > 1) {
      opts.push({ action: "compare", label: cantAfford ? "⚔ 比牌（筹码不足）" : "⚔ 比牌（达上限）" });
    }
    return opts;
  }

  if (!me.looked) opts.push({ action: "look", label: "👁 看牌" });
  opts.push({ action: "fold", label: "弃牌" });
  opts.push({
    action: "call",
    label: `${me.looked ? "跟注" : "闷跟"} ${callAmt}`,
    amount: callAmt,
  });
  opts.push({
    action: "raise",
    label: "加注",
    min: Math.min(callAmt * 2, me.points),
    max: Math.min(st.cap, me.points),
    chips: st.chips,
  });
  if (activeIdx(st).length > 1) {
    opts.push({ action: "compare", label: "⚔ 比牌" });
  }
  return opts;
}

function jinhuaShowdown(st: HandState) {
  st.phase = "showdown";
  st.turn = -1;
  st.finished = true;
  const startStacks = new Map<number, number>();
  st.seats.forEach((s) => startStacks.set(s.userId, s.points + s.totalBet));
  distributePots(st);
  finalize(st, startStacks);
}

function jinhuaNextStreet(st: HandState) {
  // jinhua: cap at showdown after a full betting street completes
  jinhuaShowdown(st);
}

function jinhuaAdvance(st: HandState, from: number) {
  const alive = activeIdx(st);
  if (alive.length <= 1) {
    jinhuaShowdown(st);
    return;
  }
  // 达到最大下注轮次（20轮），强制比牌
  if ((st._bettingRound ?? 0) >= 20) {
    st.log.push(`达到最大下注轮次（20轮），强制比牌`);
    jinhuaShowdown(st);
    return;
  }
  const pending = st.seats.filter(
    (s) =>
      !s.folded &&
      !s.allin &&
      (!s.acted ||
        s.streetBet <
          Math.max(1, Math.round(st.currentBet * (s.looked ? 1 : 0.5))))
  );
  if (pending.length === 0) {
    jinhuaNextStreet(st);
    return;
  }
  let nxt = nextActive(st, from);
  let guard = 0;
  while (
    nxt >= 0 &&
    guard++ < st.seats.length * 2 &&
    st.seats[nxt].acted &&
    st.seats[nxt].streetBet >=
      Math.max(1, Math.round(st.currentBet * (st.seats[nxt].looked ? 1 : 0.5)))
  ) {
    nxt = nextActive(st, nxt);
  }
  st.turn = nxt >= 0 ? nxt : -1;
  if (st.turn < 0) jinhuaNextStreet(st);
}

function jinhuaApplyAction(
  st: HandState,
  userId: number,
  action: string,
  amount?: number
): { ok: boolean; error?: string } {
  if (st.finished) return { ok: false, error: "本局已结束" };
  const idx = st.seats.findIndex((s) => s.userId === userId);
  if (idx < 0) return { ok: false, error: "你不在本局中" };
  if (idx !== st.turn) return { ok: false, error: "还没轮到你" };
  const me = st.seats[idx];
  const toCall = Math.max(0, st.currentBet - me.streetBet);

  switch (action) {
    case "look": {
      me.looked = true;
      st.log.push(`${me.account} 看牌`);
      return { ok: true }; // looking does not pass turn
    }
    case "fold": {
      me.folded = true;
      me.acted = true;
      st.log.push(`${me.account} 弃牌`);
      break;
    }
    case "call": {
      const mult = me.looked ? 1 : 0.5;
      let amt = Math.max(1, Math.round(st.currentBet * mult));
      amt = Math.min(amt, me.points);
      putIn(st, idx, amt);
      me.acted = true;
      st._bettingRound = (st._bettingRound ?? 0) + 1;
      st.log.push(`${me.account} 跟注 ${amt}（第${st._bettingRound}轮）`);
      break;
    }
    case "raise": {
      let amt = Math.floor(Number(amount ?? 0));
      const mult = me.looked ? 1 : 0.5;
      const callAmt = Math.max(1, Math.round(st.currentBet * mult));
      if (amt < callAmt * 2) amt = callAmt * 2;
      amt = Math.min(amt, st.cap, me.points);
      putIn(st, idx, amt);
      st.currentBet = me.looked ? amt : amt * 2;
      st.seats.forEach((s, i) => {
        if (i !== idx && !s.folded) s.acted = false;
      });
      me.acted = true;
      st._bettingRound = (st._bettingRound ?? 0) + 1;
      st.log.push(`${me.account} 加注到 ${amt}（第${st._bettingRound}轮）`);
      break;
    }
    case "compare": {
      const others = activeIdx(st).filter((i) => i !== idx);
      if (!others.length) return { ok: false, error: "没有可比对手" };
      const mult = me.looked ? 1 : 0.5;
      const cost = Math.min(
        Math.max(1, Math.round(st.currentBet * mult * 2)),
        me.points
      );
      putIn(st, idx, cost);
      // amount 参数可选，用于指定比牌对手的 userId
      let opp = others[0];
      if (amount != null) {
        const targetIdx = st.seats.findIndex((s) => s.userId === amount);
        if (targetIdx >= 0 && others.includes(targetIdx)) {
          opp = targetIdx;
        }
      }
      const cmp = jinhuaCompare(me.cards, st.seats[opp].cards);
      if (cmp >= 0) {
        st.seats[opp].folded = true;
        st.log.push(`${me.account} 比牌胜 ${st.seats[opp].account}`);
      } else {
        me.folded = true;
        st.log.push(`${me.account} 比牌负 ${st.seats[opp].account}`);
      }
      me.acted = true;
      break;
    }
    default:
      return { ok: false, error: "未知操作" };
  }

  jinhuaAdvance(st, idx);
  return { ok: true };
}

export const jinhuaEngine: GameEngine = {
  createHand: createJinhuaHand,
  optionsFor: jinhuaOptionsFor,
  applyAction: jinhuaApplyAction,
};

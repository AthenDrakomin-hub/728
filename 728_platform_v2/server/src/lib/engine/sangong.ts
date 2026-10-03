// San Gong (三公) engine — fully independent
// Grab-banker → chip betting → confirm cards → banker vs each player
import { HandState, ActionOption, GameEngine } from "./types";
import {
  baseHandState,
  nextActive,
  nextGrab,
  finalize,
  putIn,
} from "./common";
import { rollDice } from "../secureRandom";
import { sangongScore } from "../cards";

function createSangongHand(
  players: { userId: number; account: string; points: number }[],
  level: string,
  roundNo: number,
  dealer: number
): HandState {
  const st = baseHandState("sangong", players, level, roundNo, dealer, 3);
  // 抢庄阶段不发牌，下注完成后才发牌
  st.seats.forEach((s) => (s.cards = []));
  st.phase = "grab";
  st.turn = nextActive(st, st.dealer);
  st.log.push("抢庄阶段：请掷骰子比大小（点数大者坐庄）");
  return st;
}

/** 获取下一个未下注确认的闲家 */
function nextBettor(st: HandState, from: number): number {
  const bi = st.bankerIdx ?? -1;
  const n = st.seats.length;
  for (let k = 1; k <= n; k++) {
    const i = (from + k) % n;
    if (i !== bi && !st.seats[i].acted) return i;
  }
  return -1;
}

function sangongOptionsFor(
  st: HandState,
  userId: number
): ActionOption[] {
  if (st.finished || st.turn < 0) return [];
  const idx = st.seats.findIndex((s) => s.userId === userId);
  if (idx !== st.turn) return [];

  if (st.phase === "grab") {
    return [{ action: "roll", label: "🎲 掷骰子", amount: 0 }];
  }

  if (st.phase === "betting") {
    const me = st.seats[idx];
    const opts: ActionOption[] = [];
    // 筹码面额按钮：可多次点击累加
    for (const chip of st.chips) {
      if (me.points >= chip) {
        opts.push({ action: "bet", label: `下注 ${chip}`, amount: chip });
      }
    }
    // 确认下注：至少下了底注才能确认
    if (me.totalBet >= st.baseBet) {
      opts.push({ action: "confirm_bet", label: "✓ 确认下注" });
    }
    return opts;
  }

  if (st.phase === "dealt") {
    return [{ action: "confirm", label: "🃏 开牌" }];
  }
  return [];
}

function sangongShowdown(st: HandState) {
  st.phase = "showdown";
  st.turn = -1;
  st.finished = true;

  const startStacks = new Map<number, number>();
  st.seats.forEach((s) => startStacks.set(s.userId, s.points + s.totalBet));

  const bi = st.bankerIdx ?? 0;
  const banker = st.seats[bi];
  const bScore = sangongScore(banker.cards);

  const hasActiveOpponents = st.seats.some((s, i) => i !== bi && !s.folded);
  if (!hasActiveOpponents) {
    banker.points += st.pot;
    st.log.push(`${banker.account}(庄家) 独得底池 ${st.pot}`);
    st.pot = 0;
    finalize(st, startStacks);
    return;
  }

  // 第一轮：计算每个赢的闲家应得赔付，检查庄家赔付能力
  const winners: { idx: number; stake: number; win: number; mult: number }[] = [];
  let totalWin = 0;
  st.seats.forEach((s, i) => {
    if (i === bi || s.folded) return;
    const stake = s.totalBet > 0 ? s.totalBet : st.baseBet;
    const pScore = sangongScore(s.cards);
    if (bScore.score < pScore.score) {
      const win = stake * pScore.mult;
      winners.push({ idx: i, stake, win, mult: pScore.mult });
      totalWin += win;
    }
  });

  // 庄家赔付能力：庄家剩余筹码
  const bankerBankroll = Math.max(0, banker.points);
  // 如果总赔付超过庄家筹码，按比例缩减
  const scale = totalWin > 0 && totalWin > bankerBankroll ? bankerBankroll / totalWin : 1;
  if (scale < 1) {
    st.log.push(`⚠️ 庄家筹码不足，赔付按 ${(scale * 100).toFixed(1)}% 比例结算`);
  }

  st.seats.forEach((s, i) => {
    if (i === bi || s.folded) return;
    const stake = s.totalBet > 0 ? s.totalBet : st.baseBet;
    const pScore = sangongScore(s.cards);
    if (bScore.score > pScore.score) {
      // 庄家赢：闲家stake留在pot，最后归庄家
      st.log.push(
        `${banker.account}(${bScore.name}) 赢 ${s.account}(${pScore.name}) ${stake}`
      );
    } else if (bScore.score < pScore.score) {
      const w = winners.find((w) => w.idx === i)!;
      const actualWin = Math.floor(w.win * scale);
      // 闲家赢：退本金 + 庄家赔倍数（按比例）
      s.points += stake + actualWin;
      st.pot -= stake;
      banker.points -= actualWin;
      s.totalBet = 0;
      st.log.push(
        `${banker.account}(${bScore.name}) 输 ${s.account}(${pScore.name}) ${actualWin}${scale < 1 ? `(应赔${w.win})` : ""}`
      );
    } else {
      // 平局：退本金
      s.points += stake;
      st.pot -= stake;
      s.totalBet = 0;
      st.log.push(
        `${banker.account}(${bScore.name}) 平 ${s.account}(${pScore.name})`
      );
    }
  });
  // 确保庄家筹码不为负
  banker.points = Math.max(0, banker.points);
  // pot剩余（庄家赢的部分）归庄家
  if (st.pot > 0) banker.points += st.pot;
  st.pot = 0;
  finalize(st, startStacks);
}

function sangongApplyAction(
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

  // ---- 骰子抢庄 ----
  if (st.phase === "grab") {
    const roll = rollDice();
    me.diceRoll = roll;
    me.acted = true;
    st.log.push(`${me.account} 掷出 ${roll} 点`);
    if (st.seats.every((s) => s.diceRoll !== null)) {
      const maxRoll = Math.max(...st.seats.map((s) => s.diceRoll ?? 0));
      const maxRollers = st.seats
        .map((s, i) => ({ i, roll: s.diceRoll }))
        .filter((x) => x.roll === maxRoll)
        .map((x) => x.i);

      if (maxRollers.length === 1) {
        const bi = maxRollers[0];
        st.bankerIdx = bi;
        st.log.push(`👑 ${st.seats[bi].account} 以 ${maxRoll} 点成为庄家`);
        // 进入结果展示阶段：展示3秒后自动进入下注
        st.phase = "grab_result";
        st.turn = -1;
        st.lastActionTime = Date.now();
      } else {
        st.log.push(
          `⚖️ ${maxRollers
            .map((i) => st.seats[i].account)
            .join("、")} 点数相同，重新掷骰`
        );
        maxRollers.forEach((i) => {
          st.seats[i].diceRoll = null;
          st.seats[i].acted = false;
        });
        st.turn = maxRollers[0];
        st.lastActionTime = Date.now();
      }
    } else {
      st.turn = nextGrab(st, idx);
    }
    return { ok: true };
  }

  // ---- 筹码下注阶段 ----
  if (st.phase === "betting") {
    const bi = st.bankerIdx ?? -1;
    if (idx === bi) return { ok: false, error: "庄家无需下注" };

    if (action === "bet") {
      const chip = amount ?? 0;
      if (!st.chips.includes(chip)) return { ok: false, error: "无效筹码面额" };
      if (me.points < chip) return { ok: false, error: "筹码不足" };
      // 单注封顶
      if (me.totalBet + chip > st.cap) {
        return { ok: false, error: `单注封顶 ${st.cap}` };
      }
      putIn(st, idx, chip);
      st.log.push(`${me.account} 下注 ${chip}（累计 ${me.totalBet}）`);
      return { ok: true };
    }

    if (action === "confirm_bet") {
      if (me.totalBet < st.baseBet) {
        return { ok: false, error: `至少下注 ${st.baseBet}` };
      }
      me.acted = true;
      st.log.push(`${me.account} 确认下注 ${me.totalBet}`);
      const next = nextBettor(st, idx);
      if (next < 0) {
        // 所有闲家下注完成，发牌后进入确认看牌阶段
        st.seats.forEach((s) => {
          for (let i = 0; i < 3; i++) s.cards.push(st.deck.pop()!);
        });
        st.phase = "dealt";
        st.turn = nextActive(st, -1);
        st.log.push("发牌完成，请依次确认看牌");
      } else {
        st.turn = next;
      }
      return { ok: true };
    }
    return { ok: false, error: "无效操作" };
  }

  // ---- 确认看牌阶段 ----
  if (st.phase === "dealt") {
    me.acted = true;
    st.log.push(`${me.account} 确认看牌`);
    const allConfirmed = st.seats.every((s) => s.acted);
    if (allConfirmed) {
      sangongShowdown(st);
    } else {
      let nxt = -1;
      for (let k = 1; k <= st.seats.length; k++) {
        const i = (idx + k) % st.seats.length;
        if (!st.seats[i].acted && !st.seats[i].folded) {
          nxt = i;
          break;
        }
      }
      st.turn = nxt;
    }
    return { ok: true };
  }

  return { ok: false, error: "无效操作" };
}

export const sangongEngine: GameEngine = {
  createHand: createSangongHand,
  optionsFor: sangongOptionsFor,
  applyAction: sangongApplyAction,
};

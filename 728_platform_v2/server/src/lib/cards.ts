// Card & game evaluation utilities for Texas, Jinhua, Sangong, Niuniu

export type Suit = "S" | "H" | "D" | "C"; // Spade Heart Diamond Club
export interface Card {
  rank: number; // 2-14 (14=Ace)
  suit: Suit;
}

export const SUITS: Suit[] = ["S", "H", "D", "C"];
export const SUIT_SYMBOL: Record<Suit, string> = {
  S: "♠",
  H: "♥",
  D: "♦",
  C: "♣",
};

export function rankLabel(rank: number): string {
  if (rank === 14) return "A";
  if (rank === 13) return "K";
  if (rank === 12) return "Q";
  if (rank === 11) return "J";
  if (rank === 10) return "10";
  return String(rank);
}

export function cardLabel(c: Card): string {
  return `${SUIT_SYMBOL[c.suit]}${rankLabel(c.rank)}`;
}

export function freshDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (let rank = 2; rank <= 14; rank++) {
      deck.push({ rank, suit });
    }
  }
  return deck;
}

import { secureShuffle } from "./secureRandom";

export function shuffle<T>(arr: T[]): T[] {
  return secureShuffle(arr);
}

// ---------------- Texas Hold'em (7-card best 5) ----------------
// returns numeric score, higher is better
export function texasScore(seven: Card[]): { score: number; name: string } {
  const combos = combinations(seven, 5);
  let best = { score: -1, name: "" };
  for (const c of combos) {
    const s = five(c);
    if (s.score > best.score) best = s;
  }
  return best;
}

function five(cards: Card[]): { score: number; name: string } {
  const ranks = cards.map((c) => c.rank).sort((a, b) => b - a);
  const suits = cards.map((c) => c.suit);
  const isFlush = suits.every((s) => s === suits[0]);
  const uniq = [...new Set(ranks)].sort((a, b) => b - a);
  // straight detection (Ace-low too)
  let straightHigh = 0;
  if (uniq.length === 5) {
    if (uniq[0] - uniq[4] === 4) straightHigh = uniq[0];
    else if (
      uniq[0] === 14 &&
      uniq[1] === 5 &&
      uniq[2] === 4 &&
      uniq[3] === 3 &&
      uniq[4] === 2
    )
      straightHigh = 5;
  }
  const counts: Record<number, number> = {};
  for (const r of ranks) counts[r] = (counts[r] || 0) + 1;
  const groups = Object.entries(counts)
    .map(([r, c]) => ({ rank: Number(r), count: c }))
    .sort((a, b) => b.count - a.count || b.rank - a.rank);

  const primary = groups.map((g) => g.rank);
  const tiebreak = (cat: number, kickers: number[]) =>
    cat * 1e10 +
    kickers.reduce((acc, k, i) => acc + k * Math.pow(15, 4 - i), 0);

  if (straightHigh && isFlush)
    return { score: tiebreak(8, [straightHigh]), name: straightHigh === 14 ? "皇家同花顺" : "同花顺" };
  if (groups[0].count === 4)
    return {
      score: tiebreak(7, [groups[0].rank, groups[1].rank]),
      name: "四条",
    };
  if (groups[0].count === 3 && groups[1].count === 2)
    return {
      score: tiebreak(6, [groups[0].rank, groups[1].rank]),
      name: "葫芦",
    };
  if (isFlush) return { score: tiebreak(5, ranks), name: "同花" };
  if (straightHigh) return { score: tiebreak(4, [straightHigh]), name: "顺子" };
  if (groups[0].count === 3)
    return { score: tiebreak(3, primary), name: "三条" };
  if (groups[0].count === 2 && groups[1].count === 2)
    return { score: tiebreak(2, primary), name: "两对" };
  if (groups[0].count === 2) return { score: tiebreak(1, primary), name: "一对" };
  return { score: tiebreak(0, ranks), name: "高牌" };
}

function combinations<T>(arr: T[], k: number): T[][] {
  const res: T[][] = [];
  const combo: T[] = [];
  const rec = (start: number) => {
    if (combo.length === k) {
      res.push([...combo]);
      return;
    }
    for (let i = start; i < arr.length; i++) {
      combo.push(arr[i]);
      rec(i + 1);
      combo.pop();
    }
  };
  rec(0);
  return res;
}

// ---------------- Zhajinhua / 炸金花 (3 cards) ----------------
// 牌型: 特殊235 > 豹子 > 同花顺 > 同花 > 顺子 > 对子 > 单张
export function jinhuaScore(three: Card[]): { score: number; name: string } {
  const ranks = three.map((c) => c.rank).sort((a, b) => b - a);
  const suits = three.map((c) => c.suit);
  const isFlush = suits.every((s) => s === suits[0]);
  const uniq = [...new Set(ranks)];

  let isStraight = false;
  let straightHigh = ranks[0];
  if (uniq.length === 3) {
    if (ranks[0] - ranks[2] === 2) isStraight = true;
    else if (ranks[0] === 14 && ranks[1] === 3 && ranks[2] === 2) {
      isStraight = true;
      straightHigh = 3; // A23 为最小顺子
    }
  }

  const tb = (cat: number, ks: number[]) =>
    cat * 1e8 + ks.reduce((a, k, i) => a + k * Math.pow(15, 2 - i), 0);

  // 特殊牌型：不同花的 2-3-5，只赢豹子（比其他所有牌都小）
  // score 设为最低，比牌时由 jinhuaCompare 特殊处理
  if (!isFlush && ranks[0] === 5 && ranks[1] === 3 && ranks[2] === 2) {
    return { score: tb(0, [5, 3, 2]), name: "特殊235" };
  }
  if (uniq.length === 1) return { score: tb(6, ranks), name: "豹子" };
  if (isStraight && isFlush)
    return { score: tb(5, [straightHigh]), name: "同花顺" };
  if (isFlush) return { score: tb(4, ranks), name: "金花" };
  if (isStraight) return { score: tb(3, [straightHigh]), name: "顺子" };
  if (uniq.length === 2) {
    const pairRank = ranks[0] === ranks[1] ? ranks[0] : ranks[1];
    const single = ranks.find((r) => r !== pairRank)!;
    return { score: tb(2, [pairRank, single]), name: "对子" };
  }
  return { score: tb(1, ranks), name: "散牌" };
}

// 炸金花比牌：处理特殊235规则（235只赢豹子，比其他牌都小）
// 返回正数表示 a 赢，负数表示 b 赢，0 表示平局
export function jinhuaCompare(a: Card[], b: Card[]): number {
  const sa = jinhuaScore(a);
  const sb = jinhuaScore(b);
  const aIs235 = sa.name === "特殊235";
  const bIs235 = sb.name === "特殊235";
  const aIsBaozi = sa.name === "豹子";
  const bIsBaozi = sb.name === "豹子";

  // 235 vs 豹子：235赢
  if (aIs235 && bIsBaozi) return 1;
  if (bIs235 && aIsBaozi) return -1;
  // 235 vs 235：平局
  if (aIs235 && bIs235) return 0;

  return sa.score - sb.score;
}

// ---------------- Sangong / 三公 (3 cards) ----------------
// J/Q/K 记为"公"(0点)，A=1，其余按面值；总和取模10为点数
// 牌型: 至尊九(333) > 三条 > 三公 > 双公 > 普通点数
// 倍数: 至尊九=4, 三条=3, 三公=3, 8/9点=2, 其余1
function sangongPoint(rank: number): number {
  if (rank >= 11 && rank <= 13) return 0; // J Q K
  if (rank === 14) return 1; // A
  return rank;
}
export function sangongScore(three: Card[]): {
  score: number;
  name: string;
  mult: number;
} {
  const faces = three.filter((c) => c.rank >= 11 && c.rank <= 13).length;
  const ranks = three.map((c) => c.rank).sort((a, b) => b - a);
  const maxRank = ranks[0];
  const uniq = [...new Set(ranks)];
  const sum = three.reduce((a, c) => a + sangongPoint(c.rank), 0);
  const point = sum % 10;

  // 至尊九：三张3（通杀）
  if (uniq.length === 1 && ranks[0] === 3) {
    return { score: 60000, name: "至尊九", mult: 4 };
  }
  // 三条：三张相同（非3）
  if (uniq.length === 1) {
    return { score: 50000 + ranks[0], name: "三条", mult: 3 };
  }
  // 三公：三张 JQK（特殊牌型，比任何点数牌都大）
  if (faces === 3) return { score: 40000 + maxRank, name: "三公", mult: 3 };
  // 普通牌：点数优先，公仔数量次之，最大单张最后
  // score = point*1000 + faces*100 + maxRank
  // 这样双公1点(1200+) < 无公3点(3000+)，点数相同则双公>单公>无公
  const faceLabel = faces === 2 ? "双公" : faces === 1 ? "单公" : "";
  const name = point === 0 ? `${faceLabel}无点` : `${faceLabel}${point}点`;
  return {
    score: point * 1000 + faces * 100 + maxRank,
    name,
    mult: point >= 8 ? 2 : 1,
  };
}

// ---------------- Niuniu / 斗牛 (5 cards) ----------------
// 特殊牌型: 五小牛 > 炸弹(四条) > 五花牛 > 牛牛 > 牛9..牛1 > 无牛
// 倍数: 五小牛6, 炸弹5, 五花牛4, 牛牛3, 牛7-9=2, 其余1
function niuPoint(rank: number): number {
  if (rank === 14) return 1; // A = 1
  if (rank >= 10) return 10; // 10 J Q K = 10
  return rank;
}
export function niuniuScore(five5: Card[]): {
  score: number;
  name: string;
  mult: number;
} {
  const pts = five5.map((c) => niuPoint(c.rank));
  const total = pts.reduce((a, b) => a + b, 0);
  // 花色权重：S(黑桃)>H(红心)>C(梅花)>D(方块)
  const suitWeight = (s: Suit) => (s === "S" ? 3 : s === "H" ? 2 : s === "C" ? 1 : 0);
  // 找最大rank的牌的花色（用于平局时比花色）
  const maxRank = Math.max(...five5.map((c) => c.rank));
  const maxSuit = Math.max(...five5.filter((c) => c.rank === maxRank).map((c) => suitWeight(c.suit)));

  // 五小牛：五张牌点数均 ≤5 且总和 ≤10，总和小的赢
  if (five5.every((c) => niuPoint(c.rank) <= 5) && total <= 10) {
    return { score: 60000 + (10 - total) * 100 + maxRank * 10 + maxSuit, name: "五小牛", mult: 6 };
  }
  // 炸弹：四张同点
  const counts: Record<number, number> = {};
  for (const c of five5) counts[c.rank] = (counts[c.rank] || 0) + 1;
  const quad = Object.entries(counts).find(([, n]) => n >= 4);
  if (quad) {
    const quadRank = Number(quad[0]);
    return { score: 50000 + quadRank * 100 + maxRank * 10 + maxSuit, name: "炸弹牛", mult: 5 };
  }
  // 五花牛：五张全是 J/Q/K
  if (five5.every((c) => c.rank >= 11 && c.rank <= 13)) {
    return { score: 40000 + maxRank * 100 + maxSuit, name: "五花牛", mult: 4 };
  }

  // 常规牛型：任意三张之和为 10 的倍数
  const idx = [0, 1, 2, 3, 4];
  let niuVal = -1;
  for (const combo of combinations(idx, 3)) {
    const s = combo.reduce((a, i) => a + pts[i], 0);
    if (s % 10 === 0) {
      const rest = idx.filter((i) => !combo.includes(i));
      const r = (pts[rest[0]] + pts[rest[1]]) % 10;
      niuVal = Math.max(niuVal, r === 0 ? 10 : r);
    }
  }
  if (niuVal < 0) return { score: 0 + maxRank * 10 + maxSuit, name: "无牛", mult: 1 };
  // 没牛：任意三张之和都不为10的倍数
  if (niuVal === -1) {
    return {
      score: 5000 + maxRank * 10 + maxSuit,
      name: "没牛",
      mult: 1,
    };
  }
  const mult = niuVal === 10 ? 3 : niuVal >= 7 ? 2 : 1;
  return {
    score: 10000 + niuVal * 100 + maxRank * 10 + maxSuit,
    name: niuVal === 10 ? "牛牛" : `牛${niuVal}`,
    mult,
  };
}

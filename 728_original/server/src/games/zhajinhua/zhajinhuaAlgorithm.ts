/**
 * 炸金花 (三张牌) 牌型算法
 * 牌型大小: 豹子 > 顺金 > 金花 > 顺子 > 对子 > 单张
 * 特殊: 235 > 豹子 (部分规则)
 */

export type ZJHType =
  | "baozi"    // 豹子 (三张相同)
  | "shunjin"  // 顺金 (同花顺)
  | "jinhua"   // 金花 (同花)
  | "shunzi"   // 顺子
  | "duizi"    // 对子
  | "danzhang"; // 单张

export interface ZJHResult {
  type: ZJHType;
  score: number; // 比牌分数
  mainCard: number; // 主要牌值
  secondCard: number;
  thirdCard: number;
}

function cardValue(card: number): number {
  return (card % 13) + 1; // A=1, ..., K=13
}

function cardSuit(card: number): number {
  return Math.floor(card / 13);
}

/** A可以当14用 (顺子AKQ) */
function valueForStraight(v: number): number {
  return v === 1 ? 14 : v;
}

export function checkZJH(cards: number[]): ZJHResult {
  if (cards.length !== 3) {
    return { type: "danzhang", score: 0, mainCard: 0, secondCard: 0, thirdCard: 0 };
  }

  const values = cards.map(cardValue).sort((a, b) => b - a); // 降序
  const suits = cards.map(cardSuit);
  const [v1, v2, v3] = values;

  const isSameSuit = suits[0] === suits[1] && suits[1] === suits[2];
  const isAllSame = v1 === v2 && v2 === v3;

  // 顺子检测 (包括A23和AKQ)
  const sv = values.map(valueForStraight).sort((a, b) => b - a);
  const isStraight =
    (sv[0] - sv[1] === 1 && sv[1] - sv[2] === 1) ||
    (v1 === 14 && v2 === 3 && v3 === 2); // A23特殊顺子 (A当1)

  // 豹子
  if (isAllSame) {
    return { type: "baozi", score: 600 + v1, mainCard: v1, secondCard: v2, thirdCard: v3 };
  }

  // 顺金
  if (isSameSuit && isStraight) {
    return { type: "shunjin", score: 500 + sv[0], mainCard: sv[0], secondCard: sv[1], thirdCard: sv[2] };
  }

  // 金花
  if (isSameSuit) {
    return { type: "jinhua", score: 400 + v1 * 100 + v2 * 10 + v3, mainCard: v1, secondCard: v2, thirdCard: v3 };
  }

  // 顺子
  if (isStraight) {
    return { type: "shunzi", score: 300 + sv[0], mainCard: sv[0], secondCard: sv[1], thirdCard: sv[2] };
  }

  // 对子
  if (v1 === v2 || v2 === v3) {
    const pairValue = v1 === v2 ? v1 : v2;
    const singleValue = v1 === v2 ? v3 : v1;
    return { type: "duizi", score: 200 + pairValue * 10 + singleValue, mainCard: pairValue, secondCard: singleValue, thirdCard: 0 };
  }

  // 单张
  return { type: "danzhang", score: v1 * 100 + v2 * 10 + v3, mainCard: v1, secondCard: v2, thirdCard: v3 };
}

/** 比牌 */
export function compareZJH(a: ZJHResult, b: ZJHResult): number {
  return a.score - b.score;
}

/** 牌型名称 */
export function zjhTypeName(type: ZJHType): string {
  const names: Record<ZJHType, string> = {
    baozi: "豹子", shunjin: "顺金", jinhua: "金花",
    shunzi: "顺子", duizi: "对子", danzhang: "单张",
  };
  return names[type] || type;
}

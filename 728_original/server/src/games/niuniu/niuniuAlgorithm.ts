/**
 * 牛牛牌型算法
 * 扑克编码: 0-12 黑桃, 13-25 红桃, 26-38 梅花, 39-51 方块
 * 牌值: card % 13 (0=A, 10=J, 11=Q, 12=K)
 * 牛牛规则: 5张牌中找3张和为10的倍数(牛), 剩余2张和%10为牛数
 *   牛数0=牛牛, 1-9=牛一~牛九, 找不到=无牛
 * 特殊牌型: 五小牛(全部<=5且和<=10) > 炸弹 > 五花牛 > 牛牛 > 牛九~牛一 > 无牛
 */

export type NiuType =
  | "wuxiao"   // 五小牛
  | "zhadan"   // 炸弹
  | "wuhua"    // 五花牛
  | "niuniu"   // 牛牛
  | "niu9" | "niu8" | "niu7" | "niu6" | "niu5"
  | "niu4" | "niu3" | "niu2" | "niu1"
  | "niumei";  // 无牛

export interface NiuResult {
  type: NiuType;
  niuValue: number; // 0-10, 10=牛牛, 0=无牛
  niuCards: number[]; // 组成牛的3张牌索引
  score: number; // 用于比牌的分数
}

/** 获取牌点 (A=1, 2-10=2-10, J/Q/K=10) */
function cardPoint(card: number): number {
  const v = card % 13;
  if (v === 0) return 1; // A
  if (v >= 10) return 10; // J, Q, K
  return v + 1;
}

/** 获取牌面值 (A=1, ..., K=13) */
function cardValue(card: number): number {
  return (card % 13) + 1;
}

/** 获取花色 0=黑桃,1=红桃,2=梅花,3=方块 */
function cardSuit(card: number): number {
  return Math.floor(card / 13);
}

/**
 * 检测牛牛牌型
 * @param cards 5张牌数组
 */
export function checkNiu(cards: number[]): NiuResult {
  if (cards.length !== 5) {
    return { type: "niumei", niuValue: 0, niuCards: [], score: 0 };
  }

  const points = cards.map(cardPoint);
  const values = cards.map(cardValue);
  const totalPoint = points.reduce((a, b) => a + b, 0);
  const totalValue = values.reduce((a, b) => a + b, 0);

  // 五小牛: 全部<=5且总和<=10
  if (values.every((v) => v <= 5) && totalValue <= 10) {
    return { type: "wuxiao", niuValue: 14, niuCards: [], score: 1400 + totalValue };
  }

  // 炸弹: 4张相同牌值
  const valueCount: Record<number, number> = {};
  for (const v of values) valueCount[v] = (valueCount[v] || 0) + 1;
  const bombValue = Object.entries(valueCount).find(([, c]) => c >= 4);
  if (bombValue) {
    return { type: "zhadan", niuValue: 13, niuCards: [], score: 1300 + Number(bombValue[0]) };
  }

  // 五花牛: 全部是J/Q/K (牌值>=11)
  if (values.every((v) => v >= 11)) {
    return { type: "wuhua", niuValue: 12, niuCards: [], score: 1200 + totalValue };
  }

  // 找3张和为10的倍数
  for (let i = 0; i < 3; i++) {
    for (let j = i + 1; j < 4; j++) {
      for (let k = j + 1; k < 5; k++) {
        if ((points[i] + points[j] + points[k]) % 10 === 0) {
          const remaining = [0, 1, 2, 3, 4].filter((idx) => idx !== i && idx !== j && idx !== k);
          const niuSum = points[remaining[0]] + points[remaining[1]];
          const niuValue = niuSum % 10 === 0 ? 10 : niuSum % 10;
          const type: NiuType = niuValue === 10 ? "niuniu" : (`niu${niuValue}` as NiuType);
          const maxCard = Math.max(...cards.map(cardValue));
          return {
            type,
            niuValue,
            niuCards: [i, j, k],
            score: niuValue * 100 + maxCard,
          };
        }
      }
    }
  }

  // 无牛
  const maxCard = Math.max(...cards.map(cardValue));
  return { type: "niumei", niuValue: 0, niuCards: [], score: maxCard };
}

/**
 * 比牌: 返回正数=a赢, 负数=b赢, 0=平局
 */
export function compareNiu(a: NiuResult, b: NiuResult): number {
  if (a.score !== b.score) return a.score - b.score;
  return 0;
}

/** 牌型名称 */
export function niuTypeName(type: NiuType): string {
  const names: Record<NiuType, string> = {
    wuxiao: "五小牛", zhadan: "炸弹", wuhua: "五花牛",
    niuniu: "牛牛", niu9: "牛九", niu8: "牛八", niu7: "牛七",
    niu6: "牛六", niu5: "牛五", niu4: "牛四", niu3: "牛三",
    niu2: "牛二", niu1: "牛一", niumei: "无牛",
  };
  return names[type] || type;
}

/** 牌编号转可读名称 */
export function pokerCardName(card: number): string {
  const suits = ["♠", "♥", "♣", "♦"];
  const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  return suits[cardSuit(card)] + values[card % 13];
}

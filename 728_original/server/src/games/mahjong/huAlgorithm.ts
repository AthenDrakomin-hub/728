/**
 * 麻将胡牌算法 — 基于查表法，支持赖子(鬼牌)
 * 牌编码: 0-8 筒, 9-17 条, 18-26 万, 27-33 字牌(东南西北中发白)
 * 输入: 34长度的计数数组
 */

// 缓存表: key = 牌型编码, value = { eye: boolean, gui_num: number }
const tableCache: Map<string, { eye: boolean; gui: number }> = new Map();

function encodeCards(cards: number[]): string {
  return cards.join(",");
}

/**
 * 检查单一花色(9张)是否能组成 刻子/顺子 + 将
 * @param cards 9张计数数组
 * @param guiNum 可用赖子数
 * @param hasEye 是否已经有将
 * @returns 剩余赖子数, -1表示不能胡
 */
function checkSuit(
  cards: number[],
  guiNum: number,
  hasEye: boolean
): { ok: boolean; guiLeft: number; eyeUsed: boolean } {
  const key = `${encodeCards(cards)}|${guiNum}|${hasEye}`;
  const cached = tableCache.get(key);
  if (cached) {
    return { ok: true, guiLeft: cached.gui, eyeUsed: cached.eye };
  }

  const total = cards.reduce((a, b) => a + b, 0);
  if (total === 0 && guiNum === 0) {
    return { ok: true, guiLeft: 0, eyeUsed: hasEye };
  }

  // 找第一张非零牌
  let first = -1;
  for (let i = 0; i < 9; i++) {
    if (cards[i] > 0) { first = i; break; }
  }

  // 如果没有牌了，用赖子补
  if (first === -1) {
    if (!hasEye && guiNum >= 2) {
      // 赖子做将
      const r = checkSuit(cards, guiNum - 2, true);
      if (r.ok) return r;
    }
    if (guiNum >= 3) {
      // 赖子做刻子
      const r = checkSuit(cards, guiNum - 3, hasEye);
      if (r.ok) return r;
    }
    return { ok: false, guiLeft: -1, eyeUsed: false };
  }

  const results: { ok: boolean; guiLeft: number; eyeUsed: boolean }[] = [];

  // 尝试1: 第一张做刻子 (>=3张)
  if (cards[first] >= 3) {
    cards[first] -= 3;
    results.push(checkSuit(cards, guiNum, hasEye));
    cards[first] += 3;
  }

  // 尝试2: 第一张做顺子 (first, first+1, first+2 都有)
  if (first <= 6 && cards[first] > 0 && cards[first + 1] > 0 && cards[first + 2] > 0) {
    cards[first]--; cards[first + 1]--; cards[first + 2]--;
    results.push(checkSuit(cards, guiNum, hasEye));
    cards[first]++; cards[first + 1]++; cards[first + 2]++;
  }

  // 尝试3: 用赖子做将 (当前牌+1张赖子 = 将)
  if (!hasEye && cards[first] >= 2 && guiNum >= 0) {
    cards[first] -= 2;
    results.push(checkSuit(cards, guiNum, true));
    cards[first] += 2;
  }

  // 尝试4: 用赖子补刻子 (2张牌+1赖子)
  if (cards[first] >= 2 && guiNum >= 1) {
    cards[first] -= 2;
    results.push(checkSuit(cards, guiNum - 1, hasEye));
    cards[first] += 2;
  }

  // 尝试5: 用赖子补顺子 (缺1张)
  if (first <= 6 && guiNum >= 1) {
    // 缺 first+1
    if (cards[first] > 0 && cards[first + 2] > 0) {
      cards[first]--; cards[first + 2]--;
      results.push(checkSuit(cards, guiNum - 1, hasEye));
      cards[first]++; cards[first + 2]++;
    }
    // 缺 first+2
    if (cards[first] > 0 && cards[first + 1] > 0 && first <= 5) {
      cards[first]--; cards[first + 1]--;
      results.push(checkSuit(cards, guiNum - 1, hasEye));
      cards[first]++; cards[first + 1]++;
    }
  }

  // 尝试6: 用2张赖子 + 1张牌做顺子/刻子
  if (guiNum >= 2) {
    cards[first]--;
    results.push(checkSuit(cards, guiNum - 2, hasEye));
    cards[first]++;
  }

  for (const r of results) {
    if (r.ok) {
      tableCache.set(key, { eye: r.eyeUsed, gui: r.guiLeft });
      return r;
    }
  }

  return { ok: false, guiLeft: -1, eyeUsed: false };
}

/**
 * 检查七对子
 */
export function check7Pairs(cards: number[], guiNum: number): boolean {
  let pairs = 0;
  let singles = 0;
  for (let i = 0; i < 34; i++) {
    pairs += Math.floor(cards[i] / 2);
    singles += cards[i] % 2;
  }
  // 单牌需要赖子配对
  return pairs * 2 + singles + guiNum >= 14 && singles <= guiNum && pairs + Math.floor(guiNum / 2) >= 7;
}

/**
 * 主入口: 检查是否胡牌
 * @param cards 34张计数数组 (0-33)
 * @param guiIndices 赖子牌索引数组 (如红中=31)
 * @param allow7Pairs 是否允许七对子
 */
export function canHu(
  cards: number[],
  guiIndices: number[] = [],
  allow7Pairs: boolean = true
): boolean {
  const total = cards.reduce((a, b) => a + b, 0);
  if (total % 3 !== 2) return false; // 胡牌必须 3n+2 张

  // 分离赖子
  let guiNum = 0;
  const normalCards = [...cards];
  for (const gi of guiIndices) {
    guiNum += normalCards[gi];
    normalCards[gi] = 0;
  }

  // 检查七对子
  if (allow7Pairs && check7Pairs(normalCards, guiNum)) return true;

  // 分花色检查: 筒(0-8), 条(9-17), 万(18-26), 字(27-33)
  const suits = [
    normalCards.slice(0, 9),
    normalCards.slice(9, 18),
    normalCards.slice(18, 27),
    normalCards.slice(27, 34).concat([0, 0]), // 字牌补到9位
  ];

  let guiLeft = guiNum;
  let hasEye = false;

  for (const suit of suits) {
    const suitTotal = suit.reduce((a, b) => a + b, 0);
    if (suitTotal === 0 && guiLeft === 0) continue;

    const result = checkSuit([...suit], guiLeft, hasEye);
    if (!result.ok) return false;
    guiLeft = result.guiLeft;
    hasEye = result.eyeUsed || hasEye;
  }

  // 剩余赖子处理
  if (!hasEye && guiLeft >= 2) {
    guiLeft -= 2;
    hasEye = true;
  }

  return hasEye && guiLeft % 3 === 0;
}

/**
 * 听牌检测: 返回所有能胡的牌
 */
export function getTingCards(
  cards: number[],
  guiIndices: number[] = [],
  allow7Pairs: boolean = true
): number[] {
  const ting: number[] = [];
  for (let i = 0; i < 34; i++) {
    if (cards[i] >= 4) continue; // 已满4张不能再摸
    cards[i]++;
    if (canHu(cards, guiIndices, allow7Pairs)) {
      ting.push(i);
    }
    cards[i]--;
  }
  return ting;
}

/**
 * 牌编号转可读名称
 */
export function cardName(index: number): string {
  if (index < 9) return `${index + 1}筒`;
  if (index < 18) return `${index - 8}条`;
  if (index < 27) return `${index - 17}万`;
  const feng = ["东", "南", "西", "北", "中", "发", "白"];
  return feng[index - 27] || "?";
}

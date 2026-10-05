/**
 * 温州麻将 (WZMJ) 配置
 * 温州麻将特点: 百搭牌(赖子)、可以碰杠、允许七对子
 */
import { MahjongGame, MahjongConfig } from "./mahjongGame.js";

// 温州麻将百搭: 通常是白板(索引33)或翻牌确定
const WZMJ_GUI_INDICES = [33]; // 白板作百搭

export const WZMJ_CONFIG: Partial<MahjongConfig> = {
  maxSeats: 4,
  totalRounds: 8,
  baseScore: 10,
  guiIndices: WZMJ_GUI_INDICES,
  allow7Pairs: true,
  allowPeng: true,
  allowGang: true,
  fengGang: false,
};

export function createWZMJ(roomId: number): MahjongGame {
  return new MahjongGame(roomId, "WZMJ", WZMJ_CONFIG);
}

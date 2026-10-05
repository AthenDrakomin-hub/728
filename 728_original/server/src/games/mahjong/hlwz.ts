/**
 * HLWZ (红中五子) 配置
 * 特点: 红中作百搭(赖子)、五子登科特殊牌型、支持碰杠
 */
import { MahjongGame, MahjongConfig } from "./mahjongGame.js";

// 红中索引: 31 (中发白: 31=中, 32=发, 33=白)
const HLWZ_GUI_INDICES = [31];

export const HLWZ_CONFIG: Partial<MahjongConfig> = {
  maxSeats: 4,
  totalRounds: 8,
  baseScore: 10,
  guiIndices: HLWZ_GUI_INDICES,
  allow7Pairs: true,
  allowPeng: true,
  allowGang: true,
  fengGang: true,
};

export function createHLWZ(roomId: number): MahjongGame {
  return new MahjongGame(roomId, "HLWZ", HLWZ_CONFIG);
}

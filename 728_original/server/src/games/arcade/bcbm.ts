/**
 * BCBM (奔驰宝马) 游戏配置
 * 8个下注区域: 大/小 保时捷、奔驰、宝马、大众
 * 轮盘32个位置, 每区域4个位置
 */
import { ArcadeGame, ArcadeConfig, ArcadeRegion } from "./arcadeGame.js";

// 区域定义: 大区域在前(高赔率), 小区域在后(低赔率)
const BCBM_REGIONS: ArcadeRegion[] = [
  { id: 0, name: "大保时捷", serverRegion: 21, odds: 40, wheelPositions: [2, 10, 18, 26] },
  { id: 1, name: "大奔驰",   serverRegion: 22, odds: 30, wheelPositions: [4, 12, 20, 28] },
  { id: 2, name: "大宝马",   serverRegion: 23, odds: 20, wheelPositions: [6, 14, 22, 30] },
  { id: 3, name: "大大众",   serverRegion: 24, odds: 10, wheelPositions: [0, 8, 16, 24] },
  { id: 4, name: "小保时捷", serverRegion: 11, odds: 5,  wheelPositions: [3, 11, 19, 27] },
  { id: 5, name: "小奔驰",   serverRegion: 12, odds: 5,  wheelPositions: [5, 13, 21, 29] },
  { id: 6, name: "小宝马",   serverRegion: 13, odds: 5,  wheelPositions: [7, 15, 23, 31] },
  { id: 7, name: "小大众",   serverRegion: 14, odds: 5,  wheelPositions: [1, 9, 17, 25] },
];

export const BCBM_CONFIG: ArcadeConfig = {
  gameType: "BCBM",
  regions: BCBM_REGIONS,
  betDuration: 20,    // 20秒下注
  settleDuration: 5,  // 5秒开奖动画
  minBet: 10,
  maxBet: 10000,
  supportBanker: true,
  wheelSize: 32,
};

export function createBCBM(roomId: number): ArcadeGame {
  return new ArcadeGame(roomId, BCBM_CONFIG);
}

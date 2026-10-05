/**
 * DFDC (东方明珠) 游戏配置
 * 6个下注区域: 红球/蓝球/绿球/黄球/紫球/白球
 * 轮盘24个位置
 */
import { ArcadeGame, ArcadeConfig, ArcadeRegion } from "./arcadeGame.js";

const DFDC_REGIONS: ArcadeRegion[] = [
  { id: 0, name: "红球", serverRegion: 1, odds: 24, wheelPositions: [0, 6, 12, 18] },
  { id: 1, name: "蓝球", serverRegion: 2, odds: 24, wheelPositions: [2, 8, 14, 20] },
  { id: 2, name: "绿球", serverRegion: 3, odds: 16, wheelPositions: [4, 16] },
  { id: 3, name: "黄球", serverRegion: 4, odds: 12, wheelPositions: [10, 22] },
  { id: 4, name: "紫球", serverRegion: 5, odds: 8,  wheelPositions: [1, 7, 13, 19] },
  { id: 5, name: "白球", serverRegion: 6, odds: 5,  wheelPositions: [3, 9, 15, 21] },
];

export const DFDC_CONFIG: ArcadeConfig = {
  gameType: "DFDC",
  regions: DFDC_REGIONS,
  betDuration: 20,
  settleDuration: 5,
  minBet: 10,
  maxBet: 10000,
  supportBanker: true,
  wheelSize: 24,
};

export function createDFDC(roomId: number): ArcadeGame {
  return new ArcadeGame(roomId, DFDC_CONFIG);
}

/**
 * DNTG (大闹天宫) 游戏配置
 * 6个下注区域: 孙悟空/猪八戒/沙僧/唐僧/玉帝/如来
 * 轮盘24个位置
 */
import { ArcadeGame, ArcadeConfig, ArcadeRegion } from "./arcadeGame.js";

const DNTG_REGIONS: ArcadeRegion[] = [
  { id: 0, name: "孙悟空", serverRegion: 1, odds: 40, wheelPositions: [0, 12] },
  { id: 1, name: "猪八戒", serverRegion: 2, odds: 24, wheelPositions: [4, 16] },
  { id: 2, name: "沙僧",   serverRegion: 3, odds: 16, wheelPositions: [8, 20] },
  { id: 3, name: "唐僧",   serverRegion: 4, odds: 10, wheelPositions: [2, 14] },
  { id: 4, name: "玉帝",   serverRegion: 5, odds: 8,  wheelPositions: [6, 18] },
  { id: 5, name: "如来",   serverRegion: 6, odds: 5,  wheelPositions: [10, 22] },
];

export const DNTG_CONFIG: ArcadeConfig = {
  gameType: "DNTG",
  regions: DNTG_REGIONS,
  betDuration: 20,
  settleDuration: 5,
  minBet: 10,
  maxBet: 10000,
  supportBanker: true,
  wheelSize: 24,
};

export function createDNTG(roomId: number): ArcadeGame {
  return new ArcadeGame(roomId, DNTG_CONFIG);
}

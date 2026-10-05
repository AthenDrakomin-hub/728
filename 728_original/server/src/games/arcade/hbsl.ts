/**
 * HBSL (红包扫雷) 游戏配置
 * 简化版: 玩家发红包(设定金额和雷数), 其他玩家抢红包, 抢到雷则赔付
 * 这里用轮盘框架简化实现: 6个区域对应不同雷数概率
 */
import { ArcadeGame, ArcadeConfig, ArcadeRegion } from "./arcadeGame.js";

const HBSL_REGIONS: ArcadeRegion[] = [
  { id: 0, name: "1雷", serverRegion: 1, odds: 10, wheelPositions: [0, 4, 8, 12, 16, 20] },
  { id: 1, name: "2雷", serverRegion: 2, odds: 6,  wheelPositions: [2, 10, 18] },
  { id: 2, name: "3雷", serverRegion: 3, odds: 4,  wheelPositions: [6, 14, 22] },
  { id: 3, name: "4雷", serverRegion: 4, odds: 3,  wheelPositions: [1, 9, 17] },
  { id: 4, name: "5雷", serverRegion: 5, odds: 2.5, wheelPositions: [5, 13, 21] },
  { id: 5, name: "6雷", serverRegion: 6, odds: 2,  wheelPositions: [3, 7, 11, 15, 19, 23] },
];

export const HBSL_CONFIG: ArcadeConfig = {
  gameType: "HBSL",
  regions: HBSL_REGIONS,
  betDuration: 15,
  settleDuration: 3,
  minBet: 10,
  maxBet: 5000,
  supportBanker: false,
  wheelSize: 24,
};

export function createHBSL(roomId: number): ArcadeGame {
  return new ArcadeGame(roomId, HBSL_CONFIG);
}

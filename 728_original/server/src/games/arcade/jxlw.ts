/**
 * JXLW (金鲨银鲨) 游戏配置
 * 6个下注区域: 金鲨/银鲨/小丑鱼/河豚/海龟/海星
 * 轮盘24个位置
 */
import { ArcadeGame, ArcadeConfig, ArcadeRegion } from "./arcadeGame.js";

const JXLW_REGIONS: ArcadeRegion[] = [
  { id: 0, name: "金鲨",   serverRegion: 1, odds: 50, wheelPositions: [0, 12] },
  { id: 1, name: "银鲨",   serverRegion: 2, odds: 30, wheelPositions: [4, 16] },
  { id: 2, name: "小丑鱼", serverRegion: 3, odds: 12, wheelPositions: [2, 8, 14, 20] },
  { id: 3, name: "河豚",   serverRegion: 4, odds: 8,  wheelPositions: [6, 18] },
  { id: 4, name: "海龟",   serverRegion: 5, odds: 6,  wheelPositions: [10, 22] },
  { id: 5, name: "海星",   serverRegion: 6, odds: 4,  wheelPositions: [1, 5, 9, 13, 17, 21] },
];

export const JXLW_CONFIG: ArcadeConfig = {
  gameType: "JXLW",
  regions: JXLW_REGIONS,
  betDuration: 20,
  settleDuration: 5,
  minBet: 10,
  maxBet: 10000,
  supportBanker: true,
  wheelSize: 24,
};

export function createJXLW(roomId: number): ArcadeGame {
  return new ArcadeGame(roomId, JXLW_CONFIG);
}

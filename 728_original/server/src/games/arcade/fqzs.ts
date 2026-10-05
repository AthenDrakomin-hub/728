/**
 * FQZS (飞禽走兽) 游戏配置
 * 8个下注区域: 4飞禽(大鹏/孔雀/鸽子/燕子) + 4走兽(狮子/熊猫/猴子/兔子)
 * 轮盘24个位置
 */
import { ArcadeGame, ArcadeConfig, ArcadeRegion } from "./arcadeGame.js";

const FQZS_REGIONS: ArcadeRegion[] = [
  { id: 0, name: "大鹏",   serverRegion: 1, odds: 40, wheelPositions: [0, 8, 16] },
  { id: 1, name: "孔雀",   serverRegion: 2, odds: 24, wheelPositions: [2, 10, 18] },
  { id: 2, name: "鸽子",   serverRegion: 3, odds: 12, wheelPositions: [4, 12, 20] },
  { id: 3, name: "燕子",   serverRegion: 4, odds: 8,  wheelPositions: [6, 14, 22] },
  { id: 4, name: "狮子",   serverRegion: 5, odds: 40, wheelPositions: [1, 9, 17] },
  { id: 5, name: "熊猫",   serverRegion: 6, odds: 24, wheelPositions: [3, 11, 19] },
  { id: 6, name: "猴子",   serverRegion: 7, odds: 12, wheelPositions: [5, 13, 21] },
  { id: 7, name: "兔子",   serverRegion: 8, odds: 8,  wheelPositions: [7, 15, 23] },
];

export const FQZS_CONFIG: ArcadeConfig = {
  gameType: "FQZS",
  regions: FQZS_REGIONS,
  betDuration: 20,
  settleDuration: 5,
  minBet: 10,
  maxBet: 10000,
  supportBanker: true,
  wheelSize: 24,
};

export function createFQZS(roomId: number): ArcadeGame {
  return new ArcadeGame(roomId, FQZS_CONFIG);
}

/**
 * MJHJ (麻将胡了) 配置
 * 特点: 快速胡牌、低门槛、支持多种胡牌型、无百搭
 */
import { MahjongGame, MahjongConfig } from "./mahjongGame.js";

export const MJHJ_CONFIG: Partial<MahjongConfig> = {
  maxSeats: 4,
  totalRounds: 4,
  baseScore: 5,
  guiIndices: [],
  allow7Pairs: true,
  allowPeng: true,
  allowGang: true,
  fengGang: false,
};

export function createMJHJ(roomId: number): MahjongGame {
  return new MahjongGame(roomId, "MJHJ", MJHJ_CONFIG);
}

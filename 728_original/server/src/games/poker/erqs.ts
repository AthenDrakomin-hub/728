/**
 * ERQS (二人抢庄) 游戏
 * 2人牛牛变体: 抢庄后比牌, 简化版
 */
import { NiuNiuGame } from "../niuniu/niuniuGame.js";

export function createERQS(roomId: number): NiuNiuGame {
  return new NiuNiuGame(roomId, "ERQS", {
    maxSeats: 2,
    baseBet: 10,
    allowQiangZhuang: true,
  });
}

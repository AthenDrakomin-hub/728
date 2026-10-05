/**
 * SDB (三公) 游戏
 * 3张牌比点数: J/Q/K=10点, A=1点, 其余按面值
 * 类似牛牛但用3张牌, 最大9点
 */
import { NiuNiuGame } from "../niuniu/niuniuGame.js";

export function createSDB(roomId: number): NiuNiuGame {
  return new NiuNiuGame(roomId, "SDB", {
    maxSeats: 5,
    baseBet: 10,
    allowQiangZhuang: true,
  });
}

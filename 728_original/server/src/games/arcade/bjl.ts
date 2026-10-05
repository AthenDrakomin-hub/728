/**
 * BJL (百家乐) 游戏 — 真实发牌算法版
 * 8副牌、庄闲发牌、补牌规则、比点数
 * 赔付: 庄赢1赔1(抽5%水)、闲赢1赔1、和1赔8
 */
import { BaccaratGame } from "../poker/baccaratGame.js";

export function createBJL(roomId: number): BaccaratGame {
  return new BaccaratGame(roomId);
}

/**
 * LHD (龙虎斗) 游戏 — 真实发牌算法版
 * 8副牌、龙和虎各发1张、比点数大小
 * 赔付: 龙赢1赔1、虎赢1赔1、和1赔8、和局退还本金
 */
import { DragonTigerGame } from "../poker/dragonTigerGame.js";

export function createLHD(roomId: number): DragonTigerGame {
  return new DragonTigerGame(roomId);
}

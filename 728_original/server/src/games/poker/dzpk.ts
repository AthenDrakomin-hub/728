/**
 * DZPK (德州扑克) — 完整状态机版
 * 每人2张底牌 + 5张公共牌，4轮下注（翻牌前/翻牌/转牌/河牌）
 * 7选5比牌，支持fold/check/call/raise/all-in
 */
import { TexasHoldemGame } from "./texasHoldemGame.js";

export function createDZPK(roomId: number): TexasHoldemGame {
  return new TexasHoldemGame(roomId);
}

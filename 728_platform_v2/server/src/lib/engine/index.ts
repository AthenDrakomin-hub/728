// Game engine registry — one engine per game, fully isolated
import {
  HandState,
  ActionOption,
  GameEngine,
  GameType,
} from "./types";
import { texasEngine } from "./texas";
import { jinhuaEngine } from "./jinhua";
import { sangongEngine } from "./sangong";
import { niuniuEngine } from "./niuniu";
import { publicState } from "./common";

// Re-export all shared types for backward compatibility
export * from "./types";
export { publicState } from "./common";

const ENGINES: Record<GameType, GameEngine> = {
  texas: texasEngine,
  jinhua: jinhuaEngine,
  sangong: sangongEngine,
  niuniu: niuniuEngine,
};

export function getEngine(gameType: GameType): GameEngine {
  return ENGINES[gameType];
}

// ---- Backward-compatible facade (same signatures as old hand.ts) ----

export function createHand(
  gameType: GameType,
  players: { userId: number; account: string; points: number }[],
  level: string,
  roundNo: number,
  dealer: number
): HandState {
  return ENGINES[gameType].createHand(players, level, roundNo, dealer);
}

export function optionsFor(
  st: HandState,
  userId: number
): ActionOption[] {
  return ENGINES[st.gameType].optionsFor(st, userId);
}

export function applyAction(
  st: HandState,
  userId: number,
  action: string,
  amount?: number
): { ok: boolean; error?: string } {
  return ENGINES[st.gameType].applyAction(st, userId, action, amount);
}

// Backward-compatible re-export layer.
// Game logic has been split into ./engine/* — each game is fully isolated.
// This file exists only so existing imports (@/lib/hand) keep working.
export {
  createHand,
  optionsFor,
  applyAction,
  publicState,
  getEngine,
} from "./engine";
export type {
  Seat,
  Phase,
  HandState,
  HandPlayerResult,
  HandResult,
  ActionOption,
  GameEngine,
  GameType,
} from "./engine";
export { RAKE, GAME_META } from "./engine";

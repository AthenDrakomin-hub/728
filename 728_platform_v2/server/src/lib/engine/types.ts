// Shared types for all game engines
import { Card } from "../cards";

export type GameType = "texas" | "jinhua" | "sangong" | "niuniu";

export const GAME_META: Record<
  GameType,
  { name: string; mode: string; emoji: string }
> = {
  texas: { name: "德州竞技", mode: "正常模式", emoji: "\u2660\ufe0f" },
  jinhua: { name: "金花竞技", mode: "正常发牌", emoji: "\ud83c\udccf" },
  sangong: { name: "三公竞技", mode: "抢庄模式", emoji: "\ud83d\udc51" },
  niuniu: { name: "斗牛竞技", mode: "抢庄模式", emoji: "\ud83d\udc02" },
};

export interface Seat {
  userId: number;
  account: string;
  cards: Card[];
  points: number; // remaining stack
  streetBet: number; // chips put in on current street
  totalBet: number; // chips put in this hand
  folded: boolean;
  allin: boolean;
  acted: boolean;
  looked: boolean; // jinhua: has looked at own cards (闷牌/看牌)
  diceRoll: number | null; // sangong/niuniu: 骰子点数（比大小抢庄）
}

export type Phase =
  | "preflop"
  | "flop"
  | "turn"
  | "river"
  | "betting"
  | "grab"
  | "grab_result"
  | "dealt"
  | "showdown";

export interface HandState {
  gameType: GameType;
  roundNo: number;
  phase: Phase;
  seats: Seat[];
  deck: Card[];
  community: Card[];
  turn: number; // index into seats, -1 when no one to act
  dealer: number;
  pot: number;
  currentBet: number; // to-call amount on this street
  minRaise: number;
  baseBet: number; // 底注（= 最小面额）
  chips: number[]; // 可用筹码面额
  cap: number; // 单注封顶
  bankerIdx: number | null;
  log: string[];
  finished: boolean;
  result: HandResult | null;
  /** timestamp of last action (ms) — for auto-timeout */
  lastActionTime: number;
  /** 抽水比例（百分比整数，如3=3%），从全局配置读取，默认3 */
  rakeRate?: number;
  /** @pokertools/engine snapshot (texas only) — opaque, serialized as-is */
  _pkSnapshot?: unknown;
  /** initial points per userId at hand start (texas only) — for reliable delta calc */
  _initialPoints?: Record<number, number>;
  /** jinhua: 下注轮次计数，达到上限后强制比牌 */
  _bettingRound?: number;
}

export interface HandPlayerResult {
  userId: number;
  account: string;
  cards: string[];
  handName: string;
  diceRoll: number | null;
  delta: number; // net change incl. rake for winners
  gross: number; // gross win before rake
  rake: number;
  mult: number; // 赔付倍率（牛牛/三公），德州/金花为1
  folded: boolean;
}

export interface HandResult {
  hands: HandPlayerResult[];
  winnerUserId: number;
  community: string[];
  bankerUserId: number | null;
  pot: number;
  rake: number;
  flow: number; // total winnings flow (sum of positive gross)
}

export interface ActionOption {
  action: string;
  label: string;
  amount?: number;
  min?: number;
  max?: number;
  /** 可用筹码面额（下注/加注时前端按面额累加） */
  chips?: number[];
}

/**
 * Unified game engine interface.
 * Each game implements this independently — no shared if/else branching.
 */
export interface GameEngine {
  createHand(
    players: { userId: number; account: string; points: number }[],
    level: string,
    roundNo: number,
    dealer: number
  ): HandState;
  optionsFor(st: HandState, userId: number): ActionOption[];
  applyAction(
    st: HandState,
    userId: number,
    action: string,
    amount?: number
  ): { ok: boolean; error?: string };
}

export const RAKE = 0.03;

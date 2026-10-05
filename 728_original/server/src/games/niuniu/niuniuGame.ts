/**
 * 牛牛游戏基类
 * 流程: 下注 → 发牌 → 抢庄 → 比牌 → 结算
 */
import { checkNiu, compareNiu, NiuResult, pokerCardName } from "./niuniuAlgorithm.js";
import { batchSettle } from "../../lib/goldManager.js";

export type NiuNiuStage = "waiting" | "betting" | "dealing" | "qiangzhuang" | "comparing" | "settling";

export interface NiuNiuPlayer {
  uid: number;
  seat: number;
  cards: number[];
  bet: number;
  isBanker: boolean;
  niuResult: NiuResult | null;
  score: number;
  hasQiang: boolean; // 是否已抢庄
  qiangMulti: number; // 抢庄倍数
}

export interface NiuNiuConfig {
  maxSeats: number;
  baseBet: number;
  maxBet: number;
  allowQiangZhuang: boolean;
}

export const DEFAULT_NIUNIU_CONFIG: NiuNiuConfig = {
  maxSeats: 5,
  baseBet: 10,
  maxBet: 100,
  allowQiangZhuang: true,
};

export class NiuNiuGame {
  roomId: number;
  gameType: string;
  config: NiuNiuConfig;
  stage: NiuNiuStage = "waiting";
  players: Map<number, NiuNiuPlayer> = new Map();
  deck: number[] = [];
  bankerSeat: number = -1;
  currentRound: number = 0;

  constructor(roomId: number, gameType: string, config?: Partial<NiuNiuConfig>) {
    this.roomId = roomId;
    this.gameType = gameType;
    this.config = { ...DEFAULT_NIUNIU_CONFIG, ...config };
  }

  addPlayer(uid: number, seat: number): boolean {
    if (this.players.has(uid)) return false;
    if (this.players.size >= this.config.maxSeats) return false;
    this.players.set(uid, {
      uid, seat, cards: [], bet: 0, isBanker: false,
      niuResult: null, score: 0, hasQiang: false, qiangMulti: 1,
    });
    return true;
  }

  /** 开始: 进入下注阶段 */
  start(): boolean {
    if (this.players.size < 2) return false;
    this.currentRound++;
    this.stage = "betting";
    for (const p of this.players.values()) {
      p.cards = []; p.bet = 0; p.niuResult = null; p.hasQiang = false; p.qiangMulti = 1;
    }
    return true;
  }

  /** 下注 (region参数为兼容电玩框架, 牛牛忽略) */
  bet(uid: number, regionOrAmount: number, amount?: number): boolean {
    if (this.stage !== "betting") return false;
    const player = this.players.get(uid);
    if (!player) return false;
    const betAmount = amount !== undefined ? amount : regionOrAmount;
    if (betAmount < this.config.baseBet || betAmount > this.config.maxBet) return false;
    player.bet = betAmount;
    return true;
  }

  /** 发牌 */
  deal(): boolean {
    if (this.stage !== "betting") return false;
    this.buildDeck();
    for (const p of this.players.values()) {
      p.cards = [];
      for (let i = 0; i < 5; i++) {
        const card = this.deck.pop();
        if (card !== undefined) p.cards.push(card);
      }
      p.niuResult = checkNiu(p.cards);
    }
    this.stage = this.config.allowQiangZhuang ? "qiangzhuang" : "comparing";
    if (!this.config.allowQiangZhuang) {
      // 无抢庄: 随机庄家或固定
      this.bankerSeat = this.getPlayerList()[0].seat;
      this.getPlayerList()[0].isBanker = true;
      this.settle();
    }
    return true;
  }

  /** 抢庄 */
  qiangZhuang(uid: number, multi: number): boolean {
    if (this.stage !== "qiangzhuang") return false;
    const player = this.players.get(uid);
    if (!player) return false;
    player.hasQiang = true;
    player.qiangMulti = multi;
    // 检查是否所有人都已操作
    const allDone = this.getPlayerList().every((p) => p.hasQiang);
    if (allDone) {
      // 选倍数最高的为庄家, 相同则随机
      const candidates = this.getPlayerList().filter((p) => p.qiangMulti > 0);
      if (candidates.length > 0) {
        const maxMulti = Math.max(...candidates.map((p) => p.qiangMulti));
        const bankers = candidates.filter((p) => p.qiangMulti === maxMulti);
        const banker = bankers[Math.floor(Math.random() * bankers.length)];
        this.bankerSeat = banker.seat;
        banker.isBanker = true;
      } else {
        // 没人抢庄, 随机
        const list = this.getPlayerList();
        const banker = list[Math.floor(Math.random() * list.length)];
        this.bankerSeat = banker.seat;
        banker.isBanker = true;
      }
      this.settle();
    }
    return true;
  }

  /** 结算 */
  private settle(): void {
    this.stage = "settling";
    const banker = this.getPlayerBySeat(this.bankerSeat);
    if (!banker || !banker.niuResult) return;

    for (const p of this.getPlayerList()) {
      if (p.seat === this.bankerSeat || !p.niuResult) continue;
      const cmp = compareNiu(banker.niuResult, p.niuResult);
      const baseAmount = p.bet * Math.max(1, banker.qiangMulti);
      if (cmp > 0) {
        // 庄家赢
        banker.score += baseAmount;
        p.score -= baseAmount;
      } else if (cmp < 0) {
        // 闲家赢
        banker.score -= baseAmount;
        p.score += baseAmount;
      }
    }

    // 金币持久化
    const settleResults = this.getPlayerList()
      .filter((p) => p.score !== 0)
      .map((p) => ({ userId: p.uid, winAmount: p.score }));
    if (settleResults.length > 0) {
      batchSettle(settleResults, this.roomId, this.currentRound);
    }
  }

  private buildDeck(): void {
    this.deck = [];
    for (let i = 0; i < 52; i++) this.deck.push(i);
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  getPlayerList(): NiuNiuPlayer[] {
    return Array.from(this.players.values()).sort((a, b) => a.seat - b.seat);
  }

  getPlayerBySeat(seat: number): NiuNiuPlayer | undefined {
    return this.getPlayerList().find((p) => p.seat === seat);
  }

  getState(): Record<string, any> {
    return {
      roomId: this.roomId, gameType: this.gameType, stage: this.stage,
      currentRound: this.currentRound, bankerSeat: this.bankerSeat,
      players: this.getPlayerList().map((p) => ({
        uid: p.uid, seat: p.seat, bet: p.bet, isBanker: p.isBanker,
        cardCount: p.cards.length, score: p.score,
        niuType: p.niuResult?.type, niuValue: p.niuResult?.niuValue,
        cards: p.cards.map(pokerCardName),
      })),
    };
  }
}

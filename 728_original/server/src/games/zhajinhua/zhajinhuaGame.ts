/**
 * 炸金花游戏基类
 * 流程: 发牌(暗) → 轮流下注(跟/加/看/比/弃) → 比牌结算
 */
import { checkZJH, compareZJH, ZJHResult } from "./zhajinhuaAlgorithm.js";
import { batchSettle } from "../../lib/goldManager.js";

export type ZJHStage = "waiting" | "dealing" | "betting" | "comparing" | "settling";

export interface ZJHPlayer {
  uid: number;
  seat: number;
  cards: number[];
  hasSeen: boolean; // 是否看牌
  betTotal: number; // 累计下注
  isFolded: boolean; // 是否已弃牌
  zjhResult: ZJHResult | null;
  score: number;
}

export interface ZJHConfig {
  maxSeats: number;
  baseBet: number;
  maxBet: number;
  maxRounds: number;
}

export const DEFAULT_ZJH_CONFIG: ZJHConfig = {
  maxSeats: 5,
  baseBet: 5,
  maxBet: 100,
  maxRounds: 20,
};

export class ZJHGame {
  roomId: number;
  gameType: string;
  config: ZJHConfig;
  stage: ZJHStage = "waiting";
  players: Map<number, ZJHPlayer> = new Map();
  deck: number[] = [];
  currentTurn: number = -1;
  currentBet: number = 0; // 当前单轮下注额
  pot: number = 0; // 奖池
  roundCount: number = 0;
  currentRound: number = 0;

  constructor(roomId: number, gameType: string, config?: Partial<ZJHConfig>) {
    this.roomId = roomId;
    this.gameType = gameType;
    this.config = { ...DEFAULT_ZJH_CONFIG, ...config };
  }

  addPlayer(uid: number, seat: number): boolean {
    if (this.players.has(uid)) return false;
    if (this.players.size >= this.config.maxSeats) return false;
    this.players.set(uid, {
      uid, seat, cards: [], hasSeen: false, betTotal: 0,
      isFolded: false, zjhResult: null, score: 0,
    });
    return true;
  }

  start(): boolean {
    if (this.players.size < 2) return false;
    this.currentRound++;
    this.buildDeck();
    this.pot = 0;
    this.currentBet = this.config.baseBet;
    this.roundCount = 0;

    for (const p of this.players.values()) {
      p.cards = []; p.hasSeen = false; p.betTotal = 0; p.isFolded = false; p.zjhResult = null;
      // 发3张暗牌
      for (let i = 0; i < 3; i++) {
        const card = this.deck.pop();
        if (card !== undefined) p.cards.push(card);
      }
      p.zjhResult = checkZJH(p.cards);
      // 底注
      p.betTotal = this.config.baseBet;
      this.pot += this.config.baseBet;
    }

    this.stage = "betting";
    this.currentTurn = 0;
    return true;
  }

  /** 跟注 */
  call(uid: number): boolean {
    if (this.stage !== "betting") return false;
    const player = this.getCurrentPlayer();
    if (!player || player.uid !== uid) return false;
    const amount = player.hasSeen ? this.currentBet * 2 : this.currentBet;
    player.betTotal += amount;
    this.pot += amount;
    this.nextTurn();
    return true;
  }

  /** 加注 */
  raise(uid: number, amount: number): boolean {
    if (this.stage !== "betting") return false;
    const player = this.getCurrentPlayer();
    if (!player || player.uid !== uid) return false;
    if (amount < this.config.baseBet || amount > this.config.maxBet) return false;
    this.currentBet = amount;
    const pay = player.hasSeen ? amount * 2 : amount;
    player.betTotal += pay;
    this.pot += pay;
    this.nextTurn();
    return true;
  }

  /** 看牌 */
  seeCards(uid: number): boolean {
    if (this.stage !== "betting") return false;
    const player = this.players.get(uid);
    if (!player || player.hasSeen) return false;
    player.hasSeen = true;
    return true;
  }

  /** 比牌 */
  compare(uid: number, targetSeat: number): boolean {
    if (this.stage !== "betting") return false;
    const player = this.getCurrentPlayer();
    if (!player || player.uid !== uid) return false;
    const target = this.getPlayerBySeat(targetSeat);
    if (!target || target.isFolded) return false;

    // 比牌需要付双倍
    const amount = (player.hasSeen ? this.currentBet * 2 : this.currentBet) * 2;
    player.betTotal += amount;
    this.pot += amount;

    const cmp = compareZJH(player.zjhResult!, target.zjhResult!);
    if (cmp >= 0) {
      target.isFolded = true; // 输的弃牌
    } else {
      player.isFolded = true;
    }
    this.checkGameEnd();
    if (this.stage === "betting") this.nextTurn();
    return true;
  }

  /** 弃牌 */
  fold(uid: number): boolean {
    if (this.stage !== "betting") return false;
    const player = this.players.get(uid);
    if (!player) return false;
    player.isFolded = true;
    this.checkGameEnd();
    if (this.stage === "betting" && this.getCurrentPlayer()?.uid === uid) {
      this.nextTurn();
    }
    return true;
  }

  private checkGameEnd(): void {
    const active = this.getPlayerList().filter((p) => !p.isFolded);
    if (active.length <= 1) {
      this.settle(active[0]?.seat ?? -1);
    }
  }

  private nextTurn(): void {
    const list = this.getPlayerList();
    let next = (this.currentTurn + 1) % list.length;
    let attempts = 0;
    while (list[next]?.isFolded && attempts < list.length) {
      next = (next + 1) % list.length;
      attempts++;
    }
    this.currentTurn = next;
    this.roundCount++;
    if (this.roundCount >= this.config.maxRounds * list.length) {
      // 达到最大轮数, 强制比牌
      const active = this.getPlayerList().filter((p) => !p.isFolded);
      let winner = active[0];
      for (const p of active) {
        if (compareZJH(p.zjhResult!, winner.zjhResult!) > 0) winner = p;
      }
      this.settle(winner.seat);
    }
  }

  private settle(winnerSeat: number): void {
    this.stage = "settling";
    const winner = this.getPlayerBySeat(winnerSeat);
    if (winner) {
      winner.score += this.pot;
    }
    // 金币持久化: 赢家获得奖池，输家的下注已在bet时扣除
    if (winner && this.pot > 0) {
      batchSettle([{ userId: winner.uid, winAmount: this.pot }], this.roomId, this.currentRound);
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

  getCurrentPlayer(): ZJHPlayer | undefined {
    return this.getPlayerList()[this.currentTurn];
  }

  getPlayerList(): ZJHPlayer[] {
    return Array.from(this.players.values()).sort((a, b) => a.seat - b.seat);
  }

  getPlayerBySeat(seat: number): ZJHPlayer | undefined {
    return this.getPlayerList().find((p) => p.seat === seat);
  }

  getState(): Record<string, any> {
    return {
      roomId: this.roomId, gameType: this.gameType, stage: this.stage,
      currentTurn: this.currentTurn, currentBet: this.currentBet, pot: this.pot,
      currentRound: this.currentRound,
      players: this.getPlayerList().map((p) => ({
        uid: p.uid, seat: p.seat, hasSeen: p.hasSeen, betTotal: p.betTotal,
        isFolded: p.isFolded, cardCount: p.cards.length, score: p.score,
        zjhType: p.zjhResult?.type,
      })),
    };
  }
}

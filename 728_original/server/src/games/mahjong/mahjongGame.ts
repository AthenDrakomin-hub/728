/**
 * 麻将游戏基类 — 通用状态机
 * 支持: 发牌、摸牌、打牌、碰、明杠、暗杠、胡、结算
 */
import { canHu, getTingCards, cardName } from "./huAlgorithm.js";
import { batchSettle } from "../../lib/goldManager.js";

export type MahjongStage = "waiting" | "playing" | "discarding" | "penggang" | "settling";

export interface MahjongPlayer {
  uid: number;
  seat: number;
  handCards: number[]; // 34位计数数组
  shownCards: number[][]; // 已碰/杠的牌组
  discardCards: number[]; // 打出的牌
  isBanker: boolean;
  score: number;
}

export interface MahjongConfig {
  maxSeats: number;
  totalRounds: number;
  baseScore: number;
  guiIndices: number[]; // 赖子牌索引
  allow7Pairs: boolean;
  allowPeng: boolean;
  allowGang: boolean;
  fengGang: boolean; // 风牌杠
}

export const DEFAULT_CONFIG: MahjongConfig = {
  maxSeats: 4,
  totalRounds: 8,
  baseScore: 10,
  guiIndices: [],
  allow7Pairs: true,
  allowPeng: true,
  allowGang: true,
  fengGang: false,
};

export class MahjongGame {
  roomId: number;
  gameType: string;
  config: MahjongConfig;
  stage: MahjongStage = "waiting";
  players: Map<number, MahjongPlayer> = new Map();
  deck: number[] = [];
  currentRound: number = 0;
  currentTurn: number = -1; // 当前操作座位
  lastDiscard: { seat: number; card: number } | null = null;
  pendingActions: Map<number, string> = new Map(); // 等待其他玩家响应碰杠胡
  winnerSeat: number = -1;
  bankerSeat: number = 0;

  constructor(roomId: number, gameType: string, config?: Partial<MahjongConfig>) {
    this.roomId = roomId;
    this.gameType = gameType;
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /** 加入玩家 */
  addPlayer(uid: number, seat: number): boolean {
    if (this.players.has(uid)) return false;
    if (this.players.size >= this.config.maxSeats) return false;
    this.players.set(uid, {
      uid, seat,
      handCards: new Array(34).fill(0),
      shownCards: [],
      discardCards: [],
      isBanker: seat === this.bankerSeat,
      score: 0,
    });
    return true;
  }

  /** 开始游戏 */
  start(): boolean {
    if (this.players.size < 2) return false;
    this.currentRound++;
    this.stage = "playing";
    this.buildDeck();
    this.dealCards();
    this.currentTurn = this.bankerSeat;
    this.stage = "discarding";
    return true;
  }

  /** 构建牌堆 (136张 = 34种 x 4张) */
  private buildDeck(): void {
    this.deck = [];
    for (let i = 0; i < 34; i++) {
      for (let j = 0; j < 4; j++) this.deck.push(i);
    }
    // 洗牌 (Fisher-Yates)
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  /** 发牌: 庄家14张, 闲家13张 */
  private dealCards(): void {
    const playerList = this.getPlayerList();
    for (const p of playerList) {
      p.handCards = new Array(34).fill(0);
      p.shownCards = [];
      p.discardCards = [];
      const count = p.isBanker ? 14 : 13;
      for (let i = 0; i < count; i++) {
        const card = this.deck.pop();
        if (card !== undefined) p.handCards[card]++;
      }
    }
  }

  /** 摸牌 */
  drawCard(seat: number): number | null {
    if (this.stage !== "playing" && this.stage !== "discarding") return null;
    if (this.currentTurn !== seat) return null;
    if (this.deck.length === 0) {
      this.settleDraw();
      return null;
    }
    const card = this.deck.pop()!;
    const player = this.getPlayerBySeat(seat);
    if (player) {
      player.handCards[card]++;
      // 检查自摸
      if (canHu(player.handCards, this.config.guiIndices, this.config.allow7Pairs)) {
        this.winnerSeat = seat;
        this.settle("zimo", seat, card);
      }
    }
    return card;
  }

  /** 打牌 */
  discardCard(seat: number, card: number): boolean {
    if (this.stage !== "discarding") return false;
    if (this.currentTurn !== seat) return false;
    const player = this.getPlayerBySeat(seat);
    if (!player || player.handCards[card] <= 0) return false;

    player.handCards[card]--;
    player.discardCards.push(card);
    this.lastDiscard = { seat, card };
    this.stage = "penggang";
    this.pendingActions.clear();

    // 检查其他玩家是否可以碰/杠/胡
    const others = this.getPlayerList().filter((p) => p.seat !== seat);
    for (const p of others) {
      const actions: string[] = [];
      // 胡
      p.handCards[card]++;
      if (canHu(p.handCards, this.config.guiIndices, this.config.allow7Pairs)) {
        actions.push("hu");
      }
      p.handCards[card]--;
      // 碰
      if (this.config.allowPeng && p.handCards[card] >= 2) actions.push("peng");
      // 明杠
      if (this.config.allowGang && p.handCards[card] >= 3) actions.push("gang");

      if (actions.length > 0) {
        this.pendingActions.set(p.seat, actions.join(","));
      }
    }

    // 如果没人响应，轮到下一家
    if (this.pendingActions.size === 0) {
      this.nextTurn();
    }
    return true;
  }

  /** 碰牌 */
  peng(seat: number): boolean {
    if (this.stage !== "penggang" || !this.lastDiscard) return false;
    if (!this.pendingActions.has(seat)) return false;
    const actions = this.pendingActions.get(seat)!.split(",");
    if (!actions.includes("peng")) return false;

    const player = this.getPlayerBySeat(seat);
    const card = this.lastDiscard.card;
    if (!player || player.handCards[card] < 2) return false;

    player.handCards[card] -= 2;
    player.shownCards.push([card, card, card]);
    this.pendingActions.clear();
    this.currentTurn = seat;
    this.stage = "discarding";
    this.lastDiscard = null;
    return true;
  }

  /** 明杠 */
  gang(seat: number, isAnGang: boolean = false): boolean {
    if (this.stage !== "penggang" && !isAnGang) return false;
    const player = this.getPlayerBySeat(seat);
    if (!player) return false;

    let card: number;
    if (isAnGang) {
      // 暗杠: 找手里4张相同的牌
      card = player.handCards.findIndex((c) => c >= 4);
      if (card < 0) return false;
      player.handCards[card] -= 4;
    } else {
      if (!this.lastDiscard) return false;
      if (!this.pendingActions.has(seat)) return false;
      card = this.lastDiscard.card;
      if (player.handCards[card] < 3) return false;
      player.handCards[card] -= 3;
      this.pendingActions.clear();
    }

    player.shownCards.push([card, card, card, card]);
    // 杠后摸牌
    this.currentTurn = seat;
    this.stage = "playing";
    this.lastDiscard = null;
    return true;
  }

  /** 胡牌 (点炮) */
  hu(seat: number): boolean {
    if (this.stage !== "penggang" || !this.lastDiscard) return false;
    if (!this.pendingActions.has(seat)) return false;
    const actions = this.pendingActions.get(seat)!.split(",");
    if (!actions.includes("hu")) return false;

    const player = this.getPlayerBySeat(seat);
    const card = this.lastDiscard.card;
    if (!player) return false;

    player.handCards[card]++;
    this.winnerSeat = seat;
    this.settle("dianpao", seat, card);
    return true;
  }

  /** 过 (不碰不杠不胡) */
  pass(seat: number): void {
    this.pendingActions.delete(seat);
    if (this.pendingActions.size === 0) {
      this.nextTurn();
    }
  }

  /** 下一家 */
  private nextTurn(): void {
    this.currentTurn = (this.currentTurn + 1) % this.config.maxSeats;
    this.stage = "playing";
    this.lastDiscard = null;
  }

  /** 结算 */
  private settle(type: "zimo" | "dianpao", winnerSeat: number, card: number): void {
    this.stage = "settling";
    const winner = this.getPlayerBySeat(winnerSeat);
    if (!winner) return;

    // 简单结算: 自摸每家输 baseScore, 点炮点炮者输 baseScore*2
    const base = this.config.baseScore;
    if (type === "zimo") {
      for (const p of this.getPlayerList()) {
        if (p.seat !== winnerSeat) {
          p.score -= base;
          winner.score += base;
        }
      }
    } else {
      const loser = this.getPlayerBySeat(this.lastDiscard?.seat ?? -1);
      if (loser) {
        loser.score -= base * 2;
        winner.score += base * 2;
      }
    }

    // 金币持久化: 将本局score变动写回数据库
    const settleResults = this.getPlayerList()
      .filter((p) => p.score !== 0)
      .map((p) => ({ userId: p.uid, winAmount: p.score }));
    if (settleResults.length > 0) {
      batchSettle(settleResults, this.roomId, this.currentRound);
    }

    // 下一轮准备
    setTimeout(() => {
      if (this.currentRound < this.config.totalRounds) {
        this.bankerSeat = winnerSeat; // 胡牌者坐庄
        this.start();
      } else {
        this.stage = "waiting";
      }
    }, 3000);
  }

  /** 流局 */
  private settleDraw(): void {
    this.stage = "settling";
    setTimeout(() => {
      if (this.currentRound < this.config.totalRounds) {
        this.bankerSeat = (this.bankerSeat + 1) % this.config.maxSeats;
        this.start();
      } else {
        this.stage = "waiting";
      }
    }, 3000);
  }

  /** 听牌检测 */
  getTing(seat: number): number[] {
    const player = this.getPlayerBySeat(seat);
    if (!player) return [];
    return getTingCards(player.handCards, this.config.guiIndices, this.config.allow7Pairs);
  }

  /** 获取玩家列表(按座位排序) */
  getPlayerList(): MahjongPlayer[] {
    return Array.from(this.players.values()).sort((a, b) => a.seat - b.seat);
  }

  getPlayerBySeat(seat: number): MahjongPlayer | undefined {
    return this.getPlayerList().find((p) => p.seat === seat);
  }

  /** 获取游戏状态快照 */
  getState(): Record<string, any> {
    return {
      roomId: this.roomId,
      gameType: this.gameType,
      stage: this.stage,
      currentRound: this.currentRound,
      currentTurn: this.currentTurn,
      bankerSeat: this.bankerSeat,
      lastDiscard: this.lastDiscard,
      deckCount: this.deck.length,
      players: this.getPlayerList().map((p) => ({
        uid: p.uid,
        seat: p.seat,
        handCount: p.handCards.reduce((a, b) => a + b, 0),
        shownCards: p.shownCards,
        discardCards: p.discardCards,
        isBanker: p.isBanker,
        score: p.score,
      })),
    };
  }
}

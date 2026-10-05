/**
 * 德州扑克 (Texas Hold'em) 完整状态机
 * 流程: 发底牌→翻牌前下注→翻牌(3张)→翻牌后下注→转牌(1张)→转牌后下注→河牌(1张)→河牌后下注→比牌
 * 牌型: 皇家同花顺>同花顺>四条>葫芦>同花>顺子>三条>两对>一对>高牌
 * 动作: fold/check/call/raise/all-in
 */
import { logger } from "../../lib/logger.js";

interface Card {
  suit: string;   // s/h/d/c
  rank: number;   // 2-14 (14=A)
}

interface Player {
  userId: number;
  seat: number;
  chips: number;
  holeCards: Card[];
  currentBet: number;
  totalBet: number;
  folded: boolean;
  allIn: boolean;
  acted: boolean;
  isSmallBlind: boolean;
  isBigBlind: boolean;
}

interface HandRank {
  category: number; // 0-9
  name: string;
  tiebreak: number[];
}

const CATEGORY_NAMES = [
  "高牌", "一对", "两对", "三条", "顺子",
  "同花", "葫芦", "四条", "同花顺", "皇家同花顺"
];

function buildDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of ["s", "h", "d", "c"]) {
    for (let rank = 2; rank <= 14; rank++) {
      deck.push({ suit, rank });
    }
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

function cardStr(c: Card): string {
  const r = c.rank === 14 ? "A" : c.rank === 13 ? "K" : c.rank === 12 ? "Q" : c.rank === 11 ? "J" : c.rank === 10 ? "T" : String(c.rank);
  return r + c.suit;
}

/** 评估5张牌的牌型 */
function evaluate5(cards: Card[]): HandRank {
  const sorted = [...cards].sort((a, b) => b.rank - a.rank);
  const ranks = sorted.map(c => c.rank);
  const suits = sorted.map(c => c.suit);

  const isFlush = suits.every(s => s === suits[0]);
  // 顺子检测（A可作1）
  let isStraight = true;
  for (let i = 1; i < 5; i++) {
    if (ranks[i] !== ranks[i - 1] - 1) { isStraight = false; break; }
  }
  // A-2-3-4-5 特殊顺子
  if (!isStraight && ranks[0] === 14 && ranks[1] === 5 && ranks[2] === 4 && ranks[3] === 3 && ranks[4] === 2) {
    isStraight = true;
  }

  // 计数
  const countMap: Record<number, number> = {};
  for (const r of ranks) countMap[r] = (countMap[r] || 0) + 1;
  const counts = Object.entries(countMap).map(([rank, count]) => ({ rank: Number(rank), count }))
    .sort((a, b) => b.count - a.count || b.rank - a.rank);

  // 皇家同花顺
  if (isFlush && isStraight && ranks[0] === 14 && ranks[4] === 10) {
    return { category: 9, name: "皇家同花顺", tiebreak: [14] };
  }
  // 同花顺
  if (isFlush && isStraight) {
    const high = ranks[0] === 14 && ranks[1] === 5 ? 5 : ranks[0];
    return { category: 8, name: "同花顺", tiebreak: [high] };
  }
  // 四条
  if (counts[0].count === 4) {
    return { category: 7, name: "四条", tiebreak: [counts[0].rank, counts[1]?.rank || 0] };
  }
  // 葫芦
  if (counts[0].count === 3 && counts[1]?.count === 2) {
    return { category: 6, name: "葫芦", tiebreak: [counts[0].rank, counts[1].rank] };
  }
  // 同花
  if (isFlush) {
    return { category: 5, name: "同花", tiebreak: ranks };
  }
  // 顺子
  if (isStraight) {
    const high = ranks[0] === 14 && ranks[1] === 5 ? 5 : ranks[0];
    return { category: 4, name: "顺子", tiebreak: [high] };
  }
  // 三条
  if (counts[0].count === 3) {
    return { category: 3, name: "三条", tiebreak: [counts[0].rank, counts[1]?.rank || 0, counts[2]?.rank || 0] };
  }
  // 两对
  if (counts[0].count === 2 && counts[1]?.count === 2) {
    return { category: 2, name: "两对", tiebreak: [counts[0].rank, counts[1].rank, counts[2]?.rank || 0] };
  }
  // 一对
  if (counts[0].count === 2) {
    return { category: 1, name: "一对", tiebreak: [counts[0].rank, counts[1]?.rank || 0, counts[2]?.rank || 0, counts[3]?.rank || 0] };
  }
  // 高牌
  return { category: 0, name: "高牌", tiebreak: ranks };
}

/** 从7张牌中选最佳5张 */
function evaluate7(cards: Card[]): HandRank {
  let best: HandRank | null = null;
  // 组合C(7,5)=21
  for (let i = 0; i < 7; i++) {
    for (let j = i + 1; j < 7; j++) {
      const subset = cards.filter((_, idx) => idx !== i && idx !== j);
      const rank = evaluate5(subset);
      if (!best || compareHand(rank, best) > 0) best = rank;
    }
  }
  return best!;
}

function compareHand(a: HandRank, b: HandRank): number {
  if (a.category !== b.category) return a.category - b.category;
  for (let i = 0; i < Math.max(a.tiebreak.length, b.tiebreak.length); i++) {
    const av = a.tiebreak[i] || 0;
    const bv = b.tiebreak[i] || 0;
    if (av !== bv) return av - bv;
  }
  return 0;
}

export class TexasHoldemGame {
  roomId: number;
  gameType = "DZPK";
  stage: "idle" | "preflop" | "flop" | "turn" | "river" | "showdown" = "idle";
  players: Map<number, Player> = new Map();
  dealerSeat = 0;
  currentTurnSeat = -1;
  communityCards: Card[] = [];
  pot = 0;
  currentBet = 0;
  minRaise = 0;
  smallBlind = 10;
  bigBlind = 20;
  handHistory: { winner: number[]; hand: string; pot: number }[] = [];
  private deck: Card[] = [];
  private deckIndex = 0;
  private actionTimer: NodeJS.Timeout | null = null;
  private readonly ACTION_TIMEOUT = 30;
  readonly maxPlayers = 9;

  constructor(roomId: number) {
    this.roomId = roomId;
  }

  addPlayer(userId: number, seat: number = 0, chips: number = 10000): boolean {
    if (this.players.size >= this.maxPlayers) return false;
    if (this.players.has(userId)) return true;
    this.players.set(userId, {
      userId, seat, chips,
      holeCards: [], currentBet: 0, totalBet: 0,
      folded: false, allIn: false, acted: false,
      isSmallBlind: false, isBigBlind: false,
    });
    return true;
  }

  start(): boolean {
    if (this.stage !== "idle" && this.stage !== "showdown") return false;
    const activePlayers = this.getActivePlayers();
    if (activePlayers.length < 2) return false;

    // 重置
    this.deck = buildDeck();
    this.deckIndex = 0;
    this.communityCards = [];
    this.pot = 0;
    this.currentBet = 0;
    this.minRaise = this.bigBlind;

    for (const p of this.players.values()) {
      p.holeCards = [];
      p.currentBet = 0;
      p.totalBet = 0;
      p.folded = false;
      p.allIn = false;
      p.acted = false;
      p.isSmallBlind = false;
      p.isBigBlind = false;
    }

    // 确定盲注位置
    const seats = activePlayers.map(p => p.seat).sort((a, b) => a - b);
    this.dealerSeat = seats[0]; // 简化：第一个座位为庄家
    const sbSeat = this.nextActiveSeat(this.dealerSeat);
    const bbSeat = this.nextActiveSeat(sbSeat);

    const sb = this.getPlayerBySeat(sbSeat);
    const bb = this.getPlayerBySeat(bbSeat);
    if (sb) { sb.isSmallBlind = true; this.placeBet(sb, this.smallBlind); }
    if (bb) { bb.isBigBlind = true; this.placeBet(bb, this.bigBlind); }

    this.currentBet = this.bigBlind;

    // 发底牌（每人2张）
    for (let round = 0; round < 2; round++) {
      for (const p of activePlayers) {
        p.holeCards.push(this.deck[this.deckIndex++]);
      }
    }

    this.stage = "preflop";
    // 大盲下一个玩家先行动
    this.currentTurnSeat = this.nextActiveSeat(bbSeat);
    this.resetActed();
    this.startActionTimer();

    logger.info(`[DZPK room=${this.roomId}] 新局开始，${activePlayers.length}人，盲注${this.smallBlind}/${this.bigBlind}`);
    return true;
  }

  /** 玩家行动: action=fold/check/call/raise, amount=加注金额 */
  playerAction(userId: number, action: string, amount: number = 0): { ok: boolean; message?: string } {
    if (this.stage === "idle" || this.stage === "showdown") return { ok: false, message: "非游戏阶段" };
    const player = this.players.get(userId);
    if (!player) return { ok: false, message: "玩家不存在" };
    if (player.folded || player.allIn) return { ok: false, message: "已弃牌或全下" };
    if (player.seat !== this.currentTurnSeat) return { ok: false, message: "还没轮到你" };

    const callAmount = this.currentBet - player.currentBet;

    switch (action) {
      case "fold":
        player.folded = true;
        player.acted = true;
        logger.info(`[DZPK] 玩家${userId}弃牌`);
        break;
      case "check":
        if (callAmount > 0) return { ok: false, message: "需要跟注，不能过牌" };
        player.acted = true;
        break;
      case "call":
        if (callAmount <= 0) return { ok: false, message: "无需跟注" };
        this.placeBet(player, Math.min(callAmount, player.chips));
        player.acted = true;
        break;
      case "raise": {
        const raiseTotal = this.currentBet + amount;
        if (raiseTotal <= this.currentBet) return { ok: false, message: "加注必须大于当前下注" };
        if (amount < this.minRaise) return { ok: false, message: `最小加注${this.minRaise}` };
        const totalNeeded = raiseTotal - player.currentBet;
        this.placeBet(player, Math.min(totalNeeded, player.chips));
        this.currentBet = raiseTotal;
        this.minRaise = amount;
        this.resetActedExcept(userId);
        player.acted = true;
        break;
      }
      case "allin":
        this.placeBet(player, player.chips);
        if (player.currentBet > this.currentBet) {
          this.minRaise = player.currentBet - this.currentBet;
          this.currentBet = player.currentBet;
          this.resetActedExcept(userId);
        }
        player.acted = true;
        break;
      default:
        return { ok: false, message: "无效动作" };
    }

    this.stopActionTimer();
    this.advanceTurn();
    return { ok: true };
  }

  private placeBet(player: Player, amount: number) {
    const actual = Math.min(amount, player.chips);
    player.chips -= actual;
    player.currentBet += actual;
    player.totalBet += actual;
    this.pot += actual;
    if (player.chips === 0) player.allIn = true;
  }

  private advanceTurn() {
    // 检查是否只剩一人
    const active = this.getActivePlayers();
    if (active.length === 1) {
      this.showdown(active[0]);
      return;
    }

    // 检查本轮是否所有人都行动了
    const needAction = active.filter(p => !p.allIn && !p.acted);
    if (needAction.length === 0) {
      this.nextStage();
      return;
    }

    // 下一个需要行动的玩家
    let nextSeat = this.nextActiveSeat(this.currentTurnSeat);
    let guard = 0;
    while (guard < this.maxPlayers * 2) {
      const p = this.getPlayerBySeat(nextSeat);
      if (p && !p.folded && !p.allIn && !p.acted) {
        this.currentTurnSeat = nextSeat;
        this.startActionTimer();
        return;
      }
      nextSeat = this.nextActiveSeat(nextSeat);
      guard++;
    }
    this.nextStage();
  }

  private nextStage() {
    // 收集本轮下注
    for (const p of this.players.values()) {
      p.currentBet = 0;
      p.acted = false;
    }
    this.currentBet = 0;
    this.minRaise = this.bigBlind;

    const active = this.getActivePlayers();
    if (active.length === 1) {
      this.showdown(active[0]);
      return;
    }

    switch (this.stage) {
      case "preflop":
        // 翻牌：烧1张，发3张
        this.deckIndex++;
        this.communityCards.push(this.deck[this.deckIndex++]);
        this.communityCards.push(this.deck[this.deckIndex++]);
        this.communityCards.push(this.deck[this.deckIndex++]);
        this.stage = "flop";
        break;
      case "flop":
        this.deckIndex++;
        this.communityCards.push(this.deck[this.deckIndex++]);
        this.stage = "turn";
        break;
      case "turn":
        this.deckIndex++;
        this.communityCards.push(this.deck[this.deckIndex++]);
        this.stage = "river";
        break;
      case "river":
        this.stage = "showdown";
        this.doShowdown();
        return;
    }

    // 小盲下一个玩家先行动（翻牌后）
    const sbSeat = this.getActivePlayers().find(p => p.isSmallBlind)?.seat;
    const startSeat = sbSeat !== undefined ? this.nextActiveSeat(sbSeat) : this.nextActiveSeat(this.dealerSeat);
    this.currentTurnSeat = startSeat;
    this.resetActed();

    // 如果所有人都all-in了，直接发完公共牌
    const canAct = this.getActivePlayers().filter(p => !p.allIn);
    if (canAct.length === 0) {
      this.autoDealRemaining();
    } else {
      this.startActionTimer();
    }

    logger.info(`[DZPK room=${this.roomId}] 进入${this.stage}阶段，公共牌: ${this.communityCards.map(cardStr).join(" ")}`);
  }

  private autoDealRemaining() {
    while (this.communityCards.length < 5) {
      this.deckIndex++;
      this.communityCards.push(this.deck[this.deckIndex++]);
    }
    this.stage = "showdown";
    this.doShowdown();
  }

  private doShowdown() {
    this.stopActionTimer();
    const active = this.getActivePlayers();
    if (active.length === 1) {
      this.showdown(active[0]);
      return;
    }

    // 评估每人牌型
    const results = active.map(p => ({
      player: p,
      rank: evaluate7([...p.holeCards, ...this.communityCards]),
    }));
    results.sort((a, b) => compareHand(b.rank, a.rank));

    const bestRank = results[0].rank;
    const winners = results.filter(r => compareHand(r.rank, bestRank) === 0);
    const share = Math.floor(this.pot / winners.length);

    for (const w of winners) {
      w.player.chips += share;
    }

    this.handHistory.push({
      winner: winners.map(w => w.player.userId),
      hand: bestRank.name,
      pot: this.pot,
    });
    if (this.handHistory.length > 50) this.handHistory.shift();

    logger.info(`[DZPK room=${this.roomId}] 比牌: ${bestRank.name}, 赢家: ${winners.map(w => w.player.userId).join(",")}, 奖池: ${this.pot}`);

    this.stage = "showdown";
    // 3秒后自动开始下一局
    setTimeout(() => {
      if (this.getActivePlayers().length >= 2) this.start();
    }, 3000);
  }

  private showdown(winner: Player) {
    this.stopActionTimer();
    winner.chips += this.pot;
    this.handHistory.push({ winner: [winner.userId], hand: "其他人弃牌", pot: this.pot });
    logger.info(`[DZPK room=${this.roomId}] 玩家${winner.userId}赢走奖池${this.pot}`);
    this.stage = "showdown";
    setTimeout(() => {
      if (this.getActivePlayers().length >= 2) this.start();
    }, 3000);
  }

  private getActivePlayers(): Player[] {
    return Array.from(this.players.values()).filter(p => !p.folded);
  }

  private getPlayerBySeat(seat: number): Player | undefined {
    return Array.from(this.players.values()).find(p => p.seat === seat);
  }

  private nextActiveSeat(current: number): number {
    const seats = this.getActivePlayers().map(p => p.seat).sort((a, b) => a - b);
    if (seats.length === 0) return -1;
    const idx = seats.indexOf(current);
    return seats[(idx + 1) % seats.length];
  }

  private resetActed() {
    for (const p of this.players.values()) p.acted = false;
  }

  private resetActedExcept(userId: number) {
    for (const p of this.players.values()) {
      if (p.userId !== userId) p.acted = false;
    }
  }

  private startActionTimer() {
    this.stopActionTimer();
    this.actionTimer = setTimeout(() => {
      const p = this.getPlayerBySeat(this.currentTurnSeat);
      if (p && !p.folded && !p.allIn) {
        // 超时自动弃牌
        p.folded = true;
        p.acted = true;
        logger.info(`[DZPK] 玩家${p.userId}超时弃牌`);
        this.advanceTurn();
      }
    }, this.ACTION_TIMEOUT * 1000);
  }

  private stopActionTimer() {
    if (this.actionTimer) { clearTimeout(this.actionTimer); this.actionTimer = null; }
  }

  /** 兼容通用框架bet接口（映射到raise/call） */
  bet(userId: number, _region: number, amount: number): { ok: boolean; message?: string } {
    const player = this.players.get(userId);
    if (!player) return { ok: false, message: "玩家不存在" };
    const callAmount = this.currentBet - player.currentBet;
    if (amount <= callAmount) {
      return this.playerAction(userId, "call");
    } else {
      return this.playerAction(userId, "raise", amount - callAmount);
    }
  }

  getState() {
    return {
      gameType: this.gameType,
      roomId: this.roomId,
      stage: this.stage,
      communityCards: this.communityCards.map(cardStr),
      pot: this.pot,
      currentBet: this.currentBet,
      minRaise: this.minRaise,
      currentTurnSeat: this.currentTurnSeat,
      dealerSeat: this.dealerSeat,
      players: Array.from(this.players.values()).map(p => ({
        userId: p.userId,
        seat: p.seat,
        chips: p.chips,
        currentBet: p.currentBet,
        folded: p.folded,
        allIn: p.allIn,
        holeCards: p.holeCards.map(cardStr),
        isSmallBlind: p.isSmallBlind,
        isBigBlind: p.isBigBlind,
      })),
      handHistory: this.handHistory.slice(-10),
    };
  }

  destroy() {
    this.stopActionTimer();
    this.players.clear();
    this.communityCards = [];
  }
}

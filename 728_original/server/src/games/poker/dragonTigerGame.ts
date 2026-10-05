/**
 * 龙虎斗 (Dragon Tiger) 真实发牌算法
 * 规则: 8副牌，龙和虎各发1张，比点数大小
 * 点数: A=1, 2-10=面值, J/Q/K=10
 * 赔付: 龙赢1赔1, 虎赢1赔1, 和1赔8, 和局退还本金
 * 下注区域: 0=龙(player), 1=虎(banker), 2=和(tie)
 */
import { logger } from "../../lib/logger.js";
import { deductGold, addGold } from "../../lib/goldManager.js";

interface Card {
  suit: string;   // spades/hearts/diamonds/clubs
  rank: string;   // A,2-10,J,Q,K
  value: number;  // 点数值
}

interface BetRecord {
  userId: number;
  region: number;  // 0=龙, 1=虎, 2=和
  amount: number;
}

interface RoundHistory {
  round: number;
  winner: "dragon" | "tiger" | "tie";
  dragonCard: Card | null;
  tigerCard: Card | null;
  dragonPoint: number;
  tigerPoint: number;
}

const SUITS = ["spades", "hearts", "diamonds", "clubs"];
const RANKS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

function cardValue(rank: string): number {
  if (rank === "A") return 1;
  if (["J", "Q", "K"].includes(rank)) return 10;
  return parseInt(rank, 10);
}

function buildShoe(decks: number = 8): Card[] {
  const shoe: Card[] = [];
  for (let d = 0; d < decks; d++) {
    for (const suit of SUITS) {
      for (const rank of RANKS) {
        shoe.push({ suit, rank, value: cardValue(rank) });
      }
    }
  }
  // Fisher-Yates 洗牌
  for (let i = shoe.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shoe[i], shoe[j]] = [shoe[j], shoe[i]];
  }
  return shoe;
}

export class DragonTigerGame {
  roomId: number;
  gameType = "LHD";
  stage: "idle" | "betting" | "dealing" | "settle" = "idle";
  currentRound = 0;
  betEndTime = 0;
  dragonCard: Card | null = null;
  tigerCard: Card | null = null;
  dragonPoint = 0;
  tigerPoint = 0;
  winner: "dragon" | "tiger" | "tie" | null = null;
  bets: Map<number, BetRecord[]> = new Map();
  history: RoundHistory[] = [];
  private shoe: Card[] = [];
  private shoeIndex = 0;
  private betTimer: NodeJS.Timeout | null = null;
  private dealTimer: NodeJS.Timeout | null = null;
  private settleTimer: NodeJS.Timeout | null = null;
  private readonly BET_DURATION = 20;
  private readonly DEAL_DURATION = 3;
  private readonly SETTLE_DURATION = 2;
  readonly minBet = 10;
  readonly maxBet = 10000;

  constructor(roomId: number) {
    this.roomId = roomId;
    this.shoe = buildShoe(8);
    this.shoeIndex = 0;
  }

  /** 兼容通用游戏框架，龙虎斗不需要座位管理 */
  addPlayer(_userId: number, _seat: number = 0): boolean {
    return true;
  }

  start(): boolean {
    if (this.stage !== "idle" && this.stage !== "settle") return false;
    this.currentRound++;
    this.stage = "betting";
    this.dragonCard = null;
    this.tigerCard = null;
    this.dragonPoint = 0;
    this.tigerPoint = 0;
    this.winner = null;
    this.bets.clear();
    this.betEndTime = Date.now() + this.BET_DURATION * 1000;

    // 牌盒剩余不足时重新洗牌
    if (this.shoeIndex > this.shoe.length - 10) {
      this.shoe = buildShoe(8);
      this.shoeIndex = 0;
      logger.info(`[LHD room=${this.roomId}] 重新洗牌`);
    }

    this.clearTimers();
    this.betTimer = setTimeout(() => this.endBetting(), this.BET_DURATION * 1000);
    logger.info(`[LHD room=${this.roomId}] 第${this.currentRound}局开始下注`);
    return true;
  }

  bet(userId: number, region: number, amount: number): { ok: boolean; message?: string } {
    if (this.stage !== "betting") return { ok: false, message: "非下注阶段" };
    if (region < 0 || region > 2) return { ok: false, message: "无效下注区域" };
    if (amount < this.minBet) return { ok: false, message: `最低下注${this.minBet}` };
    if (amount > this.maxBet) return { ok: false, message: `最高下注${this.maxBet}` };

    // 扣除金币
    const deductOk = deductGold(userId, amount, "game_bet", "龙虎斗下注", this.roomId, this.currentRound);
    if (!deductOk) return { ok: false, message: "金币不足" };

    const userBets = this.bets.get(userId) || [];
    // 同一区域累计
    const existing = userBets.find((b) => b.region === region);
    if (existing) {
      existing.amount += amount;
    } else {
      userBets.push({ userId, region, amount });
    }
    this.bets.set(userId, userBets);
    return { ok: true };
  }

  private endBetting() {
    if (this.stage !== "betting") return;
    this.stage = "dealing";
    this.clearTimers();

    // 各发1张
    this.dragonCard = this.shoe[this.shoeIndex++];
    this.tigerCard = this.shoe[this.shoeIndex++];
    this.dragonPoint = this.dragonCard.value;
    this.tigerPoint = this.tigerCard.value;

    logger.info(
      `[LHD room=${this.roomId}] 发牌: 龙${this.dragonCard.rank}${this.dragonCard.suit[0].toUpperCase()}(${this.dragonPoint}) vs 虎${this.tigerCard.rank}${this.tigerCard.suit[0].toUpperCase()}(${this.tigerPoint})`
    );

    this.dealTimer = setTimeout(() => this.settle(), this.DEAL_DURATION * 1000);
  }

  private settle() {
    if (this.stage !== "dealing") return;
    this.stage = "settle";
    this.clearTimers();

    // 判断赢家
    if (this.dragonPoint > this.tigerPoint) {
      this.winner = "dragon";
    } else if (this.tigerPoint > this.dragonPoint) {
      this.winner = "tiger";
    } else {
      this.winner = "tie";
    }

    // 赔付金币
    for (const [userId, userBets] of this.bets.entries()) {
      for (const b of userBets) {
        if (b.region === 0 && this.winner === "dragon") {
          // 龙赢1赔1（含本金）
          addGold(userId, b.amount * 2, "game_win", "龙虎斗龙赢", this.roomId, this.currentRound);
        } else if (b.region === 1 && this.winner === "tiger") {
          // 虎赢1赔1（含本金）
          addGold(userId, b.amount * 2, "game_win", "龙虎斗虎赢", this.roomId, this.currentRound);
        } else if (b.region === 2 && this.winner === "tie") {
          // 和赢1赔8（含本金）
          addGold(userId, b.amount * 9, "game_win", "龙虎斗和赢", this.roomId, this.currentRound);
        } else if (this.winner === "tie" && b.region !== 2) {
          // 和局退还本金
          addGold(userId, b.amount, "bet_refund", "龙虎斗和局退还", this.roomId, this.currentRound);
        }
      }
    }

    // 记录历史
    this.history.push({
      round: this.currentRound,
      winner: this.winner,
      dragonCard: this.dragonCard,
      tigerCard: this.tigerCard,
      dragonPoint: this.dragonPoint,
      tigerPoint: this.tigerPoint,
    });
    if (this.history.length > 100) this.history.shift();

    logger.info(`[LHD room=${this.roomId}] 第${this.currentRound}局结算: ${this.winner}赢`);

    // 2秒后自动开始下一局
    this.settleTimer = setTimeout(() => this.start(), this.SETTLE_DURATION * 1000);
  }

  /**
   * 计算用户本局输赢（不直接操作金币，由调用方处理）
   * 返回 { won: 净赢金币, betTotal: 总下注, wonDetails: 各区域输赢 }
   */
  calcUserResult(userId: number): { won: number; betTotal: number; details: { region: number; bet: number; payout: number }[] } {
    const userBets = this.bets.get(userId) || [];
    let betTotal = 0;
    let won = 0;
    const details: { region: number; bet: number; payout: number }[] = [];

    for (const b of userBets) {
      betTotal += b.amount;
      let payout = 0;
      if (b.region === 0 && this.winner === "dragon") {
        payout = b.amount * 2; // 1赔1（含本金）
      } else if (b.region === 1 && this.winner === "tiger") {
        payout = b.amount * 2;
      } else if (b.region === 2 && this.winner === "tie") {
        payout = b.amount * 9; // 1赔8（含本金）
      } else if (this.winner === "tie" && b.region !== 2) {
        payout = b.amount; // 和局退还本金
      }
      won += payout - b.amount;
      details.push({ region: b.region, bet: b.amount, payout });
    }

    return { won, betTotal, details };
  }

  getState() {
    return {
      gameType: this.gameType,
      roomId: this.roomId,
      stage: this.stage,
      currentRound: this.currentRound,
      betEndTime: this.betEndTime,
      betCountdown: Math.max(0, Math.ceil((this.betEndTime - Date.now()) / 1000)),
      dragonCard: this.dragonCard,
      tigerCard: this.tigerCard,
      dragonPoint: this.dragonPoint,
      tigerPoint: this.tigerPoint,
      winner: this.winner,
      totalBets: this.getTotalBets(),
      history: this.history.slice(-20),
    };
  }

  private getTotalBets(): Record<string, number> {
    const totals: Record<string, number> = { dragon: 0, tiger: 0, tie: 0 };
    for (const userBets of this.bets.values()) {
      for (const b of userBets) {
        if (b.region === 0) totals.dragon += b.amount;
        else if (b.region === 1) totals.tiger += b.amount;
        else totals.tie += b.amount;
      }
    }
    return totals;
  }

  getUserBets(userId: number) {
    return this.bets.get(userId) || [];
  }

  private clearTimers() {
    if (this.betTimer) { clearTimeout(this.betTimer); this.betTimer = null; }
    if (this.dealTimer) { clearTimeout(this.dealTimer); this.dealTimer = null; }
    if (this.settleTimer) { clearTimeout(this.settleTimer); this.settleTimer = null; }
  }

  destroy() {
    this.clearTimers();
    this.bets.clear();
    this.history = [];
  }
}

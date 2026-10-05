/**
 * 通用电玩游戏框架 — 轮盘/下注类游戏基类
 * 支持: 多区域下注、随机开奖、赔率结算、上庄
 */
import { deductGold, addGold } from "../../lib/goldManager.js";

export type ArcadeStage = "waiting" | "betting" | "settling" | "result";

export interface ArcadeRegion {
  id: number;
  name: string;
  serverRegion: number;
  odds: number;
  wheelPositions: number[]; // 该区域在轮盘上的位置索引
}

export interface ArcadeConfig {
  gameType: string;
  regions: ArcadeRegion[];
  betDuration: number;   // 下注时长(秒)
  settleDuration: number; // 结算动画时长(秒)
  minBet: number;
  maxBet: number;
  supportBanker: boolean;
  wheelSize: number; // 轮盘总位置数
}

export interface ArcadePlayer {
  uid: number;
  bets: Map<number, number>; // regionId -> amount
  totalBet: number;
  winAmount: number;
  isBanker: boolean;
}

export class ArcadeGame {
  roomId: number;
  config: ArcadeConfig;
  stage: ArcadeStage = "waiting";
  players: Map<number, ArcadePlayer> = new Map();
  regionTotals: Map<number, number> = new Map(); // regionId -> total bet
  resultRegion: number = -1;
  resultIndex: number = -1;
  currentRound: number = 0;
  betEndTime: number = 0;
  history: { round: number; region: number; index: number }[] = [];
  bankerUid: number = -1;

  private betTimer: NodeJS.Timeout | null = null;
  private settleTimer: NodeJS.Timeout | null = null;

  constructor(roomId: number, config: ArcadeConfig) {
    this.roomId = roomId;
    this.config = config;
    for (const r of config.regions) {
      this.regionTotals.set(r.id, 0);
    }
  }

  addPlayer(uid: number): boolean {
    if (this.players.has(uid)) return false;
    this.players.set(uid, {
      uid, bets: new Map(), totalBet: 0, winAmount: 0,
      isBanker: uid === this.bankerUid,
    });
    return true;
  }

  /** 开始新一局 */
  start(): boolean {
    this.currentRound++;
    this.stage = "betting";
    this.resultRegion = -1;
    this.resultIndex = -1;
    this.betEndTime = Date.now() + this.config.betDuration * 1000;

    // 重置下注
    for (const p of this.players.values()) {
      p.bets.clear();
      p.totalBet = 0;
      p.winAmount = 0;
    }
    for (const r of this.config.regions) {
      this.regionTotals.set(r.id, 0);
    }

    // 下注倒计时结束 → 结算
    if (this.betTimer) clearTimeout(this.betTimer);
    this.betTimer = setTimeout(() => this.settle(), this.config.betDuration * 1000);

    return true;
  }

  /** 下注 */
  bet(uid: number, regionId: number, amount: number): boolean {
    if (this.stage !== "betting") return false;
    if (amount < this.config.minBet || amount > this.config.maxBet) return false;

    const region = this.config.regions.find((r) => r.id === regionId);
    if (!region) return false;

    const player = this.players.get(uid);
    if (!player) return false;

    // 金币持久化: 下注时扣除金币
    const deductResult = deductGold(uid, amount, "bet", `${this.config.gameType}下注区域${regionId}`, this.roomId, this.currentRound);
    if (!deductResult.success) return false;

    const current = player.bets.get(regionId) || 0;
    player.bets.set(regionId, current + amount);
    player.totalBet += amount;
    this.regionTotals.set(regionId, (this.regionTotals.get(regionId) || 0) + amount);
    return true;
  }

  /** 结算: 随机开奖 + 计算赔付 */
  settle(): void {
    this.stage = "settling";

    // 随机选择轮盘位置
    this.resultIndex = Math.floor(Math.random() * this.config.wheelSize);

    // 找到该位置对应的区域
    for (const region of this.config.regions) {
      if (region.wheelPositions.includes(this.resultIndex)) {
        this.resultRegion = region.id;
        break;
      }
    }

    // 计算每个玩家的输赢并赔付金币
    const winRegion = this.config.regions.find((r) => r.id === this.resultRegion);
    if (winRegion) {
      for (const p of this.players.values()) {
        const betOnWin = p.bets.get(this.resultRegion) || 0;
        if (betOnWin > 0) {
          p.winAmount = betOnWin * winRegion.odds; // 含本金的赔付
          // 金币持久化: 赔付赢家 (净利润 = winAmount - 本金)
          const netWin = p.winAmount - betOnWin;
          if (netWin > 0) {
            addGold(p.uid, netWin, "game_win", `${this.config.gameType}中奖区域${this.resultRegion}`, this.roomId, this.currentRound);
          }
        }
      }
    }

    // 记录历史
    this.history.push({ round: this.currentRound, region: this.resultRegion, index: this.resultIndex });
    if (this.history.length > 50) this.history.shift();

    // 结算动画结束 → 显示结果 → 下一局
    if (this.settleTimer) clearTimeout(this.settleTimer);
    this.settleTimer = setTimeout(() => {
      this.stage = "result";
      setTimeout(() => this.start(), 3000);
    }, this.config.settleDuration * 1000);
  }

  /** 申请上庄 */
  applyBanker(uid: number): boolean {
    if (!this.config.supportBanker) return false;
    if (this.bankerUid !== -1) return false; // 已有庄家
    const player = this.players.get(uid);
    if (!player) return false;
    this.bankerUid = uid;
    player.isBanker = true;
    return true;
  }

  /** 下庄 */
  leaveBanker(uid: number): boolean {
    if (this.bankerUid !== uid) return false;
    const player = this.players.get(uid);
    if (player) player.isBanker = false;
    this.bankerUid = -1;
    return true;
  }

  getState(): Record<string, any> {
    return {
      roomId: this.roomId,
      gameType: this.config.gameType,
      stage: this.stage,
      currentRound: this.currentRound,
      betEndTime: this.betEndTime,
      betRemain: Math.max(0, Math.ceil((this.betEndTime - Date.now()) / 1000)),
      resultRegion: this.resultRegion,
      resultIndex: this.resultIndex,
      bankerUid: this.bankerUid,
      regionTotals: Object.fromEntries(this.regionTotals),
      history: this.history.slice(-10),
      players: Array.from(this.players.values()).map((p) => ({
        uid: p.uid,
        totalBet: p.totalBet,
        winAmount: p.winAmount,
        isBanker: p.isBanker,
        bets: Object.fromEntries(p.bets),
      })),
    };
  }

  destroy(): void {
    if (this.betTimer) clearTimeout(this.betTimer);
    if (this.settleTimer) clearTimeout(this.settleTimer);
  }
}

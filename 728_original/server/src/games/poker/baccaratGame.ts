/**
 * 百家乐 (Baccarat) 真实发牌算法
 * 规则: 8副牌、庄闲各2张、按规则补第三张、比点数(0-9)
 * 赔付: 庄赢1赔1(抽5%水)、闲赢1赔1、和1赔8
 */
import { deductGold, addGold } from "../../lib/goldManager.js";

export type BaccaratStage = "idle" | "betting" | "dealing" | "player_draw" | "banker_draw" | "settling" | "result";

export interface BaccaratCard {
  suit: number;   // 0-3: 黑桃/红桃/梅花/方块
  rank: number;   // 0-12: A,2-10,J,Q,K
  point: number;  // 百家乐点数: A=1, 2-9=面值, 10/J/Q/K=0
}

export interface BaccaratPlayer {
  uid: number;
  bets: Map<number, number>;  // region(0=庄,1=闲,2=和) -> amount
  totalBet: number;
  winAmount: number;
}

const CARD_RANK_NAMES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const SUIT_NAMES = ["♠", "♥", "♣", "♦"];

export class BaccaratGame {
  roomId: number;
  gameType = "BJL";
  stage: BaccaratStage = "idle";
  currentRound = 0;

  private deck: BaccaratCard[] = [];
  private shoeIndex = 0;  // 当前牌靴位置
  private cutCardIndex = 0; // 切牌位置，到这里需要重新洗牌

  private playerCards: BaccaratCard[] = [];  // 闲家牌
  private bankerCards: BaccaratCard[] = [];  // 庄家牌
  private playerPoint = 0;
  private bankerPoint = 0;
  private winner: "banker" | "player" | "tie" | null = null;

  private players = new Map<number, BaccaratPlayer>();
  private history: { round: number; winner: string; playerPoint: number; bankerPoint: number }[] = [];

  private betTimer: NodeJS.Timeout | null = null;
  private settleTimer: NodeJS.Timeout | null = null;

  private readonly BET_DURATION = 20;  // 下注秒数
  private readonly DEAL_DURATION = 3;   // 发牌动画秒数
  private readonly MIN_BET = 10;
  private readonly MAX_BET = 10000;
  private readonly DECKS = 8;  // 8副牌
  private readonly BANKER_COMMISSION = 0.05;  // 庄赢抽水5%

  constructor(roomId: number) {
    this.roomId = roomId;
    this.initShoe();
    // 自动开始第一局
    this.start();
  }

  /** 初始化牌靴: 8副牌洗牌 + 切牌 */
  private initShoe(): void {
    this.deck = [];
    for (let d = 0; d < this.DECKS; d++) {
      for (let suit = 0; suit < 4; suit++) {
        for (let rank = 0; rank < 13; rank++) {
          const point = rank === 0 ? 1 : (rank >= 9 ? 0 : rank + 1);
          this.deck.push({ suit, rank, point });
        }
      }
    }
    // Fisher-Yates 洗牌
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
    this.shoeIndex = 0;
    // 切牌: 在最后1/8处插入切牌标记
    this.cutCardIndex = this.deck.length - Math.floor(this.deck.length / 8);
  }

  /** 发一张牌 */
  private drawCard(): BaccaratCard {
    if (this.shoeIndex >= this.cutCardIndex) {
      this.initShoe();  // 到切牌位置，重新洗牌
    }
    return this.deck[this.shoeIndex++];
  }

  /** 计算点数 (取个位) */
  private calcPoint(cards: BaccaratCard[]): number {
    const sum = cards.reduce((s, c) => s + c.point, 0);
    return sum % 10;
  }

  addPlayer(uid: number): void {
    if (!this.players.has(uid)) {
      this.players.set(uid, { uid, bets: new Map(), totalBet: 0, winAmount: 0 });
    }
  }

  /** 开始新一局 */
  start(): boolean {
    if (this.stage === "betting") return false;
    this.currentRound++;
    this.stage = "betting";
    console.log(`[BJL] 第${this.currentRound}局开始，下注倒计时${this.BET_DURATION}秒`);
    this.playerCards = [];
    this.bankerCards = [];
    this.playerPoint = 0;
    this.bankerPoint = 0;
    this.winner = null;
    // 清空上一局下注
    for (const p of this.players.values()) {
      p.bets.clear();
      p.totalBet = 0;
      p.winAmount = 0;
    }

    // 下注倒计时
    if (this.betTimer) clearTimeout(this.betTimer);
    this.betTimer = setTimeout(() => {
      console.log(`[BJL] 第${this.currentRound}局下注结束，开始发牌`);
      this.deal();
    }, this.BET_DURATION * 1000);
    return true;
  }

  /** 下注 */
  bet(uid: number, region: number, amount: number): boolean {
    // idle状态自动开始
    if (this.stage === "idle") this.start();
    if (this.stage !== "betting") return false;
    if (region < 0 || region > 2) return false;
    if (amount < this.MIN_BET || amount > this.MAX_BET) return false;

    // 玩家不存在则自动添加
    if (!this.players.has(uid)) {
      this.addPlayer(uid);
    }
    const player = this.players.get(uid);
    if (!player) return false;

    // 扣除金币
    const deductResult = deductGold(uid, amount, "bet", `百家乐下注${["庄", "闲", "和"][region]}`, this.roomId, this.currentRound);
    if (!deductResult.success) return false;

    const current = player.bets.get(region) || 0;
    player.bets.set(region, current + amount);
    player.totalBet += amount;
    return true;
  }

  /** 发牌: 闲→庄→闲→庄 (各2张) */
  private deal(): void {
    this.stage = "dealing";
    console.log(`[BJL] 第${this.currentRound}局发牌中...`);
    // 百家乐发牌顺序: 闲1, 庄1, 闲2, 庄2
    this.playerCards.push(this.drawCard());
    this.bankerCards.push(this.drawCard());
    this.playerCards.push(this.drawCard());
    this.bankerCards.push(this.drawCard());

    this.playerPoint = this.calcPoint(this.playerCards);
    this.bankerPoint = this.calcPoint(this.bankerCards);
    console.log(`[BJL] 闲${this.playerPoint}点 庄${this.bankerPoint}点`);

    // 发牌动画后判断是否需要补牌
    setTimeout(() => this.processDraws(), this.DEAL_DURATION * 1000);
  }

  /** 处理补牌逻辑 */
  private processDraws(): void {
    // 天牌: 任一方8或9点，直接开牌
    if (this.playerPoint >= 8 || this.bankerPoint >= 8) {
      this.settle();
      return;
    }

    // 闲家补牌: 0-5点补，6-7点不补
    let playerDrew = false;
    let playerThirdCard: BaccaratCard | null = null;

    if (this.playerPoint <= 5) {
      playerThirdCard = this.drawCard();
      this.playerCards.push(playerThirdCard);
      this.playerPoint = this.calcPoint(this.playerCards);
      playerDrew = true;
      this.stage = "player_draw";
    }

    // 庄家补牌规则
    setTimeout(() => {
      this.bankerDraw(playerDrew, playerThirdCard);
    }, 1500);
  }

  /** 庄家补牌 */
  private bankerDraw(playerDrew: boolean, playerThirdCard: BaccaratCard | null): void {
    let bankerShouldDraw = false;

    if (!playerDrew) {
      // 闲家没补牌: 庄家0-5补，6-7不补
      bankerShouldDraw = this.bankerPoint <= 5;
    } else {
      // 闲家补了牌，根据庄家点数和闲家第三张牌决定
      const pt = playerThirdCard!.point;
      switch (this.bankerPoint) {
        case 0:
        case 1:
        case 2:
          bankerShouldDraw = true;  // 0-2必补
          break;
        case 3:
          bankerShouldDraw = pt !== 8;  // 3: 闲家第三张不是8则补
          break;
        case 4:
          bankerShouldDraw = pt >= 2 && pt <= 7;  // 4: 闲家第三张2-7则补
          break;
        case 5:
          bankerShouldDraw = pt >= 4 && pt <= 7;  // 5: 闲家第三张4-7则补
          break;
        case 6:
          bankerShouldDraw = pt === 6 || pt === 7;  // 6: 闲家第三张6-7则补
          break;
        case 7:
          bankerShouldDraw = false;  // 7不补
          break;
      }
    }

    if (bankerShouldDraw) {
      this.bankerCards.push(this.drawCard());
      this.bankerPoint = this.calcPoint(this.bankerCards);
      this.stage = "banker_draw";
    }

    setTimeout(() => this.settle(), 1500);
  }

  /** 结算 */
  private settle(): void {
    this.stage = "settling";
    console.log(`[BJL] 第${this.currentRound}局结算中...`);

    // 确定赢家
    if (this.playerPoint === this.bankerPoint) {
      this.winner = "tie";
    } else if (this.playerPoint > this.bankerPoint) {
      this.winner = "player";
    } else {
      this.winner = "banker";
    }

    // 赔付
    for (const p of this.players.values()) {
      let totalWin = 0;
      // 庄赢
      const betBanker = p.bets.get(0) || 0;
      if (betBanker > 0 && this.winner === "banker") {
        // 庄赢1赔1，抽5%水
        const win = Math.floor(betBanker * (1 - this.BANKER_COMMISSION));
        totalWin += betBanker + win;  // 本金+净利润
        if (win > 0) addGold(p.uid, betBanker + win, "game_win", "百家乐庄赢", this.roomId, this.currentRound);
      } else if (betBanker > 0 && this.winner === "tie") {
        // 和局退还庄下注
        addGold(p.uid, betBanker, "bet_refund", "百家乐和局退还", this.roomId, this.currentRound);
      }
      // 闲赢
      const betPlayer = p.bets.get(1) || 0;
      if (betPlayer > 0 && this.winner === "player") {
        totalWin += betPlayer * 2;  // 1赔1（含本金）
        addGold(p.uid, betPlayer * 2, "game_win", "百家乐闲赢", this.roomId, this.currentRound);
      } else if (betPlayer > 0 && this.winner === "tie") {
        addGold(p.uid, betPlayer, "bet_refund", "百家乐和局退还", this.roomId, this.currentRound);
      }
      // 和赢
      const betTie = p.bets.get(2) || 0;
      if (betTie > 0 && this.winner === "tie") {
        totalWin += betTie * 9;  // 1赔8（含本金）
        addGold(p.uid, betTie * 9, "game_win", "百家乐和赢", this.roomId, this.currentRound);
      }
      p.winAmount = totalWin;
    }

    // 记录历史
    this.history.push({
      round: this.currentRound,
      winner: this.winner,
      playerPoint: this.playerPoint,
      bankerPoint: this.bankerPoint,
    });
    if (this.history.length > 50) this.history.shift();

    // 结果展示后自动下一局
    this.stage = "result";
    if (this.settleTimer) clearTimeout(this.settleTimer);
    this.settleTimer = setTimeout(() => this.start(), 5000);
  }

  /** 获取游戏状态 */
  getState(): any {
    return {
      gameType: this.gameType,
      roomId: this.roomId,
      stage: this.stage,
      currentRound: this.currentRound,
      playerCards: this.playerCards.map(c => this.cardToString(c)),
      bankerCards: this.bankerCards.map(c => this.cardToString(c)),
      playerPoint: this.playerPoint,
      bankerPoint: this.bankerPoint,
      winner: this.winner,
      history: this.history.slice(-20),
      betRemain: this.stage === "betting" ? this.BET_DURATION : 0,
      playerCount: this.players.size,
    };
  }

  /** 获取指定玩家的下注信息 {0:庄,1:闲,2:和} */
  getPlayerBets(userId: number): Record<number, number> {
    const p = this.players.get(userId);
    if (!p) return { 0: 0, 1: 0, 2: 0 };
    return {
      0: p.bets.get(0) || 0,
      1: p.bets.get(1) || 0,
      2: p.bets.get(2) || 0,
    };
  }

  private cardToString(card: BaccaratCard): string {
    return SUIT_NAMES[card.suit] + CARD_RANK_NAMES[card.rank];
  }

  /** 销毁 */
  destroy(): void {
    if (this.betTimer) clearTimeout(this.betTimer);
    if (this.settleTimer) clearTimeout(this.settleTimer);
    this.players.clear();
  }
}

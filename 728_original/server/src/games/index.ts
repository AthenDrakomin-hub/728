/**
 * 游戏管理器 — 统一管理所有游戏实例
 * 支持按 gameType 注册和创建游戏
 */
import { MahjongGame } from "./mahjong/mahjongGame.js";
import { createWZMJ } from "./mahjong/wzmj.js";
import { NiuNiuGame } from "./niuniu/niuniuGame.js";
import { ZJHGame } from "./zhajinhua/zhajinhuaGame.js";
import { ArcadeGame } from "./arcade/arcadeGame.js";
import { createBCBM } from "./arcade/bcbm.js";
import { createFQZS } from "./arcade/fqzs.js";
import { createJXLW } from "./arcade/jxlw.js";
import { createDNTG } from "./arcade/dntg.js";
import { createDFDC } from "./arcade/dfdc.js";
import { createHBSL } from "./arcade/hbsl.js";
import { createLHD } from "./arcade/lhd.js";
import { createBJL } from "./arcade/bjl.js";
import { createDZPK } from "./poker/dzpk.js";
import { createSDB } from "./poker/sdb.js";
import { createERQS } from "./poker/erqs.js";
import { createMJHJ } from "./mahjong/mjhj.js";
import { createHLWZ } from "./mahjong/hlwz.js";

export type GameInstance = MahjongGame | NiuNiuGame | ZJHGame | ArcadeGame;
export type GameFactory = (roomId: number) => GameInstance;

const factories: Map<string, GameFactory> = new Map();

// === 麻将类 ===
factories.set("WZMJ", createWZMJ);
factories.set("MJHJ", createMJHJ); // 麻将胡了
factories.set("HLWZ", createHLWZ); // 红中五子

// === 牛牛类 ===
factories.set("BRNN", (roomId) => new NiuNiuGame(roomId, "BRNN", { maxSeats: 5, baseBet: 10 })); // 百人牛牛
factories.set("ERNN", (roomId) => new NiuNiuGame(roomId, "ERNN", { maxSeats: 5, baseBet: 10 })); // 二人牛牛
factories.set("QZNN", (roomId) => new NiuNiuGame(roomId, "QZNN", { maxSeats: 5, baseBet: 10, allowQiangZhuang: true })); // 抢庄牛牛
factories.set("SRNN", (roomId) => new NiuNiuGame(roomId, "SRNN", { maxSeats: 5, baseBet: 10 })); // 四人牛牛
factories.set("TBNN", (roomId) => new NiuNiuGame(roomId, "TBNN", { maxSeats: 5, baseBet: 10 })); // 通比牛牛

// === 扑克类 ===
factories.set("ZJH", (roomId) => new ZJHGame(roomId, "ZJH", { maxSeats: 5, baseBet: 5 })); // 炸金花
factories.set("SHZ", (roomId) => new ZJHGame(roomId, "SHZ", { maxSeats: 5, baseBet: 5 })); // 三张牌
factories.set("DZPK", (roomId) => createDZPK(roomId)); // 德州扑克(简化)
factories.set("SDB", (roomId) => createSDB(roomId)); // 三公
factories.set("ERQS", (roomId) => createERQS(roomId)); // 二人抢庄
factories.set("BJL", (roomId) => createBJL(roomId)); // 百家乐
factories.set("LHD", (roomId) => createLHD(roomId)); // 龙虎斗

// === 电玩类 ===
factories.set("BCBM", (roomId) => createBCBM(roomId)); // 奔驰宝马
factories.set("FQZS", (roomId) => createFQZS(roomId)); // 飞禽走兽
factories.set("JXLW", (roomId) => createJXLW(roomId)); // 金鲨银鲨
factories.set("DNTG", (roomId) => createDNTG(roomId)); // 大闹天宫
factories.set("DFDC", (roomId) => createDFDC(roomId)); // 东方明珠
factories.set("HBSL", (roomId) => createHBSL(roomId)); // 红包扫雷

export function registerGame(gameType: string, factory: GameFactory): void {
  factories.set(gameType, factory);
}

export function createGame(gameType: string, roomId: number): GameInstance | null {
  const factory = factories.get(gameType);
  if (!factory) return null;
  return factory(roomId);
}

export function getSupportedGames(): string[] {
  return Array.from(factories.keys());
}

// 游戏实例池: roomId -> game
const gameInstances: Map<number, GameInstance> = new Map();

export function getGame(roomId: number): GameInstance | undefined {
  return gameInstances.get(roomId);
}

export function setGame(roomId: number, game: GameInstance): void {
  gameInstances.set(roomId, game);
}

export function removeGame(roomId: number): void {
  gameInstances.delete(roomId);
}

/** 销毁所有游戏实例 (优雅关闭用) */
export function destroyAllGames(): void {
  for (const [roomId, game] of gameInstances) {
    try {
      if (typeof (game as any).destroy === "function") {
        (game as any).destroy();
      }
    } catch (e) {
      // ignore
    }
    gameInstances.delete(roomId);
  }
}

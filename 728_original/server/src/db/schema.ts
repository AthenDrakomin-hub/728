import { Table } from "./jsonDb.js";

// 字段类型辅助
export const integer = (def = 0) => def;
export const text = (def = "") => def;
export const boolean = (def = false) => def;
export const jsonb = (def: any = {}) => def;

// 用户表
export interface User {
  id: number;
  account: string;
  password: string;
  securityCode: string;
  nickname: string;
  avatar: string;
  headFrame: string;
  gold: number;
  bankGold: number;
  rcard: number;
  status: number; // 1 正常，0 封禁
  role: "player" | "agent" | "top_agent" | "admin";
  agentPower: number;
  power: number;
  control: number;
  controlGold: number;
  monthlyEnd: number;
  income: number;
  expenditure: number;
  inviteCode: string;
  invitedById: number | null;
  invitedByCode: string | null;
  deviceId: string;
  lastLoginAt: number;
  lastLoginIp: string;
  createdAt: number;
}

export const users = new Table<User>("users", []);

// 管理员表
export interface AdminUser {
  id: number;
  account: string;
  password: string;
  name: string;
  role: string;
  createdAt: number;
  lastLoginAt: number | null;
}

export const adminUsers = new Table<AdminUser>("adminUsers", []);

// 在线会话
export interface OnlineSession {
  id: number;
  userId: number;
  token: string;
  deviceId: string;
  lastHeartbeat: number;
  createdAt: number;
}

export const onlineSessions = new Table<OnlineSession>("onlineSessions", []);

// 设备表
export interface Device {
  id: number;
  userId: number;
  deviceId: string;
  name: string;
  platform: string;
  trusted: boolean;
  createdAt: number;
  lastActiveAt: number;
}

export const devices = new Table<Device>("devices", []);

// 房间表
export interface Room {
  id: number;
  roomNo: string;
  password: string;
  gameType: string;
  level: number;
  status: number; // 0 等待中，1 游戏中，2 已结束
  agentId: number;
  clubId: number | null;
  currentRound: number;
  totalRounds: number;
  maxSeats: number;
  initialGold: number;
  totalFlow: number;
  totalRake: number;
  rule: Record<string, any>;
  createdAt: number;
  startedAt: number | null;
  endedAt: number | null;
}

export const rooms = new Table<Room>("rooms", []);

// 房间玩家
export interface RoomPlayer {
  id: number;
  roomId: number;
  userId: number;
  seat: number;
  gold: number;
  ready: boolean;
  isSpectator: boolean;
  joinedAt: number;
}

export const roomPlayers = new Table<RoomPlayer>("roomPlayers", []);

// 游戏回合
export interface GameRound {
  id: number;
  roomId: number;
  roundNo: number;
  gameType: string;
  status: number;
  dealerSeat: number | null;
  cards: Record<string, any>;
  actions: any[];
  result: Record<string, any> | null;
  rakeAmount: number;
  startedAt: number;
  endedAt: number | null;
}

export const gameRounds = new Table<GameRound>("gameRounds", []);

// 金币流水
export interface ChipTransaction {
  id: number;
  userId: number;
  type: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  roomId: number | null;
  roundId: number | null;
  remark: string;
  createdAt: number;
}

export const chipTransactions = new Table<ChipTransaction>("chipTransactions", []);

// 信用分流水
export interface CreditTransaction {
  id: number;
  userId: number;
  agentId: number | null;
  type: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  remark: string;
  createdAt: number;
}

export const creditTransactions = new Table<CreditTransaction>("creditTransactions", []);

// 抽水记录
export interface DeductionRecord {
  id: number;
  roomId: number;
  roundId: number;
  userId: number;
  amount: number;
  rate: number;
  agentId: number | null;
  createdAt: number;
}

export const deductionRecords = new Table<DeductionRecord>("deductionRecords", []);

// 系统配置
export interface SystemConfig {
  id: number;
  key: string;
  value: string;
  updatedAt: number;
}

export const systemConfig = new Table<SystemConfig>("systemConfig", []);

// 游戏配置
export interface GameConfig {
  id: number;
  gameType: string;
  name: string;
  baseScore: number;
  minEntry: number;
  enabled: boolean;
  maintenance: boolean;
  rule: Record<string, any>;
  updatedAt: number;
}

export const gameConfigs = new Table<GameConfig>("gameConfigs", []);

// 房间聊天
export interface RoomMessage {
  id: number;
  roomId: number;
  userId: number;
  content: string;
  type: string;
  createdAt: number;
}

export const roomMessages = new Table<RoomMessage>("roomMessages", []);

import { Table } from "./sqliteDb.js";

// 瀛楁绫诲瀷杈呭姪
export const integer = (def = 0) => def;
export const text = (def = "") => def;
export const boolean = (def = false) => def;
export const jsonb = (def: any = {}) => def;

// 鐢ㄦ埛琛?
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
  status: number; // 1 姝ｅ父锛? 灏佺
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

// 绠＄悊鍛樿〃
export interface AdminUser {
  id: number;
  account: string;
  password: string;
  name: string;
  role: string;
  createdAt: number;
  lastLoginAt: number | null;
}

export const adminUsers = new Table<AdminUser>("admin_users", []);

// 鍦ㄧ嚎浼氳瘽
export interface OnlineSession {
  id: number;
  userId: number;
  token: string;
  deviceId: string;
  lastHeartbeat: number;
  createdAt: number;
}

export const onlineSessions = new Table<OnlineSession>("online_sessions", []);

// 璁惧琛?
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

// 鎴块棿琛?
export interface Room {
  id: number;
  roomNo: string;
  password: string;
  gameType: string;
  level: number;
  status: number; // 0 绛夊緟涓紝1 娓告垙涓紝2 宸茬粨鏉?
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

// 鎴块棿鐜╁
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

export const roomPlayers = new Table<RoomPlayer>("room_players", []);

// 娓告垙鍥炲悎
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

export const gameRounds = new Table<GameRound>("game_rounds", []);

// 閲戝竵娴佹按
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

export const chipTransactions = new Table<ChipTransaction>("chip_transactions", []);

// 淇＄敤鍒嗘祦姘?
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

export const creditTransactions = new Table<CreditTransaction>("credit_transactions", []);

// 鎶芥按璁板綍
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

export const deductionRecords = new Table<DeductionRecord>("deduction_records", []);

// 绯荤粺閰嶇疆
export interface SystemConfig {
  id: number;
  key: string;
  value: string;
  updatedAt: number;
}

export const systemConfig = new Table<SystemConfig>("system_config", []);

// 娓告垙閰嶇疆
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

export const gameConfigs = new Table<GameConfig>("game_configs", []);

// 鎴块棿鑱婂ぉ
export interface RoomMessage {
  id: number;
  roomId: number;
  userId: number;
  content: string;
  type: string;
  createdAt: number;
}

export const roomMessages = new Table<RoomMessage>("room_messages", []);

// ============================================================
// 鏂板琛?(閾惰/鎺у垎/鏁戞祹閲?
// ============================================================

// 閾惰瀛樺彇璁板綍
export interface UserBank {
  id: number;
  userId: number;
  type: string; // deposit / withdraw
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  remark: string;
  createdAt: number;
}
export const userBanks = new Table<UserBank>("user_banks", []);

// 鎺у垎/鏀炬按璁板綍
export interface ControlRecord {
  id: number;
  userId: number;
  operatorId: number;
  roomId: number | null;
  gameType: string;
  action: string; // control / release / adjust
  targetGold: number;
  remark: string;
  createdAt: number;
}
export const controlRecords = new Table<ControlRecord>("control_records", []);

// 鏁戞祹閲戦鍙栬褰?
export interface Benefit {
  id: number;
  userId: number;
  amount: number;
  times: number;
  createdAt: number;
}
export const benefits = new Table<Benefit>("benefits", []);

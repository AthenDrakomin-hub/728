import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";

// Roles: admin | customer_service | top_agent | agent | player
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  account: text("account").notNull().unique(),
  password: text("password").notNull(),
  securityCode: text("security_code").notNull(),
  role: text("role").notNull().default("player"),
  // 个人资料
  nickname: text("nickname"),
  avatar: text("avatar").notNull().default("1"),
  signature: text("signature"),
  // 设置项 (JSON: sound/music/vibrate 等)
  settings: jsonb("settings"),
  lastLoginAt: timestamp("last_login_at"),
  // Invite code this user OWNS (agents/top agents share to downlines)
  inviteCode: text("invite_code").notNull().unique(),
  // Which invite code was used to register (links to upline)
  invitedByCode: text("invited_by_code"),
  invitedById: integer("invited_by_id"),
  // Credit score (信用分) - only meaningful for agents. 1 credit = 1 point.
  credit: integer("credit").notNull().default(0),
  // Commission balance (返佣余额) - agents/top_agents earn from room flow
  commission: integer("commission").notNull().default(0),
  // Agent commission rate (代理返佣比例) - percentage integer, e.g. 1 = 1%, 0 = no commission
  agentCommissionRate: integer("agent_commission_rate").notNull().default(1),
  // Top agent commission rate (总代理返佣比例) - percentage integer
  topAgentCommissionRate: integer("top_agent_commission_rate").notNull().default(1),
  // In-game points wallet (players carry points across rooms)
  points: integer("points").notNull().default(0),
  // If agent has any failed deduction, they cannot open new rooms
  openRoomBlocked: boolean("open_room_blocked").notNull().default(false),
  // Force password change on next login (admin default account)
  mustChangePassword: boolean("must_change_password").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Rooms
export const rooms = pgTable("rooms", {
  id: serial("id").primaryKey(),
  roomNo: text("room_no").notNull().unique(),
  password: text("password").notNull(),
  gameType: text("game_type").notNull(), // texas | jinhua | sangong | niuniu
  level: text("level").notNull(), // junior | senior | top
  initialPoints: integer("initial_points").notNull(),
  agentId: integer("agent_id").notNull(),
  status: text("status").notNull().default("waiting"), // waiting | playing | waiting_continue | finished
  currentRound: integer("current_round").notNull().default(0),
  totalRounds: integer("total_rounds").notNull().default(25),
  maxSeats: integer("max_seats").notNull().default(8),
  // Accumulated stats
  totalRake: integer("total_rake").notNull().default(0), // 3% platform rake accumulated
  totalFlow: integer("total_flow").notNull().default(0), // total winnings flow across rounds
  settled: boolean("settled").notNull().default(false),
  archivedAt: timestamp("archived_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Players present in a room (seat + points)
export const roomPlayers = pgTable("room_players", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").notNull(),
  userId: integer("user_id").notNull(),
  seat: integer("seat").notNull(),
  points: integer("points").notNull(),
  isSpectator: boolean("is_spectator").notNull().default(false),
  ready: boolean("ready").notNull().default(false),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
});

// Each played round's result
export const gameRounds = pgTable("game_rounds", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").notNull(),
  roundNo: integer("round_no").notNull(),
  gameType: text("game_type").notNull(),
  // full result payload (hands, winner, etc.)
  result: jsonb("result").notNull(),
  winnerUserId: integer("winner_user_id"),
  potBeforeRake: integer("pot_before_rake").notNull().default(0),
  rake: integer("rake").notNull().default(0), // 3% of winnings
  resultIsSummary: boolean("result_is_summary").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Live hand state for an in-progress deal (real-time player actions)
export const handStates = pgTable("hand_states", {
  roomId: integer("room_id").primaryKey(),
  state: jsonb("state").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// 玩家筹码流水（代理上下分审计）
export const chipTransactions = pgTable("chip_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),      // 玩家
  operatorId: integer("operator_id"),         // 操作代理
  amount: integer("amount").notNull(),        // + 上分 / - 下分
  balanceAfter: integer("balance_after").notNull(),
  type: text("type").notNull(),               // agent_add | agent_sub | buyin | cashout | room_gift
  note: text("note"),
  roomId: integer("room_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// 房间聊天 / 互动消息
export const roomMessages = pgTable("room_messages", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").notNull(),
  userId: integer("user_id").notNull(),
  kind: text("kind").notNull(), // text | quick | emoji | interact
  content: text("content").notNull(),
  targetUserId: integer("target_user_id"), // 互动表情的目标玩家
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// 设备关联（登录设备管理）
export const devices = pgTable("devices", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  deviceId: text("device_id").notNull(),
  name: text("name").notNull(),
  platform: text("platform"),
  lastActiveAt: timestamp("last_active_at").notNull().defaultNow(),
  trusted: boolean("trusted").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Credit transactions (customer service adjusts agent credit; deductions; commission)
export const creditTransactions = pgTable("credit_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  amount: integer("amount").notNull(), // + or -
  balanceAfter: integer("balance_after").notNull(),
  type: text("type").notNull(), // cs_adjust | room_deduct | commission | gift
  note: text("note"),
  operatorId: integer("operator_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Deduction records for a room's total settlement (2% of total flow from agent credit)
export const deductionRecords = pgTable("deduction_records", {
  id: serial("id").primaryKey(),
  roomId: integer("room_id").notNull(),
  agentId: integer("agent_id").notNull(),
  totalFlow: integer("total_flow").notNull(),
  amount: integer("amount").notNull(), // 2% of total flow
  success: boolean("success").notNull(),
  resolved: boolean("resolved").notNull().default(false), // failed then later paid
  gameType: text("game_type"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// 系统全局配置（管理员可修改的比例等）
export const systemConfig = pgTable("system_config", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

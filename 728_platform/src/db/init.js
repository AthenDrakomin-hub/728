// 数据库初始化 - SQLite
const Database = require("better-sqlite3");
const path = require("path");
const config = require("../config");

const DB_PATH = path.resolve(config.DB_PATH);
const fs = require("fs");
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// ==================== 建表 ====================
db.exec(`
  -- 用户表
  CREATE TABLE IF NOT EXISTS users (
    uid INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    nickname TEXT DEFAULT '',
    avatar TEXT DEFAULT '',
    phone TEXT DEFAULT '',
    user_type TEXT DEFAULT 'player' CHECK(user_type IN ('player','agent','top_agent','admin')),
    parent_agent_id INTEGER DEFAULT NULL,
    invite_code TEXT DEFAULT NULL,
    agent_power INTEGER DEFAULT 0,
    is_banned INTEGER DEFAULT 0,
    banned_reason TEXT DEFAULT '',
    register_ip TEXT DEFAULT '',
    last_login_ip TEXT DEFAULT '',
    last_login_time DATETIME DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- 筹码账户
  CREATE TABLE IF NOT EXISTS points_account (
    uid INTEGER PRIMARY KEY,
    points REAL DEFAULT 0,
    frozen_points REAL DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uid) REFERENCES users(uid)
  );

  -- 信用分账户（仅代理/总代理）
  CREATE TABLE IF NOT EXISTS credit_account (
    uid INTEGER PRIMARY KEY,
    credit REAL DEFAULT 0,
    frozen_credit REAL DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uid) REFERENCES users(uid)
  );

  -- 返佣账户（仅代理/总代理）
  CREATE TABLE IF NOT EXISTS commission_account (
    uid INTEGER PRIMARY KEY,
    commission REAL DEFAULT 0,
    total_commission REAL DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (uid) REFERENCES users(uid)
  );

  -- 筹码变动审计表
  CREATE TABLE IF NOT EXISTS chip_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uid INTEGER NOT NULL,
    room_id INTEGER DEFAULT NULL,
    type TEXT NOT NULL,
    amount REAL NOT NULL DEFAULT 0,
    balance_before REAL NOT NULL DEFAULT 0,
    balance_after REAL NOT NULL DEFAULT 0,
    operator_uid INTEGER DEFAULT NULL,
    note TEXT DEFAULT '',
    display_tag TEXT DEFAULT '',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- 房间表
  CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_code TEXT NOT NULL UNIQUE,
    game_type TEXT NOT NULL,
    owner_uid INTEGER NOT NULL,
    max_buyin REAL NOT NULL DEFAULT 100000,
    min_buyin REAL NOT NULL DEFAULT 100,
    max_players INTEGER NOT NULL DEFAULT 6,
    cur_players INTEGER DEFAULT 0,
    status TEXT DEFAULT 'waiting' CHECK(status IN ('waiting','playing','settling','closed')),
    total_flow REAL DEFAULT 0,
    total_rake REAL DEFAULT 0,
    agent_credit_cost REAL DEFAULT 0,
    agent_commission REAL DEFAULT 0,
    top_agent_commission REAL DEFAULT 0,
    platform_net REAL DEFAULT 0,
    total_rounds INTEGER DEFAULT 0,
    cur_round INTEGER DEFAULT 0,
    started_at DATETIME DEFAULT NULL,
    ended_at DATETIME DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- 房间玩家
  CREATE TABLE IF NOT EXISTS room_players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_id INTEGER NOT NULL,
    uid INTEGER NOT NULL,
    seat INTEGER NOT NULL DEFAULT 0,
    points REAL DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK(status IN ('active','left')),
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    left_at DATETIME DEFAULT NULL,
    FOREIGN KEY (room_id) REFERENCES rooms(id)
  );

  -- 对账明细表
  CREATE TABLE IF NOT EXISTS settlement_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_id INTEGER NOT NULL,
    game_type TEXT NOT NULL,
    owner_uid INTEGER NOT NULL,
    total_flow REAL NOT NULL DEFAULT 0,
    total_rake REAL NOT NULL DEFAULT 0,
    credit_cost REAL NOT NULL DEFAULT 0,
    agent_commission REAL NOT NULL DEFAULT 0,
    top_agent_commission REAL NOT NULL DEFAULT 0,
    platform_net REAL NOT NULL DEFAULT 0,
    settled_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- 系统配置表
  CREATE TABLE IF NOT EXISTS system_config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    description TEXT DEFAULT '',
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  -- 在线用户表
  CREATE TABLE IF NOT EXISTS online_users (
    uid INTEGER PRIMARY KEY,
    ws_session_id TEXT,
    login_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_heartbeat DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// ==================== 初始化默认数据 ====================
const bcrypt = require("bcryptjs");

// 默认管理员
const existingAdmin = db.prepare("SELECT uid FROM users WHERE username = ?").get(config.DEFAULT_ADMIN.username);
if (!existingAdmin) {
  const hash = bcrypt.hashSync(config.DEFAULT_ADMIN.password, 10);
  const result = db.prepare(
    "INSERT INTO users (username, password, nickname, user_type, agent_power) VALUES (?, ?, ?, ?, ?)"
  ).run(config.DEFAULT_ADMIN.username, hash, config.DEFAULT_ADMIN.nickname, "admin", 1);
  const uid = result.lastInsertRowid;
  db.prepare("INSERT INTO points_account (uid, points) VALUES (?, 999999999)").run(uid);
  db.prepare("INSERT INTO credit_account (uid, credit) VALUES (?, 999999999)").run(uid);
  db.prepare("INSERT INTO commission_account (uid, commission, total_commission) VALUES (?, 0, 0)").run(uid);
  console.log(`[DB] 默认管理员创建: uid=${uid}, admin/123456`);
}

// 默认系统配置
const defaultConfigs = [
  ["platform_rake_rate", "3", "平台抽水比例(%)"],
  ["agent_deduct_rate", "2", "代理信用分扣除比例(%)"],
  ["agent_commission_rate", "1", "代理返佣比例(%)"],
  ["top_agent_commission_rate", "1", "总代理返佣比例(%)"],
  ["max_rooms_per_agent", "10", "每人最多开房数"],
  ["default_max_buyin", "100000", "默认买入上限"],
  ["default_min_buyin", "100", "默认买入下限"],
];
const insertConfig = db.prepare("INSERT OR IGNORE INTO system_config (key, value, description) VALUES (?, ?, ?)");
for (const [key, value, desc] of defaultConfigs) {
  insertConfig.run(key, value, desc);
}

console.log("[DB] 数据库初始化完成");
module.exports = db;
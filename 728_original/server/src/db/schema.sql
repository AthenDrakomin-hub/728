-- 728 棋牌平台数据库 Schema (SQLite / MySQL 兼容)
-- 生成时间: 2026-10-03

PRAGMA journal_mode=WAL;
PRAGMA foreign_keys=ON;

-- ============================================================
-- 用户体系
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  account       TEXT    NOT NULL UNIQUE,
  password      TEXT    NOT NULL DEFAULT '',
  security_code TEXT    NOT NULL DEFAULT '',
  nickname      TEXT    NOT NULL DEFAULT '',
  avatar        TEXT    NOT NULL DEFAULT '',
  head_frame    TEXT    NOT NULL DEFAULT '',
  gold          INTEGER NOT NULL DEFAULT 0,       -- 身上金币
  bank_gold     INTEGER NOT NULL DEFAULT 0,       -- 银行金币
  rcard         INTEGER NOT NULL DEFAULT 0,       -- 房卡
  status        INTEGER NOT NULL DEFAULT 1,       -- 1正常 0封禁
  role          TEXT    NOT NULL DEFAULT 'player',-- player/agent/top_agent/admin
  agent_power   INTEGER NOT NULL DEFAULT 0,       -- 代理权限
  power         INTEGER NOT NULL DEFAULT 0,       -- 控分权限
  control       INTEGER NOT NULL DEFAULT 0,       -- 控分开关
  control_gold  INTEGER NOT NULL DEFAULT 0,       -- 控分目标
  monthly_end   INTEGER NOT NULL DEFAULT 0,       -- 包月到期时间
  income        INTEGER NOT NULL DEFAULT 0,       -- 累计收入
  expenditure   INTEGER NOT NULL DEFAULT 0,       -- 累计支出
  invite_code   TEXT    NOT NULL DEFAULT '',
  invited_by_id INTEGER DEFAULT NULL,
  invited_by_code TEXT  DEFAULT NULL,
  device_id     TEXT    NOT NULL DEFAULT '',
  last_login_at INTEGER NOT NULL DEFAULT 0,
  last_login_ip TEXT    NOT NULL DEFAULT '',
  created_at    INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);
CREATE INDEX IF NOT EXISTS idx_users_account ON users(account);
CREATE INDEX IF NOT EXISTS idx_users_invite_code ON users(invite_code);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 管理员
CREATE TABLE IF NOT EXISTS admin_users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  account       TEXT    NOT NULL UNIQUE,
  password      TEXT    NOT NULL,
  name          TEXT    NOT NULL DEFAULT '',
  role          TEXT    NOT NULL DEFAULT 'admin',
  created_at    INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  last_login_at INTEGER DEFAULT NULL
);

-- 在线会话
CREATE TABLE IF NOT EXISTS online_sessions (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id       INTEGER NOT NULL,
  token         TEXT    NOT NULL UNIQUE,
  device_id     TEXT    NOT NULL DEFAULT '',
  last_heartbeat INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  created_at    INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON online_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON online_sessions(token);

-- 设备
CREATE TABLE IF NOT EXISTS devices (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id       INTEGER NOT NULL,
  device_id     TEXT    NOT NULL,
  name          TEXT    NOT NULL DEFAULT '',
  platform      TEXT    NOT NULL DEFAULT '',
  trusted       INTEGER NOT NULL DEFAULT 0,
  created_at    INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  last_active_at INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  UNIQUE(user_id, device_id)
);

-- ============================================================
-- 房间与游戏
-- ============================================================

CREATE TABLE IF NOT EXISTS rooms (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  room_no       TEXT    NOT NULL UNIQUE,
  password      TEXT    NOT NULL DEFAULT '',
  game_type     TEXT    NOT NULL DEFAULT '',
  level         INTEGER NOT NULL DEFAULT 1,
  status        INTEGER NOT NULL DEFAULT 0,   -- 0等待 1游戏中 2已结束
  agent_id      INTEGER NOT NULL DEFAULT 0,
  club_id       INTEGER DEFAULT NULL,
  current_round INTEGER NOT NULL DEFAULT 0,
  total_rounds  INTEGER NOT NULL DEFAULT 0,
  max_seats     INTEGER NOT NULL DEFAULT 4,
  initial_gold  INTEGER NOT NULL DEFAULT 0,
  total_flow    INTEGER NOT NULL DEFAULT 0,
  total_rake    INTEGER NOT NULL DEFAULT 0,
  rule          TEXT    NOT NULL DEFAULT '{}',  -- JSON
  created_at    INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  started_at    INTEGER DEFAULT NULL,
  ended_at      INTEGER DEFAULT NULL
);
CREATE INDEX IF NOT EXISTS idx_rooms_game_type ON rooms(game_type);
CREATE INDEX IF NOT EXISTS idx_rooms_status ON rooms(status);

CREATE TABLE IF NOT EXISTS room_players (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id       INTEGER NOT NULL,
  user_id       INTEGER NOT NULL,
  seat          INTEGER NOT NULL DEFAULT 0,
  gold          INTEGER NOT NULL DEFAULT 0,
  ready         INTEGER NOT NULL DEFAULT 0,
  is_spectator  INTEGER NOT NULL DEFAULT 0,
  joined_at     INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  UNIQUE(room_id, user_id)
);
CREATE INDEX IF NOT EXISTS idx_room_players_room ON room_players(room_id);

CREATE TABLE IF NOT EXISTS game_rounds (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id       INTEGER NOT NULL,
  round_no      INTEGER NOT NULL DEFAULT 0,
  game_type     TEXT    NOT NULL DEFAULT '',
  status        INTEGER NOT NULL DEFAULT 0,
  dealer_seat   INTEGER DEFAULT NULL,
  cards         TEXT    NOT NULL DEFAULT '{}',
  actions       TEXT    NOT NULL DEFAULT '[]',
  result        TEXT    DEFAULT NULL,
  rake_amount   INTEGER NOT NULL DEFAULT 0,
  started_at    INTEGER NOT NULL DEFAULT (strftime('%s','now')),
  ended_at      INTEGER DEFAULT NULL
);
CREATE INDEX IF NOT EXISTS idx_game_rounds_room ON game_rounds(room_id);

-- ============================================================
-- 财务流水
-- ============================================================

CREATE TABLE IF NOT EXISTS chip_transactions (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id       INTEGER NOT NULL,
  type          TEXT    NOT NULL DEFAULT '',
  amount        INTEGER NOT NULL DEFAULT 0,
  balance_before INTEGER NOT NULL DEFAULT 0,
  balance_after  INTEGER NOT NULL DEFAULT 0,
  room_id       INTEGER DEFAULT NULL,
  round_id      INTEGER DEFAULT NULL,
  remark        TEXT    NOT NULL DEFAULT '',
  created_at    INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);
CREATE INDEX IF NOT EXISTS idx_chip_tx_user ON chip_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_chip_tx_type ON chip_transactions(type);
CREATE INDEX IF NOT EXISTS idx_chip_tx_created ON chip_transactions(created_at);

CREATE TABLE IF NOT EXISTS credit_transactions (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id       INTEGER NOT NULL,
  agent_id      INTEGER DEFAULT NULL,
  type          TEXT    NOT NULL DEFAULT '',
  amount        INTEGER NOT NULL DEFAULT 0,
  balance_before INTEGER NOT NULL DEFAULT 0,
  balance_after  INTEGER NOT NULL DEFAULT 0,
  remark        TEXT    NOT NULL DEFAULT '',
  created_at    INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS deduction_records (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id       INTEGER NOT NULL,
  round_id      INTEGER NOT NULL,
  user_id       INTEGER NOT NULL,
  amount        INTEGER NOT NULL DEFAULT 0,
  rate          REAL    NOT NULL DEFAULT 0,
  agent_id      INTEGER DEFAULT NULL,
  created_at    INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

-- 银行存取记录 (新增)
CREATE TABLE IF NOT EXISTS user_banks (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id       INTEGER NOT NULL,
  type          TEXT    NOT NULL DEFAULT '',  -- deposit/withdraw
  amount        INTEGER NOT NULL DEFAULT 0,
  balance_before INTEGER NOT NULL DEFAULT 0,
  balance_after  INTEGER NOT NULL DEFAULT 0,
  remark        TEXT    NOT NULL DEFAULT '',
  created_at    INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);
CREATE INDEX IF NOT EXISTS idx_user_banks_user ON user_banks(user_id);

-- 控分/放水记录 (新增)
CREATE TABLE IF NOT EXISTS control_records (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id       INTEGER NOT NULL,
  operator_id   INTEGER NOT NULL DEFAULT 0,
  room_id       INTEGER DEFAULT NULL,
  game_type     TEXT    NOT NULL DEFAULT '',
  action        TEXT    NOT NULL DEFAULT '',  -- control/release/adjust
  target_gold   INTEGER NOT NULL DEFAULT 0,
  remark        TEXT    NOT NULL DEFAULT '',
  created_at    INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

-- 救济金领取记录 (新增)
CREATE TABLE IF NOT EXISTS benefits (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id       INTEGER NOT NULL,
  amount        INTEGER NOT NULL DEFAULT 0,
  times         INTEGER NOT NULL DEFAULT 1,   -- 今日第几次
  created_at    INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);
CREATE INDEX IF NOT EXISTS idx_benefits_user_date ON benefits(user_id, created_at);

-- ============================================================
-- 配置与消息
-- ============================================================

CREATE TABLE IF NOT EXISTS system_config (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  key           TEXT    NOT NULL UNIQUE,
  value         TEXT    NOT NULL DEFAULT '',
  updated_at    INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS game_configs (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  game_type     TEXT    NOT NULL UNIQUE,
  name          TEXT    NOT NULL DEFAULT '',
  base_score    INTEGER NOT NULL DEFAULT 0,
  min_entry     INTEGER NOT NULL DEFAULT 0,
  enabled       INTEGER NOT NULL DEFAULT 1,
  maintenance   INTEGER NOT NULL DEFAULT 0,
  rule          TEXT    NOT NULL DEFAULT '{}',
  updated_at    INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);

CREATE TABLE IF NOT EXISTS room_messages (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id       INTEGER NOT NULL,
  user_id       INTEGER NOT NULL,
  content       TEXT    NOT NULL DEFAULT '',
  type          TEXT    NOT NULL DEFAULT 'text',
  created_at    INTEGER NOT NULL DEFAULT (strftime('%s','now'))
);
CREATE INDEX IF NOT EXISTS idx_room_messages_room ON room_messages(room_id);

-- ============================================================
-- 初始数据
-- ============================================================

-- 默认管理员 admin/123456 (bcrypt hash)
INSERT OR IGNORE INTO admin_users (account, password, name, role)
VALUES ('admin', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '超级管理员', 'super_admin');

-- 默认系统配置
INSERT OR IGNORE INTO system_config (key, value) VALUES
  ('site_name', '728棋牌'),
  ('benefit_amount', '5000'),
  ('benefit_times', '3'),
  ('benefit_min_gold', '100'),
  ('rake_rate', '0.05');

-- 25款游戏默认配置
INSERT OR IGNORE INTO game_configs (game_type, name, base_score, min_entry, enabled, rule) VALUES
  ('BCBM', '奔驰宝马', 10, 100, 1, '{}'),
  ('BJL',  '百家乐',   10, 100, 1, '{}'),
  ('BRNN', '百人牛牛', 10, 100, 1, '{}'),
  ('DFDC', '东方大奖', 10, 100, 1, '{}'),
  ('DNTG', '大闹天宫', 10, 100, 1, '{}'),
  ('DZPK', '德州扑克', 10, 100, 1, '{}'),
  ('ERNN', '二人牛牛', 10, 100, 1, '{}'),
  ('ERQS', '二人抢庄', 10, 100, 1, '{}'),
  ('FQZS', '飞禽走兽', 10, 100, 1, '{}'),
  ('HBSL', '红包扫雷', 10, 100, 1, '{}'),
  ('HLWZ', '红中五子', 10, 100, 1, '{}'),
  ('HLZZ', '红中炸',   10, 100, 1, '{}'),
  ('JCBY', '金币捕鱼', 10, 100, 1, '{}'),
  ('JXLW', '金龙揽月', 10, 100, 1, '{}'),
  ('LHD',  '龙虎斗',   10, 100, 1, '{}'),
  ('LKPY', '两款跑影', 10, 100, 1, '{}'),
  ('MJHJ', '麻将胡了', 10, 100, 1, '{}'),
  ('QZNN', '抢庄牛牛', 10, 100, 1, '{}'),
  ('SDB',  '三点半',   10, 100, 1, '{}'),
  ('SHZ',  '炸金花',   10, 100, 1, '{}'),
  ('SLWH', '森林舞会', 10, 100, 1, '{}'),
  ('SRNN', '四人牛牛', 10, 100, 1, '{}'),
  ('TBNN', '通比牛牛', 10, 100, 1, '{}'),
  ('WZMJ', '温州麻将', 10, 100, 1, '{}'),
  ('ZJH',  '炸金花',   10, 100, 1, '{}');

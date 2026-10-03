-- 728平台数据库初始化脚本
-- PostgreSQL 16

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    account TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    security_code TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'player',
    nickname TEXT,
    avatar TEXT NOT NULL DEFAULT '1',
    signature TEXT,
    settings JSONB,
    last_login_at TIMESTAMP,
    invite_code TEXT NOT NULL UNIQUE,
    invited_by_code TEXT,
    invited_by_id INTEGER,
    credit INTEGER NOT NULL DEFAULT 0,
    commission INTEGER NOT NULL DEFAULT 0,
    agent_commission_rate INTEGER NOT NULL DEFAULT 1,
    top_agent_commission_rate INTEGER NOT NULL DEFAULT 1,
    points INTEGER NOT NULL DEFAULT 0,
    open_room_blocked BOOLEAN NOT NULL DEFAULT FALSE,
    must_change_password BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 房间表
CREATE TABLE IF NOT EXISTS rooms (
    id SERIAL PRIMARY KEY,
    room_no TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    game_type TEXT NOT NULL,
    level TEXT NOT NULL,
    initial_points INTEGER NOT NULL,
    agent_id INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'waiting',
    current_round INTEGER NOT NULL DEFAULT 0,
    total_rounds INTEGER NOT NULL DEFAULT 25,
    max_seats INTEGER NOT NULL DEFAULT 8,
    total_rake INTEGER NOT NULL DEFAULT 0,
    total_flow INTEGER NOT NULL DEFAULT 0,
    settled BOOLEAN NOT NULL DEFAULT FALSE,
    archived_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 房间玩家表
CREATE TABLE IF NOT EXISTS room_players (
    id SERIAL PRIMARY KEY,
    room_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    seat INTEGER NOT NULL,
    points INTEGER NOT NULL DEFAULT 0,
    is_spectator BOOLEAN NOT NULL DEFAULT FALSE,
    ready BOOLEAN NOT NULL DEFAULT FALSE,
    joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE (room_id, seat)
);

-- 游戏回合表
CREATE TABLE IF NOT EXISTS game_rounds (
    id SERIAL PRIMARY KEY,
    room_id INTEGER NOT NULL,
    round_no INTEGER NOT NULL,
    game_type TEXT NOT NULL,
    result JSONB NOT NULL,
    winner_user_id INTEGER,
    pot_before_rake INTEGER NOT NULL DEFAULT 0,
    rake INTEGER NOT NULL DEFAULT 0,
    result_is_summary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 牌局状态表
CREATE TABLE IF NOT EXISTS hand_states (
    room_id INTEGER PRIMARY KEY,
    state JSONB NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 筹码变动审计表
CREATE TABLE IF NOT EXISTS chip_transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    operator_id INTEGER,
    amount INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    type TEXT NOT NULL,
    note TEXT,
    room_id INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 信用分变动表
CREATE TABLE IF NOT EXISTS credit_transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    balance_after INTEGER NOT NULL,
    type TEXT NOT NULL,
    note TEXT,
    operator_id INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 房间结算扣费记录
CREATE TABLE IF NOT EXISTS deduction_records (
    id SERIAL PRIMARY KEY,
    room_id INTEGER NOT NULL,
    agent_id INTEGER NOT NULL,
    total_flow INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    success BOOLEAN NOT NULL,
    resolved BOOLEAN NOT NULL DEFAULT FALSE,
    game_type TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 房间聊天表
CREATE TABLE IF NOT EXISTS room_messages (
    id SERIAL PRIMARY KEY,
    room_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    kind TEXT NOT NULL,
    content TEXT NOT NULL,
    target_user_id INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 设备关联表
CREATE TABLE IF NOT EXISTS devices (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    device_id TEXT NOT NULL,
    name TEXT NOT NULL,
    platform TEXT,
    last_active_at TIMESTAMP NOT NULL DEFAULT NOW(),
    trusted BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 系统配置表
CREATE TABLE IF NOT EXISTS system_config (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 初始化默认配置
INSERT INTO system_config (key, value) VALUES
    ('platform_rake_rate', '3'),
    ('agent_deduct_rate', '2'),
    ('agent_commission_rate', '1'),
    ('top_agent_commission_rate', '1')
ON CONFLICT (key) DO NOTHING;

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_room_players_room ON room_players(room_id);
CREATE INDEX IF NOT EXISTS idx_room_players_user ON room_players(user_id);
CREATE INDEX IF NOT EXISTS idx_game_rounds_room ON game_rounds(room_id);
CREATE INDEX IF NOT EXISTS idx_chip_transactions_user ON chip_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user ON credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_deduction_records_room ON deduction_records(room_id);
CREATE INDEX IF NOT EXISTS idx_deduction_records_agent ON deduction_records(agent_id);

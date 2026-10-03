-- V-POKER 2.0 全局配置表迁移
-- 执行方式：psql "$DATABASE_URL" -f migrations/003_system_config.sql

CREATE TABLE IF NOT EXISTS system_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- 初始化默认配置
INSERT INTO system_config (key, value) VALUES
  ('platform_rake_rate', '3'),    -- 游戏内抽水比例（%）
  ('agent_deduct_rate', '2')      -- 代理信用分扣除比例（%）
ON CONFLICT (key) DO NOTHING;

-- 验证
SELECT * FROM system_config;

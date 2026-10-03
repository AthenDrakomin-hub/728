-- V-POKER 2.0 经济模型重构迁移
-- 新增：返佣余额、代理返佣比例、总代理返佣比例
-- 执行方式：psql "$DATABASE_URL" -f migrations/002_commission_fields.sql

ALTER TABLE users ADD COLUMN IF NOT EXISTS commission INTEGER NOT NULL DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS agent_commission_rate INTEGER NOT NULL DEFAULT 1;
ALTER TABLE users ADD COLUMN IF NOT EXISTS top_agent_commission_rate INTEGER NOT NULL DEFAULT 1;

-- 验证
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'users' AND column_name IN ('commission', 'agent_commission_rate', 'top_agent_commission_rate');

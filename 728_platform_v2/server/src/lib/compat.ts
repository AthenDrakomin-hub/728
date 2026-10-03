import { db } from "@/db";
import { sql } from "drizzle-orm";

let done = false;

/**
 * 数据库兼容层。
 *
 * 本项目的 users 表使用 account / password / nickname / avatar / credit …
 * 但历史版本（或其它客户端）可能按 username / password_hash / display_name /
 * avatar_path / credit_score / parent_agent_id / agent_tier / deduction_failed /
 * pending_fee 来查询，导致：
 *   Failed query: select "username", "password_hash" ... from "users"
 *
 * 这里用 PostgreSQL 生成列（GENERATED ALWAYS AS ... STORED）为这些旧字段名
 * 建立只读别名，始终与主字段保持同步，从而让两套命名都能查询成功。
 * 幂等执行，重复调用无副作用。
 */
export async function ensureCompatColumns() {
  if (done) return;
  const stmts = [
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS username text GENERATED ALWAYS AS (account) STORED`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash text GENERATED ALWAYS AS (password) STORED`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS display_name text GENERATED ALWAYS AS (COALESCE(nickname, account)) STORED`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_path text GENERATED ALWAYS AS (avatar) STORED`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS credit_score integer GENERATED ALWAYS AS (credit) STORED`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS parent_agent_id integer GENERATED ALWAYS AS (invited_by_id) STORED`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS agent_tier text GENERATED ALWAYS AS (role) STORED`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS deduction_failed boolean GENERATED ALWAYS AS (open_room_blocked) STORED`,
    `ALTER TABLE users ADD COLUMN IF NOT EXISTS pending_fee integer NOT NULL DEFAULT 0`,
  ];
  for (const s of stmts) {
    try {
      await db.execute(sql.raw(s));
    } catch {
      // 单条失败不影响其它列
    }
  }
  done = true;
}

import { db } from "@/db";
import { systemConfig } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * 系统全局配置默认值
 * 所有比例用百分比整数存储（如 3 = 3%）
 */
const DEFAULTS: Record<string, string> = {
  platform_rake_rate: "3",       // 游戏内抽水比例（从赢家赢的筹码扣）
  agent_deduct_rate: "2",        // 代理信用分扣除比例（按房间流水）
  agent_commission_rate: "1",    // 代理返佣比例（按自己房间流水）
  top_agent_commission_rate: "1", // 总代理返佣比例（按下线代理房间流水）
  app_download_url: "https://nzssp.peiioh.cn:1443/api/c/er5v04h2", // APP下载链接
  app_version: "1.0.0",          // APP当前版本号（用于热更新检测）
  app_wgt_url: "",               // WGT热更新包下载地址（空表示无更新）
  app_wgt_force: "0",            // 是否强制更新（1=强制，0=可选）
  app_changelog: "",             // 更新日志
};

/** 读取配置值（字符串），不存在则返回默认值 */
export async function getConfig(key: string): Promise<string> {
  const rows = await db.select().from(systemConfig).where(eq(systemConfig.key, key)).limit(1);
  if (rows.length) return rows[0].value;
  return DEFAULTS[key] ?? "";
}

/** 读取配置值（数字），不存在则返回默认值 */
export async function getConfigNumber(key: string): Promise<number> {
  const v = await getConfig(key);
  const n = Number(v);
  return isNaN(n) ? Number(DEFAULTS[key] ?? 0) : n;
}

/** 读取所有配置 */
export async function getAllConfig(): Promise<Record<string, string>> {
  const rows = await db.select().from(systemConfig);
  const result: Record<string, string> = { ...DEFAULTS };
  for (const r of rows) result[r.key] = r.value;
  return result;
}

/** 设置配置值（管理员用） */
export async function setConfig(key: string, value: string): Promise<void> {
  const existing = await db.select().from(systemConfig).where(eq(systemConfig.key, key)).limit(1);
  if (existing.length) {
    await db.update(systemConfig).set({ value, updatedAt: new Date() }).where(eq(systemConfig.key, key));
  } else {
    await db.insert(systemConfig).values({ key, value });
  }
}

/** 抽水比例（百分比整数，默认3） */
export async function getRakeRate(): Promise<number> {
  return getConfigNumber("platform_rake_rate");
}

/** 代理信用分扣除比例（百分比整数，默认2） */
export async function getAgentDeductRate(): Promise<number> {
  return getConfigNumber("agent_deduct_rate");
}

/** 代理返佣比例（百分比整数，默认1） */
export async function getAgentCommissionRate(): Promise<number> {
  return getConfigNumber("agent_commission_rate");
}

/** 总代理返佣比例（百分比整数，默认1） */
export async function getTopAgentCommissionRate(): Promise<number> {
  return getConfigNumber("top_agent_commission_rate");
}

/**
 * 安全工具集
 * - 频率限制器（令牌桶算法）
 * - 下注校验
 * - 审计日志
 */
import { logger } from "./logger.js";

// ============ 频率限制器 ============
interface RateLimitEntry {
  tokens: number;
  lastRefill: number;
}

export class RateLimiter {
  private buckets: Map<string, RateLimitEntry> = new Map();
  private maxTokens: number;
  private refillRate: number; // 每秒补充的令牌数

  constructor(maxTokens: number = 10, refillPerSecond: number = 2) {
    this.maxTokens = maxTokens;
    this.refillRate = refillPerSecond;
  }

  /** 尝试获取令牌，返回是否允许 */
  tryAcquire(key: string): boolean {
    const now = Date.now();
    let entry = this.buckets.get(key);
    if (!entry) {
      entry = { tokens: this.maxTokens, lastRefill: now };
      this.buckets.set(key, entry);
    }
    // 补充令牌
    const elapsed = (now - entry.lastRefill) / 1000;
    entry.tokens = Math.min(this.maxTokens, entry.tokens + elapsed * this.refillRate);
    entry.lastRefill = now;

    if (entry.tokens >= 1) {
      entry.tokens -= 1;
      return true;
    }
    return false;
  }

  /** 清理过期条目（超过1小时无活动） */
  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.buckets) {
      if (now - entry.lastRefill > 3600000) {
        this.buckets.delete(key);
      }
    }
  }
}

// 全局限制器实例
export const betLimiter = new RateLimiter(5, 1); // 最多5个令牌，每秒补1个（约每秒1次下注）
export const wsLimiter = new RateLimiter(20, 5); // WS消息频率限制
export const loginLimiter = new RateLimiter(3, 0.2); // 登录限制：3次后每5秒1次

// ============ 下注校验 ============
export interface BetValidationResult {
  valid: boolean;
  reason?: string;
}

export function validateBet(
  userId: number,
  amount: number,
  userGold: number,
  minBet: number = 1,
  maxBet: number = 100000
): BetValidationResult {
  // 非正数
  if (!Number.isFinite(amount) || amount <= 0) {
    return { valid: false, reason: "下注金额必须为正数" };
  }
  // 整数
  if (!Number.isInteger(amount)) {
    return { valid: false, reason: "下注金额必须为整数" };
  }
  // 最小下注
  if (amount < minBet) {
    return { valid: false, reason: `最低下注${minBet}` };
  }
  // 最大下注
  if (amount > maxBet) {
    return { valid: false, reason: `最高下注${maxBet}` };
  }
  // 余额不足
  if (amount > userGold) {
    return { valid: false, reason: `金币不足(需要${amount}, 现有${userGold})` };
  }
  // 异常大额检测（单次下注超过余额的50%且超过10000，记录警告）
  if (amount > userGold * 0.5 && amount > 10000) {
    logger.warn(`[安全] 用户${userId}大额下注: ${amount} (余额${userGold})`);
  }
  return { valid: true };
}

// ============ 审计日志 ============
export interface AuditLog {
  timestamp: number;
  type: "bet" | "win" | "lose" | "login" | "register" | "room_create" | "room_join" | "suspicious";
  userId: number;
  detail: Record<string, any>;
}

const auditLogs: AuditLog[] = [];
const MAX_AUDIT_LOGS = 10000;

export function writeAuditLog(type: AuditLog["type"], userId: number, detail: Record<string, any>) {
  const log: AuditLog = {
    timestamp: Date.now(),
    type,
    userId,
    detail,
  };
  auditLogs.push(log);
  if (auditLogs.length > MAX_AUDIT_LOGS) {
    auditLogs.shift();
  }
  // 可疑行为额外记录
  if (type === "suspicious") {
    logger.warn(`[审计-可疑] 用户${userId}: ${JSON.stringify(detail)}`);
  }
}

export function getAuditLogs(type?: string, userId?: number, limit: number = 100): AuditLog[] {
  let logs = auditLogs;
  if (type) logs = logs.filter((l) => l.type === type);
  if (userId) logs = logs.filter((l) => l.userId === userId);
  return logs.slice(-limit).reverse();
}

export function getAuditStats(): Record<string, number> {
  const stats: Record<string, number> = {};
  for (const log of auditLogs) {
    stats[log.type] = (stats[log.type] || 0) + 1;
  }
  stats.total = auditLogs.length;
  return stats;
}

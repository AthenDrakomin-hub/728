/**
 * 金币管理器 — 金币增减、余额校验、流水记录
 * 所有金币变动必须通过本模块，确保数据一致性和可审计
 */
import { users, chipTransactions } from "../db/schema.js";
import { getDb } from "../db/sqliteDb.js";

export interface GoldOperationResult {
  success: boolean;
  balance: number;
  txId?: number;
  error?: string;
}

/** 查询用户金币余额 */
export function getGold(userId: number): number {
  const rows = users.select().where((u: any) => u.id === userId).limit(1);
  if (!rows.length) return 0;
  return Number(rows[0].gold) || 0;
}

/**
 * 增加金币
 * @param userId 用户ID
 * @param amount 金额(正数)
 * @param type 类型: game_win/admin_recharge/benefit/transfer_in等
 * @param remark 备注
 * @param roomId 房间ID
 * @param roundId 局号
 */
export function addGold(
  userId: number,
  amount: number,
  type: string = "game_win",
  remark: string = "",
  roomId?: number,
  roundId?: number
): GoldOperationResult {
  if (amount <= 0) return { success: false, balance: 0, error: "金额必须为正数" };

  const db = getDb();
  const txId = db.transaction(() => {
    const current = getGold(userId);
    const newBalance = current + amount;
    users.update({ gold: newBalance }).where((u: any) => u.id === userId);
    const result = chipTransactions.insert({
      userId,
      type,
      amount,
      balanceBefore: current,
      balanceAfter: newBalance,
      roomId: roomId ?? null,
      roundId: roundId ?? null,
      remark,
    });
    return result;
  })();

  return { success: true, balance: getGold(userId), txId: txId as number };
}

/**
 * 扣除金币
 * @param userId 用户ID
 * @param amount 金额(正数)
 * @param type 类型: game_lose/admin_deduct/bet/transfer_out等
 * @param remark 备注
 * @param roomId 房间ID
 * @param roundId 局号
 */
export function deductGold(
  userId: number,
  amount: number,
  type: string = "game_lose",
  remark: string = "",
  roomId?: number,
  roundId?: number
): GoldOperationResult {
  if (amount <= 0) return { success: false, balance: 0, error: "金额必须为正数" };

  const current = getGold(userId);
  if (current < amount) {
    return { success: false, balance: current, error: `余额不足: 需要${amount}, 现有${current}` };
  }

  const db = getDb();
  const txId = db.transaction(() => {
    const newBalance = current - amount;
    users.update({ gold: newBalance }).where((u: any) => u.id === userId);
    return chipTransactions.insert({
      userId,
      type,
      amount: -amount,
      balanceBefore: current,
      balanceAfter: newBalance,
      roomId: roomId ?? null,
      roundId: roundId ?? null,
      remark,
    });
  })();

  return { success: true, balance: getGold(userId), txId: txId as number };
}

/**
 * 转账 (原子操作: 从A扣除，给B增加)
 */
export function transferGold(
  fromUserId: number,
  toUserId: number,
  amount: number,
  type: string = "transfer",
  remark: string = ""
): GoldOperationResult {
  if (amount <= 0) return { success: false, balance: 0, error: "金额必须为正数" };
  if (fromUserId === toUserId) return { success: false, balance: 0, error: "不能给自己转账" };

  const fromBalance = getGold(fromUserId);
  if (fromBalance < amount) {
    return { success: false, balance: fromBalance, error: "转出方余额不足" };
  }

  const db = getDb();
  db.transaction(() => {
    const toBalance = getGold(toUserId);
    // 扣除
    users.update({ gold: fromBalance - amount }).where((u: any) => u.id === fromUserId);
    chipTransactions.insert({
      userId: fromUserId, type: type + "_out", amount: -amount,
      balanceBefore: fromBalance, balanceAfter: fromBalance - amount, remark,
    });
    // 增加
    users.update({ gold: toBalance + amount }).where((u: any) => u.id === toUserId);
    chipTransactions.insert({
      userId: toUserId, type: type + "_in", amount,
      balanceBefore: toBalance, balanceAfter: toBalance + amount, remark,
    });
  })();

  return { success: true, balance: getGold(fromUserId) };
}

/**
 * 批量结算: 根据输赢列表一次性处理金币变动
 * @param results [{userId, winAmount}] winAmount正数=赢, 负数=输
 */
export function batchSettle(
  results: { userId: number; winAmount: number }[],
  roomId?: number,
  roundId?: number
): { success: boolean; details: GoldOperationResult[] } {
  const details: GoldOperationResult[] = [];
  let allSuccess = true;

  for (const r of results) {
    if (r.winAmount > 0) {
      const res = addGold(r.userId, r.winAmount, "game_win", "游戏结算", roomId, roundId);
      details.push(res);
      if (!res.success) allSuccess = false;
    } else if (r.winAmount < 0) {
      const res = deductGold(r.userId, Math.abs(r.winAmount), "game_lose", "游戏结算", roomId, roundId);
      details.push(res);
      if (!res.success) allSuccess = false;
    }
  }

  return { success: allSuccess, details };
}

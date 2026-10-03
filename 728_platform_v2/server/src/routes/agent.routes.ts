import { Router, Request, Response } from "express";
import { db } from "@/db";
import { users, chipTransactions, deductionRecords, creditTransactions } from "@/db/schema";
import { and, desc, eq, ilike, inArray, or } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth";

const router = Router();
const AGENT_ROLES = ["agent", "top_agent", "admin"];

async function scopeIds(u: typeof users.$inferSelect): Promise<number[] | null> {
  if (u.role === "admin") return null;
  if (u.role === "top_agent") {
    const downs = await db.select({ id: users.id }).from(users).where(eq(users.invitedById, u.id));
    return [u.id, ...downs.map((d) => d.id)];
  }
  return [u.id];
}

// GET /api/agent/history
router.get("/history", async (req: Request, res: Response) => {
  const u = await getCurrentUser(req);
  if (!u) {
    res.status(401).json({ error: "未登录" });
    return;
  }
  const records = await db
    .select()
    .from(deductionRecords)
    .where(eq(deductionRecords.agentId, u.id))
    .orderBy(desc(deductionRecords.createdAt))
    .limit(10);
  const hasFailed = records.some((r) => !r.success && !r.resolved);
  res.json({ records, hasFailed, credit: u.credit, openRoomBlocked: u.openRoomBlocked });
});

// GET /api/agent/players
router.get("/players", async (req: Request, res: Response) => {
  const u = await getCurrentUser(req);
  if (!u) {
    res.status(401).json({ error: "未登录" });
    return;
  }
  if (!AGENT_ROLES.includes(u.role)) {
    res.status(403).json({ error: "无权限" });
    return;
  }
  const q = (req.query.q as string | undefined)?.trim();
  const ids = await scopeIds(u);
  const conds = [eq(users.role, "player")];
  if (ids) conds.push(inArray(users.invitedById, ids));
  if (q) conds.push(or(ilike(users.account, `%${q}%`), ilike(users.nickname, `%${q}%`))!);
  const rows = await db
    .select()
    .from(users)
    .where(and(...conds))
    .orderBy(desc(users.createdAt))
    .limit(200);
  res.json({
    inviteCode: u.inviteCode,
    players: rows.map((r) => ({
      id: r.id,
      account: r.account,
      nickname: r.nickname || r.account,
      avatar: r.avatar,
      points: r.points,
      lastLoginAt: r.lastLoginAt,
      createdAt: r.createdAt,
    })),
  });
});

// POST /api/agent/players
router.post("/players", async (req: Request, res: Response) => {
  const u = await getCurrentUser(req);
  if (!u) {
    res.status(401).json({ error: "未登录" });
    return;
  }
  if (!AGENT_ROLES.includes(u.role)) {
    res.status(403).json({ error: "无权限" });
    return;
  }
  const b = req.body || {};
  const userId = Number(b?.userId);
  const amount = Math.trunc(Number(b?.amount));
  const note = typeof b?.note === "string" ? b.note.slice(0, 50) : null;
  if (!userId || !Number.isFinite(amount) || amount === 0) {
    res.status(400).json({ error: "参数无效" });
    return;
  }
  if (Math.abs(amount) > 1_000_000) {
    res.status(400).json({ error: "单次操作不得超过 100 万" });
    return;
  }
  const rows = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  const target = rows[0];
  if (!target) {
    res.status(404).json({ error: "玩家不存在" });
    return;
  }
  if (target.role !== "player") {
    res.status(400).json({ error: "只能给玩家上下分" });
    return;
  }
  const ids = await scopeIds(u);
  if (ids && (!target.invitedById || !ids.includes(target.invitedById))) {
    res.status(403).json({ error: "该玩家不在你的名下" });
    return;
  }
  const next = target.points + amount;
  if (next < 0) {
    res.status(400).json({ error: `下分超出余额（当前 ${target.points}）` });
    return;
  }
  // 上分时检查代理筹码是否足够
  if (amount > 0 && u.points < amount) {
    res.status(400).json({ error: `代理筹码不足，当前 ${u.points}，需要 ${amount}` });
    return;
  }
  // 更新玩家筹码
  await db.update(users).set({ points: next }).where(eq(users.id, userId));
  // 更新代理筹码（上分扣代理，下分加代理）
  const agentNext = u.points - amount;
  await db.update(users).set({ points: agentNext }).where(eq(users.id, u.id));
  // 玩家筹码流水
  await db.insert(chipTransactions).values({
    userId,
    operatorId: u.id,
    amount,
    balanceAfter: next,
    type: amount > 0 ? "agent_add" : "agent_sub",
    note: note || (amount > 0 ? "代理上分" : "代理下分"),
  });
  // 代理筹码流水
  await db.insert(chipTransactions).values({
    userId: u.id,
    operatorId: u.id,
    amount: -amount,
    balanceAfter: agentNext,
    type: amount > 0 ? "agent_sub" : "agent_add",
    note: note || (amount > 0 ? `给玩家 ${target.account} 上分` : `从玩家 ${target.account} 下分`),
  });
  res.json({ ok: true, points: next, agentPoints: agentNext });
});

// GET /api/agent/promotion
router.get("/promotion", async (req: Request, res: Response) => {
  const u = await getCurrentUser(req);
  if (!u) {
    res.status(401).json({ error: "未登录" });
    return;
  }
  if (u.role !== "top_agent") {
    res.json({
      isTopAgent: false,
      inviteCode: u.inviteCode,
      credit: u.credit,
      downlines: [],
      daily: [],
      todayFlow: 0,
      todayCommission: 0,
      totalFlow: 0,
      totalCommission: 0,
    });
    return;
  }
  const downlines = await db.select().from(users).where(eq(users.invitedById, u.id));
  const agentIds = downlines.map((d) => d.id);
  let recs: (typeof deductionRecords.$inferSelect)[] = [];
  if (agentIds.length) {
    recs = await db
      .select()
      .from(deductionRecords)
      .where(inArray(deductionRecords.agentId, agentIds))
      .orderBy(desc(deductionRecords.createdAt));
  }
  function dayKey(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }
  const upRate = Math.max(0, u.topAgentCommissionRate || 0);
  const flowByAgent = new Map<number, number>();
  const dailyMap = new Map<string, { flow: number; commission: number }>();
  for (const r of recs) {
    flowByAgent.set(r.agentId, (flowByAgent.get(r.agentId) || 0) + r.totalFlow);
    const k = dayKey(new Date(r.createdAt));
    const cur = dailyMap.get(k) || { flow: 0, commission: 0 };
    cur.flow += r.totalFlow;
    cur.commission += Math.round(r.totalFlow * upRate / 100);
    dailyMap.set(k, cur);
  }
  const daily = [...dailyMap.entries()].map(([date, v]) => ({ date, ...v })).sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 14);
  const today = dayKey(new Date());
  const todayEntry = dailyMap.get(today) || { flow: 0, commission: 0 };
  const totalFlow = recs.reduce((a, r) => a + r.totalFlow, 0);
  const commTx = await db.select().from(creditTransactions).where(eq(creditTransactions.userId, u.id)).orderBy(desc(creditTransactions.createdAt));
  const totalCommission = commTx.filter((t) => t.type === "top_agent_commission").reduce((a, t) => a + t.amount, 0);
  const downlineData = downlines.map((d) => ({
    id: d.id,
    account: d.account,
    role: d.role,
    credit: d.credit,
    totalFlow: flowByAgent.get(d.id) || 0,
    commission: Math.round((flowByAgent.get(d.id) || 0) * upRate / 100),
  }));
  res.json({
    isTopAgent: true,
    inviteCode: u.inviteCode,
    credit: u.credit,
    commission: u.commission || 0,
    topAgentCommissionRate: upRate,
    downlines: downlineData,
    daily,
    todayFlow: todayEntry.flow,
    todayCommission: todayEntry.commission,
    totalFlow,
    totalCommission,
  });
});

// POST /api/agent/promote (总代理提升名下玩家为代理)
router.post("/promote", async (req: Request, res: Response) => {
  const u = await getCurrentUser(req);
  if (!u) {
    res.status(401).json({ error: "未登录" });
    return;
  }
  if (u.role !== "top_agent" && u.role !== "admin") {
    res.status(403).json({ error: "仅总代理可提升玩家为代理" });
    return;
  }
  const { userId } = req.body || {};
  if (!userId) {
    res.status(400).json({ error: "缺少 userId" });
    return;
  }
  const targetRows = await db.select().from(users).where(eq(users.id, Number(userId))).limit(1);
  const target = targetRows[0];
  if (!target) {
    res.status(404).json({ error: "用户不存在" });
    return;
  }
  // 总代理只能提升自己邀请的玩家
  if (u.role === "top_agent" && target.invitedById !== u.id) {
    res.status(403).json({ error: "只能提升自己邀请的玩家" });
    return;
  }
  if (target.role !== "player") {
    res.status(400).json({ error: "该用户已不是玩家身份" });
    return;
  }
  await db.update(users).set({ role: "agent" }).where(eq(users.id, Number(userId)));
  res.json({ ok: true, userId: Number(userId), newRole: "agent" });
});

export default router;

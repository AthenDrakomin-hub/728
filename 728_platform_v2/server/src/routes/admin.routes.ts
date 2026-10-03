import { Router, Request, Response } from "express";
import { db } from "@/db";
import { users, creditTransactions, deductionRecords, chipTransactions, rooms } from "@/db/schema";
import { desc, eq, ilike, or, inArray, and } from "drizzle-orm";
import { getCurrentUser, hashPassword, genInviteCode } from "@/lib/auth";
import { audit } from "@/lib/audit";
import { getAllConfig, setConfig } from "@/lib/config";

const router = Router();

const ROLES = ["player", "agent", "top_agent", "customer_service", "admin"];

async function requireStaff(req: Request, res: Response) {
  const u = await getCurrentUser(req);
  if (!u) {
    res.status(401).json({ error: "未登录" });
    return null;
  }
  if (u.role !== "admin" && u.role !== "customer_service") {
    res.status(403).json({ error: "无权限" });
    return null;
  }
  return u;
}

function shape(r: typeof users.$inferSelect) {
  return {
    id: r.id,
    account: r.account,
    role: r.role,
    credit: r.credit,
    commission: r.commission,
    points: r.points,
    agentCommissionRate: r.agentCommissionRate,
    topAgentCommissionRate: r.topAgentCommissionRate,
    inviteCode: r.inviteCode,
    invitedByCode: r.invitedByCode,
    securityCode: r.securityCode,
    openRoomBlocked: r.openRoomBlocked,
    createdAt: r.createdAt,
  };
}

// GET /api/admin/users
router.get("/users", async (req: Request, res: Response) => {
  const u = await requireStaff(req, res);
  if (!u) return;
  const q = req.query.q as string | undefined;
  const role = req.query.role as string | undefined;

  let rows = q
    ? await db
        .select()
        .from(users)
        .where(
          or(ilike(users.account, `%${q}%`), ilike(users.inviteCode, `%${q}%`))
        )
        .orderBy(desc(users.createdAt))
        .limit(200)
    : await db.select().from(users).orderBy(desc(users.createdAt)).limit(200);

  if (role) rows = rows.filter((r) => r.role === role);
  res.json({ users: rows.map(shape) });
});

// POST /api/admin/users
router.post("/users", async (req: Request, res: Response) => {
  const u = await requireStaff(req, res);
  if (!u) return;
  if (u.role !== "admin") {
    res.status(403).json({ error: "仅管理员可新建用户" });
    return;
  }
  const b = req.body || {};
  const { account, password, role, securityCode, credit, invitedByCode } = b;
  if (!account || !password) {
    res.status(400).json({ error: "账号和密码必填" });
    return;
  }
  if (role && !ROLES.includes(role)) {
    res.status(400).json({ error: "角色无效" });
    return;
  }
  const dup = await db.select().from(users).where(eq(users.account, account)).limit(1);
  if (dup.length) {
    res.status(400).json({ error: "账号已存在" });
    return;
  }

  let invitedById: number | null = null;
  if (invitedByCode) {
    const up = await db
      .select()
      .from(users)
      .where(eq(users.inviteCode, String(invitedByCode).toUpperCase()))
      .limit(1);
    if (!up.length) {
      res.status(400).json({ error: "上级邀请码无效" });
      return;
    }
    invitedById = up[0].id;
  }

  const amount = Math.max(0, Number(credit) || 0);
  const inserted = await db
    .insert(users)
    .values({
      account,
      password: hashPassword(password),
      securityCode: String(securityCode || "0000"),
      role: role || "player",
      inviteCode: genInviteCode(),
      invitedByCode: invitedByCode ? String(invitedByCode).toUpperCase() : null,
      invitedById,
      credit: amount,
      points: 0,
    })
    .returning();

  if (amount > 0) {
    await db.insert(creditTransactions).values({
      userId: inserted[0].id,
      amount,
      balanceAfter: amount,
      type: "cs_adjust",
      note: "开户初始信用分",
      operatorId: u.id,
    });
  }

  audit.info("admin_create_user", { userId: u.id, account: u.account, detail: `创建用户 ${account} [${role || 'player'}]` });
  res.json({ user: shape(inserted[0]) });
});

// PATCH /api/admin/users
router.patch("/users", async (req: Request, res: Response) => {
  const u = await requireStaff(req, res);
  if (!u) return;
  const b = req.body || {};
  const { id, account, password, role, securityCode, openRoomBlocked, agentCommissionRate, topAgentCommissionRate, credit, commission, points } = b;
  if (!id) {
    res.status(400).json({ error: "缺少用户ID" });
    return;
  }
  const rows = await db.select().from(users).where(eq(users.id, Number(id))).limit(1);
  if (!rows.length) {
    res.status(404).json({ error: "用户不存在" });
    return;
  }
  const updates: Record<string, unknown> = {};
  if (account !== undefined) updates.account = account;
  if (password) updates.password = hashPassword(password);
  if (role) updates.role = role;
  if (securityCode !== undefined) updates.securityCode = securityCode;
  if (openRoomBlocked !== undefined) updates.openRoomBlocked = Boolean(openRoomBlocked);
  if (credit !== undefined) updates.credit = Math.max(0, Number(credit));
  if (commission !== undefined) updates.commission = Math.max(0, Number(commission));
  if (points !== undefined) {
    const newPoints = Math.max(0, Number(points));
    updates.points = newPoints;
    // 记录筹码变更流水
    const oldPoints = rows[0].points;
    const diff = newPoints - oldPoints;
    if (diff !== 0) {
      await db.insert(chipTransactions).values({
        userId: Number(id),
        operatorId: u.id,
        amount: diff,
        balanceAfter: newPoints,
        type: "admin_adjust",
        note: `管理员调整筹码 ${diff > 0 ? "+" : ""}${diff}`,
      });
    }
  }
  // 返佣比例：0-100的整数，不可为负
  if (agentCommissionRate !== undefined) {
    const r = Math.floor(Number(agentCommissionRate));
    if (r < 0 || r > 100) {
      res.status(400).json({ error: "代理返佣比例必须在0-100之间" });
      return;
    }
    updates.agentCommissionRate = r;
  }
  if (topAgentCommissionRate !== undefined) {
    const r = Math.floor(Number(topAgentCommissionRate));
    if (r < 0 || r > 100) {
      res.status(400).json({ error: "总代理返佣比例必须在0-100之间" });
      return;
    }
    updates.topAgentCommissionRate = r;
  }
  await db.update(users).set(updates).where(eq(users.id, Number(id)));
  audit.info("admin_update_user", { userId: u.id, account: u.account, detail: `更新用户 ID=${id}` });
  res.json({ ok: true });
});

// DELETE /api/admin/users
router.delete("/users", async (req: Request, res: Response) => {
  const u = await requireStaff(req, res);
  if (!u) return;
  if (u.role !== "admin") {
    res.status(403).json({ error: "仅管理员可删除用户" });
    return;
  }
  const id = Number(req.query.id);
  if (!id) {
    res.status(400).json({ error: "缺少用户ID" });
    return;
  }
  await db.delete(users).where(eq(users.id, id));
  res.json({ ok: true });
});

// POST /api/admin/adjust-credit
router.post("/adjust-credit", async (req: Request, res: Response) => {
  const op = await getCurrentUser(req);
  if (!op) {
    res.status(401).json({ error: "未登录" });
    return;
  }
  if (op.role !== "admin" && op.role !== "customer_service") {
    res.status(403).json({ error: "无权限" });
    return;
  }
  const body = req.body || {};
  const { userId, amount, note } = body;
  const amt = Number(amount);
  if (!userId || isNaN(amt) || amt === 0) {
    res.status(400).json({ error: "参数无效" });
    return;
  }
  const rows = await db.select().from(users).where(eq(users.id, Number(userId))).limit(1);
  const target = rows[0];
  if (!target) {
    res.status(404).json({ error: "用户不存在" });
    return;
  }
  let newCredit = target.credit + amt;
  if (newCredit < 0) newCredit = 0;
  await db.update(users).set({ credit: newCredit }).where(eq(users.id, target.id));
  await db.insert(creditTransactions).values({
    userId: target.id,
    amount: amt,
    balanceAfter: newCredit,
    type: "cs_adjust",
    note: note || (amt > 0 ? "客服增加信用分" : "客服减少信用分"),
    operatorId: op.id,
  });
  const failed = await db
    .select()
    .from(deductionRecords)
    .where(
      and(
        eq(deductionRecords.agentId, target.id),
        eq(deductionRecords.success, false),
        eq(deductionRecords.resolved, false)
      )
    );
  let resolvedCount = 0;
  let credit = newCredit;
  for (const f of failed) {
    if (credit >= f.amount) {
      credit -= f.amount;
      await db.update(deductionRecords).set({ success: true, resolved: true }).where(eq(deductionRecords.id, f.id));
      await db.insert(creditTransactions).values({
        userId: target.id,
        amount: -f.amount,
        balanceAfter: credit,
        type: "room_deduct",
        note: `补扣 房间#${f.roomId} 总流水2%抽水`,
        operatorId: op.id,
      });
      resolvedCount++;
    }
  }
  const stillFailed = await db
    .select()
    .from(deductionRecords)
    .where(
      and(
        eq(deductionRecords.agentId, target.id),
        eq(deductionRecords.success, false),
        eq(deductionRecords.resolved, false)
      )
    );
  const blocked = stillFailed.length > 0;
  await db.update(users).set({ credit, openRoomBlocked: blocked }).where(eq(users.id, target.id));
  audit.info("admin_adjust_credit", {
    userId: op.id,
    account: op.account,
    detail: `调整用户 ID=${userId} 信用分 ${amt > 0 ? '+' : ''}${amt}，结果信用分=${credit}，补扣失败记录=${resolvedCount}条`,
  });
  res.json({ ok: true, credit, resolvedCount, openRoomBlocked: blocked });
});

// GET /api/admin/ledger
router.get("/ledger", async (req: Request, res: Response) => {
  const u = await getCurrentUser(req);
  if (!u) {
    res.status(401).json({ error: "未登录" });
    return;
  }
  if (u.role !== "admin" && u.role !== "customer_service") {
    res.status(403).json({ error: "无权限" });
    return;
  }
  const userId = req.query.userId as string | undefined;
  const rows = userId
    ? await db.select().from(creditTransactions).where(eq(creditTransactions.userId, Number(userId))).orderBy(desc(creditTransactions.createdAt)).limit(100)
    : await db.select().from(creditTransactions).orderBy(desc(creditTransactions.createdAt)).limit(100);
  const ids = [...new Set([...rows.map((r) => r.userId), ...rows.map((r) => r.operatorId).filter((x): x is number => !!x)])];
  const uRows = ids.length ? await db.select().from(users).where(inArray(users.id, ids)) : [];
  const nameMap = new Map(uRows.map((x) => [x.id, x.account]));
  const summary = { csIn: 0, csOut: 0, deduct: 0, commission: 0, rake: 0, totalFlow: 0 };
  for (const r of rows) {
    if (r.type === "cs_adjust") {
      if (r.amount > 0) summary.csIn += r.amount;
      else summary.csOut += -r.amount;
    } else if (r.type === "room_deduct") summary.deduct += -r.amount;
    else if (r.type === "agent_commission" || r.type === "top_agent_commission" || r.type === "commission") summary.commission += r.amount;
    else if (r.type === "rake") summary.rake += r.amount;
  }
  res.json({
    items: rows.map((r) => ({
      id: r.id,
      userId: r.userId,
      account: nameMap.get(r.userId) || "?",
      amount: r.amount,
      balanceAfter: r.balanceAfter,
      type: r.type,
      note: r.note,
      operator: r.operatorId ? nameMap.get(r.operatorId) || "-" : "系统",
      createdAt: r.createdAt,
    })),
    summary,
  });
});

// GET /api/admin/stats (平台数据概览)
router.get("/stats", async (req: Request, res: Response) => {
  const u = await requireStaff(req, res);
  if (!u) return;
  // 用户统计
  const allUsers = await db.select({ role: users.role }).from(users);
  const userStats: Record<string, number> = {};
  for (const r of allUsers) userStats[r.role] = (userStats[r.role] || 0) + 1;
  // 房间统计
  const allRooms = await db.select({ status: rooms.status, totalRake: rooms.totalRake, totalFlow: rooms.totalFlow }).from(rooms);
  const activeRooms = allRooms.filter((r) => r.status === "playing" || r.status === "waiting").length;
  const finishedRooms = allRooms.filter((r) => r.status === "finished" || r.status === "waiting_continue").length;
  const totalRake = allRooms.reduce((s, r) => s + (r.totalRake || 0), 0);
  const totalFlow = allRooms.reduce((s, r) => s + (r.totalFlow || 0), 0);
  // 信用分交易统计
  const allTx = await db.select({ type: creditTransactions.type, amount: creditTransactions.amount }).from(creditTransactions);
  let totalDeduct = 0, totalCommission = 0, totalCsAdjust = 0;
  for (const t of allTx) {
    if (t.type === "room_deduct") totalDeduct += -t.amount;
    else if (t.type === "agent_commission" || t.type === "top_agent_commission" || t.type === "commission") totalCommission += t.amount;
    else if (t.type === "cs_adjust") totalCsAdjust += t.amount;
  }
  res.json({
    users: userStats,
    totalUsers: allUsers.length,
    activeRooms,
    finishedRooms,
    totalRooms: allRooms.length,
    totalRake,
    totalFlow,
    totalDeduct,
    totalCommission,
    totalCsAdjust,
  });
});

// POST /api/admin/set-role
router.post("/set-role", async (req: Request, res: Response) => {
  const op = await getCurrentUser(req);
  if (!op) {
    res.status(401).json({ error: "未登录" });
    return;
  }
  if (op.role !== "admin") {
    res.status(403).json({ error: "仅管理员可修改角色" });
    return;
  }
  const body = req.body || {};
  const { userId, role } = body;
  if (!userId || !ROLES.includes(role)) {
    res.status(400).json({ error: "参数无效" });
    return;
  }
  const rows = await db.select().from(users).where(eq(users.id, Number(userId))).limit(1);
  if (!rows.length) {
    res.status(404).json({ error: "用户不存在" });
    return;
  }
  await db.update(users).set({ role }).where(eq(users.id, Number(userId)));
  audit.info("admin_set_role", { userId: op.id, account: op.account, detail: `修改用户 ID=${userId} 角色为 ${role}` });
  res.json({ ok: true, role });
});

// GET /api/admin/config (查看全局配置)
router.get("/config", async (req: Request, res: Response) => {
  const u = await requireStaff(req, res);
  if (!u) return;
  const config = await getAllConfig();
  res.json({ config });
});

// PUT /api/admin/config (修改全局配置)
router.put("/config", async (req: Request, res: Response) => {
  const u = await requireStaff(req, res);
  if (!u) return;
  const b = req.body || {};
  // 数字类型配置（0-100）
  const numericKeys = ["platform_rake_rate", "agent_deduct_rate", "agent_commission_rate", "top_agent_commission_rate"];
  for (const key of numericKeys) {
    if (b[key] !== undefined) {
      const val = Number(b[key]);
      if (isNaN(val) || val < 0 || val > 100) {
        res.status(400).json({ error: `${key} 必须在0-100之间` });
        return;
      }
      await setConfig(key, String(Math.floor(val)));
    }
  }
  // 字符串类型配置
  const stringKeys = ["app_version", "app_wgt_url", "app_wgt_force", "app_changelog", "app_download_url"];
  for (const key of stringKeys) {
    if (b[key] !== undefined) {
      await setConfig(key, String(b[key] ?? ""));
    }
  }
  const config = await getAllConfig();
  audit.info("admin_config_update", { userId: u.id, account: u.account, detail: `修改全局配置: ${JSON.stringify(b)}` });
  res.json({ ok: true, config });
});

export default router;

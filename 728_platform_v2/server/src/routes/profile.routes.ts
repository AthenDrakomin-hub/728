import { Router, Request, Response } from "express";
import { db } from "@/db";
import {
  users,
  creditTransactions,
  gameRounds,
  rooms,
  deductionRecords,
  devices,
  chipTransactions,
} from "@/db/schema";
import { desc, eq, inArray, and } from "drizzle-orm";
import { getCurrentUser, hashPassword, verifyPassword } from "@/lib/auth";
import { rateLimitMiddleware } from "@/lib/rateLimiter";

const router = Router();

interface RoundResultShape {
  hands: { userId: number; account: string; handName: string; delta: number }[];
  winnerUserId: number;
}

// GET /api/profile
router.get("/", async (req: Request, res: Response) => {
  const u = await getCurrentUser(req);
  if (!u) {
    res.status(401).json({ error: "未登录" });
    return;
  }
  const credits = await db
    .select()
    .from(creditTransactions)
    .where(eq(creditTransactions.userId, u.id))
    .orderBy(desc(creditTransactions.createdAt))
    .limit(50);
  const myRooms = await db.select().from(rooms).orderBy(desc(rooms.createdAt)).limit(200);
  const roomMap = new Map(myRooms.map((r) => [r.id, r]));
  const roundRows = myRooms.length
    ? await db
        .select()
        .from(gameRounds)
        .where(inArray(gameRounds.roomId, myRooms.map((r) => r.id)))
        .orderBy(desc(gameRounds.createdAt))
        .limit(500)
    : [];
  const myRounds = roundRows.filter((r) => {
    const res = r.result as unknown as RoundResultShape;
    return res?.hands?.some((h) => h.userId === u.id);
  });
  let wins = 0;
  let net = 0;
  const history = myRounds.slice(0, 30).map((r) => {
    const res = r.result as unknown as RoundResultShape;
    const mine = res.hands.find((h) => h.userId === u.id)!;
    const won = res.winnerUserId === u.id;
    if (won) wins++;
    net += mine.delta;
    const room = roomMap.get(r.roomId);
    return {
      id: r.id,
      roomNo: room?.roomNo ?? "-",
      gameType: r.gameType,
      roundNo: r.roundNo,
      handName: mine.handName,
      delta: mine.delta,
      won,
      createdAt: r.createdAt,
    };
  });
  const totalRounds = myRounds.length;
  for (const r of myRounds.slice(30)) {
    const res = r.result as unknown as RoundResultShape;
    const mine = res.hands.find((h) => h.userId === u.id)!;
    if (res.winnerUserId === u.id) wins++;
    net += mine.delta;
  }

  // 按房间汇总战绩
  const roomMap2 = new Map<number, { rounds: number; wins: number; net: number; lastAt: Date; gameType: string; level: string; roomNo: string; agentId: number; details: any[] }>();
  for (const r of myRounds) {
    const res = r.result as unknown as RoundResultShape;
    const mine = res.hands.find((h) => h.userId === u.id)!;
    const room = roomMap.get(r.roomId);
    if (!room) continue;
    const won = res.winnerUserId === u.id;
    const detail = {
      id: r.id,
      roundNo: r.roundNo,
      handName: mine.handName,
      delta: mine.delta,
      won,
      createdAt: r.createdAt,
    };
    const existing = roomMap2.get(r.roomId);
    if (existing) {
      existing.rounds++;
      if (won) existing.wins++;
      existing.net += mine.delta;
      if (r.createdAt > existing.lastAt) existing.lastAt = r.createdAt;
      existing.details.push(detail);
    } else {
      roomMap2.set(r.roomId, {
        rounds: 1,
        wins: won ? 1 : 0,
        net: mine.delta,
        lastAt: r.createdAt,
        gameType: r.gameType,
        level: room.level,
        roomNo: room.roomNo,
        agentId: room.agentId,
        details: [detail],
      });
    }
  }
  const agentIds = [...new Set([...roomMap2.values()].map((v) => v.agentId))];
  const agents = agentIds.length ? await db.select().from(users).where(inArray(users.id, agentIds)) : [];
  const agentNameMap = new Map(agents.map((a) => [a.id, a.nickname || a.account]));
  const roomHistory = [...roomMap2.values()]
    .sort((a, b) => b.lastAt.getTime() - a.lastAt.getTime())
    .map((v) => ({
      roomNo: v.roomNo,
      gameType: v.gameType,
      level: v.level,
      rounds: v.rounds,
      wins: v.wins,
      net: v.net,
      lastAt: v.lastAt,
      ownerName: agentNameMap.get(v.agentId) || "-",
      details: v.details.sort((a, b) => b.roundNo - a.roundNo),
    }));
  const deductions =
    u.role === "agent" || u.role === "top_agent"
      ? await db.select().from(deductionRecords).where(eq(deductionRecords.agentId, u.id)).orderBy(desc(deductionRecords.createdAt)).limit(10)
      : [];
  const chips = await db
    .select()
    .from(chipTransactions)
    .where(eq(chipTransactions.userId, u.id))
    .orderBy(desc(chipTransactions.createdAt))
    .limit(50);
  const deviceRows = await db
    .select()
    .from(devices)
    .where(eq(devices.userId, u.id))
    .orderBy(desc(devices.lastActiveAt))
    .limit(20);
  res.json({
    user: {
      id: u.id,
      account: u.account,
      nickname: u.nickname || u.account,
      avatar: u.avatar,
      signature: u.signature,
      role: u.role,
      credit: u.credit,
      points: u.points,
      inviteCode: ["agent", "top_agent", "admin"].includes(u.role) ? u.inviteCode : null,
      canInvite: ["agent", "top_agent", "admin"].includes(u.role),
      invitedByCode: u.invitedByCode,
      openRoomBlocked: u.openRoomBlocked,
      settings: u.settings ?? { sound: true, music: true, vibrate: true },
      createdAt: u.createdAt,
      lastLoginAt: u.lastLoginAt,
    },
    stats: {
      totalRounds,
      wins,
      losses: totalRounds - wins,
      winRate: totalRounds ? Math.round((wins / totalRounds) * 100) : 0,
      net,
    },
    credits: credits.map((c) => ({
      id: c.id,
      amount: c.amount,
      balanceAfter: c.balanceAfter,
      type: c.type,
      note: c.note,
      createdAt: c.createdAt,
    })),
    history,
    roomHistory,
    deductions,
    chips: chips.map((c) => ({
      id: c.id,
      amount: c.amount,
      balanceAfter: c.balanceAfter,
      type: c.type,
      note: c.note,
      createdAt: c.createdAt,
    })),
    devices: deviceRows,
  });
});

// PATCH /api/profile
router.patch("/", async (req: Request, res: Response) => {
  const u = await getCurrentUser(req);
  if (!u) {
    res.status(401).json({ error: "未登录" });
    return;
  }
  const b = req.body || {};
  const updates: Record<string, unknown> = {};
  if (b.nickname !== undefined) updates.nickname = String(b.nickname).slice(0, 30);
  if (b.avatar !== undefined) updates.avatar = String(b.avatar);
  if (b.signature !== undefined) updates.signature = String(b.signature).slice(0, 100);
  if (b.settings !== undefined) updates.settings = b.settings;
  if (Object.keys(updates).length === 0) {
    res.status(400).json({ error: "无更新字段" });
    return;
  }
  await db.update(users).set(updates).where(eq(users.id, u.id));
  res.json({ ok: true });
});

// POST /api/profile/devices
router.post("/devices", async (req: Request, res: Response) => {
  const u = await getCurrentUser(req);
  if (!u) {
    res.status(401).json({ error: "未登录" });
    return;
  }
  const b = req.body || {};
  const deviceId = String(b?.deviceId || "").slice(0, 64);
  if (!deviceId) {
    res.status(400).json({ error: "缺少设备标识" });
    return;
  }
  const ua = req.headers["user-agent"] || "";
  const platform = /iPhone|iPad|iOS/i.test(String(ua))
    ? "iOS"
    : /Android/i.test(String(ua))
    ? "Android"
    : /Windows/i.test(String(ua))
    ? "Windows"
    : /Mac/i.test(String(ua))
    ? "macOS"
    : "其他";
  const name = String(b?.name || `${platform} 设备`).slice(0, 40);
  const existing = await db
    .select()
    .from(devices)
    .where(and(eq(devices.userId, u.id), eq(devices.deviceId, deviceId)))
    .limit(1);
  if (existing.length) {
    await db.update(devices).set({ lastActiveAt: new Date(), name, platform, trusted: true }).where(eq(devices.id, existing[0].id));
  } else {
    // 设备数量限制：最多10台，超过则删除最旧的非当前设备
    const allDevices = await db
      .select()
      .from(devices)
      .where(eq(devices.userId, u.id))
      .orderBy(desc(devices.lastActiveAt));
    if (allDevices.length >= 10) {
      const oldest = allDevices[allDevices.length - 1];
      await db.delete(devices).where(eq(devices.id, oldest.id));
    }
    await db.insert(devices).values({ userId: u.id, deviceId, name, platform, trusted: true });
  }
  res.json({ ok: true });
});

// DELETE /api/profile/devices
router.delete("/devices", async (req: Request, res: Response) => {
  const u = await getCurrentUser(req);
  if (!u) {
    res.status(401).json({ error: "未登录" });
    return;
  }
  const id = Number(req.query.id);
  if (!id) {
    res.status(400).json({ error: "缺少设备ID" });
    return;
  }
  await db.delete(devices).where(and(eq(devices.id, id), eq(devices.userId, u.id)));
  res.json({ ok: true });
});

// POST /api/profile/password
router.post("/password", rateLimitMiddleware, async (req: Request, res: Response) => {
  const u = await getCurrentUser(req);
  if (!u) {
    res.status(401).json({ error: "未登录" });
    return;
  }
  const b = req.body || {};
  const { oldPassword, newPassword, confirmPassword } = b;
  if (!oldPassword || !newPassword) {
    res.status(400).json({ error: "请填写完整" });
    return;
  }
  if (String(newPassword).length < 6) {
    res.status(400).json({ error: "新密码至少 6 位" });
    return;
  }
  if (newPassword !== confirmPassword) {
    res.status(400).json({ error: "两次输入的新密码不一致" });
    return;
  }
  const { ok } = await verifyPassword(oldPassword, u.password, u.id);
  if (!ok) {
    res.status(400).json({ error: "原密码错误" });
    return;
  }
  const newHash = hashPassword(newPassword);
  await db.update(users).set({ password: newHash, mustChangePassword: false }).where(eq(users.id, u.id));
  res.json({ ok: true });
});

export default router;

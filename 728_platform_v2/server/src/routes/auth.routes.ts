import { Router, Request, Response } from "express";
import { db } from "@/db";
import { users, devices } from "@/db/schema";
import { eq, sql, and, desc } from "drizzle-orm";
import {
  hashPassword,
  setSession,
  makeToken,
  verifyPassword,
  getCurrentUser,
  clearSession,
  genInviteCode,
} from "@/lib/auth";
import { ensureSeed } from "@/lib/ensureSeed";
import { ensureCompatColumns } from "@/lib/compat";
import { rateLimitMiddleware } from "@/lib/rateLimiter";
import { audit, getRequestIp } from "@/lib/audit";

const router = Router();

const INVITER_ROLES = ["agent", "top_agent", "admin"];

// POST /api/auth/login
router.post("/login", rateLimitMiddleware, async (req: Request, res: Response) => {
  try {
    await ensureCompatColumns();
    await ensureSeed();

    const body = req.body || {};
    const account = String(
      body.account ?? body.username ?? body.user ?? body.name ?? ""
    ).trim();
    const password = String(body.password ?? body.pwd ?? "");

    if (!account || !password) {
      res.status(400).json({ error: "请输入账号和密码" });
      return;
    }

    const rows = await db
      .select()
      .from(users)
      .where(
        sql`lower(${users.account}) = lower(${account}) OR lower(coalesce(${users.nickname}, '')) = lower(${account})`
      )
      .limit(1);

    const u = rows[0];
    if (!u) {
      audit.warn("login_failed_user_not_found", { account, ip: getRequestIp(req), detail: `账号「${account}」不存在` });
      res.status(401).json({ error: `账号「${account}」不存在，请检查或点击注册` });
      return;
    }
    const { ok, needsMigration } = await verifyPassword(password, u.password, u.id);
    if (!ok) {
      audit.warn("login_failed_bad_password", { userId: u.id, account: u.account, ip: getRequestIp(req) });
      res.status(401).json({ error: "密码错误" });
      return;
    }

    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, u.id));

    const mustChangePassword = u.mustChangePassword || needsMigration;
    const session = { id: u.id, account: u.account, role: u.role, mustChangePassword };
    setSession(res, session);

    // 登录时关联设备（如果请求携带x-device-id）
    const deviceId = req.headers["x-device-id"];
    if (deviceId && typeof deviceId === "string" && deviceId.trim()) {
      const did = deviceId.trim().slice(0, 64);
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
      const existing = await db
        .select()
        .from(devices)
        .where(and(eq(devices.userId, u.id), eq(devices.deviceId, did)))
        .limit(1);
      if (existing.length) {
        await db.update(devices).set({ lastActiveAt: new Date(), platform }).where(eq(devices.id, existing[0].id));
      } else {
        // 设备数量限制：最多10台，超过则删除最旧的
        const allDevices = await db
          .select()
          .from(devices)
          .where(eq(devices.userId, u.id))
          .orderBy(desc(devices.lastActiveAt));
        if (allDevices.length >= 10) {
          const oldest = allDevices[allDevices.length - 1];
          await db.delete(devices).where(eq(devices.id, oldest.id));
        }
        await db.insert(devices).values({ userId: u.id, deviceId: did, name: `${platform} 设备`, platform, trusted: true });
      }
    }

    audit.info("login_success", { userId: u.id, account: u.account, ip: getRequestIp(req) });

    res.json({
      user: session,
      token: makeToken(session),
      mustChangePassword,
    });
  } catch (e) {
    console.error("[login] failed:", e);
    res.status(500).json({ error: "服务器繁忙，请稍后重试" });
  }
});

// POST /api/auth/register
router.post("/register", rateLimitMiddleware, async (req: Request, res: Response) => {
  try {
    await ensureCompatColumns();
    await ensureSeed();
    const body = req.body || {};
    const account = String(body.account ?? body.username ?? "").trim();
    const password = body.password || "";
    const confirmPassword = body.confirmPassword || "";
    const nickname = (body.nickname || "").trim();
    const securityCode = (body.securityCode || "").trim();
    const inviteCode = (body.inviteCode || "").trim().toUpperCase();

    if (!account || !password || !confirmPassword || !securityCode) {
      res.status(400).json({ error: "请填写所有必填字段" });
      return;
    }
    if (!inviteCode) {
      res.status(400).json({ error: "请填写邀请码" });
      return;
    }
    if (password !== confirmPassword) {
      res.status(400).json({ error: "两次输入的密码不一致" });
      return;
    }
    if (account.length < 3) {
      res.status(400).json({ error: "账号至少需要3个字符" });
      return;
    }
    if (password.length < 6) {
      res.status(400).json({ error: "密码至少需要6位" });
      return;
    }

    const existing = await db
      .select()
      .from(users)
      .where(eq(users.account, account))
      .limit(1);
    if (existing.length) {
      res.status(400).json({ error: "账号已存在，请更换" });
      return;
    }

    const inviterRows = await db
      .select()
      .from(users)
      .where(eq(users.inviteCode, inviteCode))
      .limit(1);
    const inviter = inviterRows[0];
    if (!inviter) {
      res.status(400).json({ error: "邀请码无效" });
      return;
    }
    if (!INVITER_ROLES.includes(inviter.role)) {
      res.status(400).json({ error: "该邀请码无效，请使用代理提供的邀请码" });
      return;
    }
    const invitedById = inviter.id;
    const invitedByCode = inviter.inviteCode;

    const inserted = await db
      .insert(users)
      .values({
        account,
        password: hashPassword(password),
        securityCode,
        role: "player",
        nickname: nickname || account,
        avatar: String(Math.floor(Math.random() * 8) + 1),
        inviteCode: `P-${genInviteCode()}`,
        invitedByCode,
        invitedById,
        credit: 0,
        points: 0,
        lastLoginAt: new Date(),
      })
      .returning();

    const u = inserted[0];
    setSession(res, { id: u.id, account: u.account, role: u.role });

    // 注册时关联设备（如果请求携带x-device-id）
    const deviceId = req.headers["x-device-id"];
    if (deviceId && typeof deviceId === "string" && deviceId.trim()) {
      const did = deviceId.trim().slice(0, 64);
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
      await db.insert(devices).values({ userId: u.id, deviceId: did, name: `${platform} 设备`, platform, trusted: true });
    }

    audit.info("register_success", { userId: u.id, account: u.account, ip: getRequestIp(req) });
    res.json({
      user: { id: u.id, account: u.account, role: u.role },
      token: makeToken({ id: u.id, account: u.account, role: u.role }),
    });
  } catch (e) {
    console.error("[register] failed:", e);
    res.status(500).json({ error: "服务器繁忙，请稍后重试" });
  }
});

// POST /api/auth/logout
router.post("/logout", (req: Request, res: Response) => {
  clearSession(res);
  res.json({ ok: true });
});

// GET /api/auth/me
router.get("/me", async (req: Request, res: Response) => {
  const u = await getCurrentUser(req);
  if (!u) {
    res.json({ user: null });
    return;
  }
  res.json({
    user: {
      id: u.id,
      account: u.account,
      nickname: u.nickname || u.account,
      avatar: u.avatar,
      role: u.role,
      credit: u.credit,
      points: u.points,
      commission: u.commission || 0,
      inviteCode: u.inviteCode,
      invitedByCode: u.invitedByCode,
      openRoomBlocked: u.openRoomBlocked,
    },
  });
});

export default router;

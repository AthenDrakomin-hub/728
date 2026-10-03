import { Router } from "express";
import { users, devices, onlineSessions } from "../db/schema.js";
import { hashPassword, verifyPassword, signToken } from "../lib/auth.js";
import { generateInviteCode } from "../lib/utils.js";
import { sendLegacy } from "../middleware/legacyResponse.js";

const router = Router();

function nowTs() {
  return Math.floor(Date.now() / 1000);
}

function fmtTs(ts?: number | null) {
  if (!ts) return "";
  return new Date(ts * 1000).toISOString();
}

function makePublicUser(u: typeof users.$inferSelect) {
  return {
    uid: u.id,
    account: u.account,
    nickname: u.nickname || u.account,
    headimgurl: u.avatar || "",
    pictureframe: u.headFrame || "",
    gold: u.gold,
    bank: u.bankGold,
    rcard: u.rcard,
    status: u.status,
    agentPower: u.agentPower,
    power: u.power,
    control: u.control,
    controlGold: u.controlGold,
    monthlyend: fmtTs(u.monthlyEnd),
    income: u.income,
    expenditure: u.expenditure,
    created: fmtTs(u.createdAt),
    last_time: fmtTs(u.lastLoginAt) || fmtTs(u.createdAt),
    invite_code: u.inviteCode,
    invited_by_code: u.invitedByCode || "",
  };
}

// POST /Login
router.post("/Login", async (req, res) => {
  try {
    const { uid, password, equipmentcard, type = 1, code = -1 } = req.body || {};
    const account = String(uid || "").trim();
    const pwd = String(password || "");
    const deviceId = String(equipmentcard || "").trim() || "unknown";

    if (!account || !pwd) {
      return sendLegacy(res, {}, 40001, "账号或密码为空");
    }

    const userRows = users.select().where((u) => u.account === account).limit(1);
    if (!userRows.length) {
      return sendLegacy(res, {}, 40001, "账号不存在");
    }

    const user = userRows[0];
    if (user.status === 0) {
      return sendLegacy(res, {}, 40001, "账号已被封禁");
    }

    if (!verifyPassword(pwd, user.password)) {
      return sendLegacy(res, {}, 40001, "密码错误");
    }

    users.update({ lastLoginAt: nowTs(), lastLoginIp: req.ip || "", deviceId })
      .where((u) => u.id === user.id);

    const existingDevice = devices.select()
      .where((d) => d.userId === user.id && d.deviceId === deviceId).limit(1);
    if (existingDevice.length) {
      devices.update({ lastActiveAt: nowTs() })
        .where((d) => d.id === existingDevice[0].id);
    } else {
      devices.insert({
        userId: user.id,
        deviceId,
        name: `${deviceId}`,
        platform: "android",
        trusted: true,
        createdAt: nowTs(),
        lastActiveAt: nowTs(),
      });
    }

    const token = signToken({ userId: user.id, account: user.account, role: user.role });

    const existingSession = onlineSessions.select()
      .where((s) => s.userId === user.id).limit(1);
    if (existingSession.length) {
      onlineSessions.update({ token, deviceId, lastHeartbeat: nowTs() })
        .where((s) => s.userId === user.id);
    } else {
      onlineSessions.insert({
        userId: user.id,
        token,
        deviceId,
        lastHeartbeat: nowTs(),
        createdAt: nowTs(),
      });
    }

    return sendLegacy(res, {
      token,
      uid: user.id,
      ...makePublicUser({ ...user, lastLoginAt: nowTs(), deviceId }),
    });
  } catch (err: any) {
    console.error("Login error:", err);
    return sendLegacy(res, {}, 50000, err.message || "登录失败");
  }
});

// POST /register
router.post("/register", async (req, res) => {
  try {
    const { uid, password, code, equipmentcard, type = 1 } = req.body || {};
    const account = String(uid || "").trim();
    const pwd = String(password || "");
    const inviteCode = String(code || "").trim();
    const deviceId = String(equipmentcard || "").trim() || "unknown";

    if (!account || !pwd) {
      return sendLegacy(res, {}, 40001, "账号或密码为空");
    }
    if (pwd.length < 6) {
      return sendLegacy(res, {}, 40001, "密码至少6位");
    }

    const exists = users.select().where((u) => u.account === account).limit(1);
    if (exists.length) {
      return sendLegacy(res, {}, 40001, "账号已存在");
    }

    let invitedById: number | null = null;
    let invitedByCode: string | null = null;
    if (inviteCode) {
      const inviter = users.select().where((u) => u.inviteCode === inviteCode).limit(1);
      if (inviter.length) {
        invitedById = inviter[0].id;
        invitedByCode = inviteCode;
      }
    }

    let newInviteCode = generateInviteCode();
    while (true) {
      const dup = users.select().where((u) => u.inviteCode === newInviteCode).limit(1);
      if (!dup.length) break;
      newInviteCode = generateInviteCode();
    }

    const user = users.insert({
      account,
      password: hashPassword(pwd),
      securityCode: "1234",
      nickname: account,
      avatar: "",
      headFrame: "",
      gold: 10000,
      bankGold: 0,
      rcard: 0,
      status: 1,
      role: "player",
      agentPower: 0,
      power: 0,
      control: 0,
      controlGold: 0,
      monthlyEnd: 0,
      income: 0,
      expenditure: 0,
      inviteCode: newInviteCode,
      invitedById,
      invitedByCode,
      deviceId,
      lastLoginAt: 0,
      lastLoginIp: "",
      createdAt: nowTs(),
    });

    const token = signToken({ userId: user.id, account: user.account, role: user.role });

    devices.insert({
      userId: user.id,
      deviceId,
      name: `${deviceId}`,
      platform: "android",
      trusted: true,
      createdAt: nowTs(),
      lastActiveAt: nowTs(),
    });

    onlineSessions.insert({
      userId: user.id,
      token,
      deviceId,
      lastHeartbeat: nowTs(),
      createdAt: nowTs(),
    });

    return sendLegacy(res, {
      token,
      uid: user.id,
      ...makePublicUser(user),
    });
  } catch (err: any) {
    console.error("Register error:", err);
    return sendLegacy(res, {}, 50000, err.message || "注册失败");
  }
});

// POST /ChangePassword
router.post("/ChangePassword", async (req, res) => {
  try {
    const { uid, oldPassword, newPassword } = req.body || {};
    const account = String(uid || "").trim();
    if (!account || !oldPassword || !newPassword) {
      return sendLegacy(res, {}, 40001, "参数不完整");
    }

    const userRows = users.select().where((u) => u.account === account).limit(1);
    if (!userRows.length) {
      return sendLegacy(res, {}, 40001, "账号不存在");
    }

    const user = userRows[0];
    if (!verifyPassword(oldPassword, user.password)) {
      return sendLegacy(res, {}, 40001, "原密码错误");
    }

    users.update({ password: hashPassword(newPassword) }).where((u) => u.id === user.id);
    return sendLegacy(res, { ok: true });
  } catch (err: any) {
    console.error("ChangePassword error:", err);
    return sendLegacy(res, {}, 50000, err.message || "修改失败");
  }
});

// POST /forgeBank
router.post("/forgeBank", async (_req, res) => {
  return sendLegacy(res, {}, 50000, "暂未实现");
});

// POST /upgrade
router.post("/upgrade", async (_req, res) => {
  return sendLegacy(res, {}, 50000, "暂未实现");
});

// POST /VerificationCode
router.post("/VerificationCode", async (_req, res) => {
  return sendLegacy(res, { code: "123456" });
});

export default router;

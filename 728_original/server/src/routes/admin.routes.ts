import { Router } from "express";
import { adminUsers, users, rooms, gameConfigs, chipTransactions } from "../db/schema.js";
import { verifyPassword, hashPassword } from "../lib/auth.js";
import { sendLegacy } from "../middleware/legacyResponse.js";

const router = Router();

function nowTs() {
  return Math.floor(Date.now() / 1000);
}

// POST /terrace/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body || {};
    const account = String(username || "").trim();
    const pwd = String(password || "");

    if (!account || !pwd) {
      return sendLegacy(res, {}, 40001, "账号或密码为空");
    }

    const rows = adminUsers.select().where((u) => u.account === account).limit(1);
    if (!rows.length || !verifyPassword(pwd, rows[0].password)) {
      return sendLegacy(res, {}, 40001, "账号或密码错误");
    }

    adminUsers.update({ lastLoginAt: nowTs() }).where((u) => u.id === rows[0].id);
    return sendLegacy(res, { token: "mock-admin-token-728" });
  } catch (err: any) {
    console.error("Admin login error:", err);
    return sendLegacy(res, {}, 50000, err.message);
  }
});

// GET /terrace/mainpage
router.get("/mainpage", async (_req, res) => {
  try {
    const totalUsers = users.count();
    const totalAgents = users.countWhere((u) => u.role === "agent");
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTs = Math.floor(today.getTime() / 1000);
    const todayNewUsers = users.countWhere((u) => (u.createdAt || 0) >= todayTs);
    const activeRooms = rooms.countWhere((r) => r.status === 1);

    return sendLegacy(res, {
      today_new_users: todayNewUsers,
      today_active_users: Math.floor(Math.random() * 5000) + 1000,
      today_room_count: Math.floor(Math.random() * 1000) + 100,
      today_water: Math.floor(Math.random() * 10000000),
      total_users: totalUsers,
      total_agents: totalAgents,
      total_profit: Math.floor(Math.random() * 100000000),
      online_users: Math.floor(Math.random() * 2000) + 500,
      active_rooms: activeRooms,
    });
  } catch (err: any) {
    console.error("Mainpage error:", err);
    return sendLegacy(res, {}, 50000, err.message);
  }
});

// GET /terrace/users
router.get("/users", async (req, res) => {
  try {
    const q = String(req.query.q || "").trim();
    const role = String(req.query.role || "").trim();

    const rows = users.all().slice(0, 100);

    return sendLegacy(res, {
      list: rows.map((u) => ({
        id: u.id,
        account: u.account,
        nickname: u.nickname,
        gold: u.gold,
        bank: u.bankGold,
        role: u.role,
        agentPower: u.agentPower,
        status: u.status,
        inviteCode: u.inviteCode,
        createdAt: u.createdAt,
      })),
      total: rows.length,
    });
  } catch (err: any) {
    console.error("Users error:", err);
    return sendLegacy(res, {}, 50000, err.message);
  }
});

// POST /terrace/user/ban
router.post("/user/ban", async (req, res) => {
  try {
    const { id, status } = req.body || {};
    users.update({ status: status ? 1 : 0 }).where((u) => u.id === Number(id));
    return sendLegacy(res, { ok: true });
  } catch (err: any) {
    return sendLegacy(res, {}, 50000, err.message);
  }
});

// POST /terrace/gold/adjust
router.post("/gold/adjust", async (req, res) => {
  try {
    const { id, amount } = req.body || {};
    const userId = Number(id);
    const amt = Math.trunc(Number(amount));
    const userRows = users.select().where((u) => u.id === userId).limit(1);
    if (!userRows.length) return sendLegacy(res, {}, 40001, "用户不存在");

    users.update({ gold: userRows[0].gold + amt }).where((u) => u.id === userId);
    return sendLegacy(res, { ok: true, gold: userRows[0].gold + amt });
  } catch (err: any) {
    return sendLegacy(res, {}, 50000, err.message);
  }
});

// GET /terrace/games/config
router.get("/games/config", async (_req, res) => {
  try {
    const rows = gameConfigs.all();
    return sendLegacy(res, { list: rows });
  } catch (err: any) {
    return sendLegacy(res, {}, 50000, err.message);
  }
});

// POST /terrace/games/config
router.post("/games/config", async (req, res) => {
  try {
    const { id, enabled, maintenance } = req.body || {};
    gameConfigs.update({ enabled: !!enabled, maintenance: !!maintenance })
      .where((c) => c.id === Number(id));
    return sendLegacy(res, { ok: true });
  } catch (err: any) {
    return sendLegacy(res, {}, 50000, err.message);
  }
});

// GET /terrace/rooms — 房间列表
router.get("/rooms", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 50;
    const all = rooms.all();
    const start = (page - 1) * pageSize;
    const list = all.slice(start, start + pageSize).map((r) => ({
      id: r.id, roomNo: r.roomNo, gameType: r.gameType, status: r.status,
      currentRound: r.currentRound, totalRounds: r.totalRounds, maxSeats: r.maxSeats,
      agentId: r.agentId, totalFlow: r.totalFlow, createdAt: r.createdAt,
    }));
    return sendLegacy(res, { list, total: all.length, page, pageSize });
  } catch (err: any) {
    return sendLegacy(res, {}, 50000, err.message);
  }
});

// POST /terrace/rooms/dismiss — 解散房间
router.post("/rooms/dismiss", async (req, res) => {
  try {
    const { id } = req.body || {};
    rooms.delete().where((r) => r.id === Number(id));
    return sendLegacy(res, { ok: true });
  } catch (err: any) {
    return sendLegacy(res, {}, 50000, err.message);
  }
});

// GET /terrace/gold/transactions — 金币流水
router.get("/gold/transactions", async (req, res) => {
  try {
    const userId = Number(req.query.userId) || 0;
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 50;
    let all = chipTransactions.all();
    if (userId) all = all.filter((t) => t.userId === userId);
    all = all.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    const start = (page - 1) * pageSize;
    const list = all.slice(start, start + pageSize);
    return sendLegacy(res, { list, total: all.length, page, pageSize });
  } catch (err: any) {
    return sendLegacy(res, {}, 50000, err.message);
  }
});

// GET /terrace/monitor — 服务器监控
router.get("/monitor", async (_req, res) => {
  try {
    const mem = process.memoryUsage();
    return sendLegacy(res, {
      uptime: Math.floor(process.uptime()),
      memory: { rss: Math.round(mem.rss / 1024 / 1024), heapUsed: Math.round(mem.heapUsed / 1024 / 1024) },
      totalUsers: users.count(),
      totalRooms: rooms.count(),
      activeRooms: rooms.countWhere((r) => r.status === 1),
      timestamp: Date.now(),
    });
  } catch (err: any) {
    return sendLegacy(res, {}, 50000, err.message);
  }
});

export default router;

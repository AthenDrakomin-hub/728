// 后台管理 API - 兼容 Vue2 管理面板
const { Router } = require("express");
const jwt = require("jsonwebtoken");
const config = require("../config");
const db = require("../db/init");

const router = Router();

// ---------- 鉴权中间件 ----------
function authAdmin(req, res, next) {
  const token = req.headers["x-token"] || req.headers["authorization"]?.replace("Bearer ", "");
  if (!token) return res.json({ code: 50008, msg: "未登录" });
  try {
    const d = jwt.verify(token, config.JWT_SECRET);
    if (d.type !== "admin") return res.json({ code: 50003, msg: "无管理员权限" });
    req.uid = d.uid;
    next();
  } catch (e) {
    res.json({ code: 50014, msg: "Token过期" });
  }
}

// ---------- 登录 ----------
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare("SELECT * FROM users WHERE username = ? AND user_type = 'admin'").get(username);
  if (!user) return res.json({ code: 40001, msg: "账号不存在或非管理员" });
  const bcrypt = require("bcryptjs");
  if (!bcrypt.compareSync(password, user.password)) return res.json({ code: 40003, msg: "密码错误" });
  const token = jwt.sign({ uid: user.uid, type: "admin" }, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES });
  res.json({ code: 20000, data: { token } });
});

// ---------- 用户信息 ----------
router.get("/user/info", authAdmin, (req, res) => {
  res.json({
    code: 20000,
    data: {
      roles: ["admin"],
      name: "超级管理员",
      avatar: "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
    }
  });
});

router.post("/user/logout", authAdmin, (req, res) => {
  res.json({ code: 20000, data: "success" });
});

// ---------- 数据总览 ----------
router.post("/mainpage", authAdmin, (req, res) => {
  const today = new Date().toISOString().slice(0, 10);
  const totalUsers = db.prepare("SELECT COUNT(*) as c FROM users").get().c;
  const totalAgents = db.prepare("SELECT COUNT(*) as c FROM users WHERE user_type IN ('agent','top_agent')").get().c;
  const onlineUsers = db.prepare("SELECT COUNT(*) as c FROM online_users").get().c;
  const todayNew = db.prepare("SELECT COUNT(*) as c FROM users WHERE date(created_at) = ?").get(today).c;
  const todayRooms = db.prepare("SELECT COUNT(*) as c FROM rooms WHERE date(created_at) = ?").get(today).c;
  const totalProfit = db.prepare("SELECT COALESCE(SUM(platform_net),0) as c FROM settlement_records").get().c;
  const todayWater = db.prepare("SELECT COALESCE(SUM(total_flow),0) as c FROM rooms WHERE date(created_at) = ?").get(today).c;

  res.json({
    code: 20000,
    data: {
      today_new_users: todayNew,
      today_active_users: onlineUsers,
      today_room_count: todayRooms,
      today_water: todayWater,
      total_users: totalUsers,
      total_agents: totalAgents,
      total_profit: totalProfit,
      online_users: onlineUsers,
    }
  });
});

// ---------- 用户管理 ----------
router.get("/table/list", authAdmin, (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;
  const total = db.prepare("SELECT COUNT(*) as c FROM users").get().c;
  const items = db.prepare(`
    SELECT u.uid, u.username, u.nickname, u.user_type, u.agent_power, u.is_banned,
           p.points, c.credit, cm.commission, u.created_at
    FROM users u
    LEFT JOIN points_account p ON u.uid = p.uid
    LEFT JOIN credit_account c ON u.uid = c.uid
    LEFT JOIN commission_account cm ON u.uid = cm.uid
    ORDER BY u.uid DESC LIMIT ? OFFSET ?
  `).all(limit, offset);

  res.json({ code: 20000, data: { items, total } });
});

// ---------- 房间管理 ----------
router.get("/rooms", authAdmin, (req, res) => {
  const rooms = db.prepare(`
    SELECT r.*, u.nickname as owner_name FROM rooms r
    JOIN users u ON r.owner_uid = u.uid
    ORDER BY r.created_at DESC LIMIT 50
  `).all();
  res.json({ code: 20000, data: { items: rooms, total: rooms.length } });
});

// ---------- 对账明细 ----------
router.get("/settlements", authAdmin, (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;
  const total = db.prepare("SELECT COUNT(*) as c FROM settlement_records").get().c;
  const items = db.prepare(`
    SELECT s.*, u.nickname as owner_name FROM settlement_records s
    JOIN users u ON s.owner_uid = u.uid
    ORDER BY s.settled_at DESC LIMIT ? OFFSET ?
  `).all(limit, offset);
  res.json({ code: 20000, data: { items, total } });
});

// ---------- 系统配置 ----------
router.get("/config", authAdmin, (req, res) => {
  const configs = db.prepare("SELECT * FROM system_config").all();
  res.json({ code: 20000, data: configs });
});

router.post("/config", authAdmin, (req, res) => {
  const { key, value } = req.body;
  db.prepare("UPDATE system_config SET value = ?, updated_at = datetime('now') WHERE key = ?").run(value, key);
  res.json({ code: 20000, msg: "配置已更新" });
});

// ---------- 添加信用分 ----------
router.post("/credit/add", authAdmin, (req, res) => {
  const { uid, amount, note } = req.body;
  const account = db.prepare("SELECT * FROM credit_account WHERE uid = ?").get(uid);
  if (!account) return res.json({ code: 40020, msg: "该用户没有信用分账户（非代理）" });

  const before = account.credit;
  const after = before + amount;
  db.prepare("UPDATE credit_account SET credit = ?, updated_at = datetime('now') WHERE uid = ?").run(after, uid);

  db.prepare(`INSERT INTO chip_transactions (uid, type, amount, balance_before, balance_after, operator_uid, note, display_tag)
    VALUES (?, 'credit_add', ?, ?, ?, ?, ?, '客服增加信用分')`).run(uid, amount, before, after, req.uid, note || "");

  res.json({ code: 20000, data: { uid, before, after, credit: after } });
});

// ==================== 通用兜底 ====================
router.all("*", (req, res) => {
  res.json({ code: 20000, data: {} });
});

module.exports = router;
// 认证 API - 登录/注册/用户信息
const { Router } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");
const db = require("../db/init");

const router = Router();

// 登录
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
  if (!user) return res.json({ code: 40001, msg: "账号不存在" });
  if (user.is_banned) return res.json({ code: 40002, msg: "账号已被封禁: " + (user.banned_reason || "无") });
  if (!bcrypt.compareSync(password, user.password)) return res.json({ code: 40003, msg: "密码错误" });

  const token = jwt.sign({ uid: user.uid, type: user.user_type }, config.JWT_SECRET, { expiresIn: config.JWT_EXPIRES });
  db.prepare("UPDATE users SET last_login_time = datetime('now'), last_login_ip = ? WHERE uid = ?").run(req.ip, user.uid);

  res.json({
    code: 20000,
    data: {
      token,
      uid: user.uid,
      username: user.username,
      nickname: user.nickname,
      user_type: user.user_type,
      agent_power: user.agent_power,
    }
  });
});

// 注册
router.post("/register", (req, res) => {
  const { username, password, nickname, invite_code } = req.body;
  if (!username || !password) return res.json({ code: 40010, msg: "用户名和密码不能为空" });

  const exists = db.prepare("SELECT uid FROM users WHERE username = ?").get(username);
  if (exists) return res.json({ code: 40011, msg: "用户名已存在" });

  let parent_agent_id = null, user_type = "player";
  if (invite_code) {
    const agent = db.prepare("SELECT uid, user_type FROM users WHERE invite_code = ?").get(invite_code);
    if (agent && (agent.user_type === "agent" || agent.user_type === "top_agent")) {
      parent_agent_id = agent.uid;
    }
  }

  const hash = bcrypt.hashSync(password, 10);
  const result = db.prepare(
    "INSERT INTO users (username, password, nickname, user_type, parent_agent_id) VALUES (?, ?, ?, ?, ?)"
  ).run(username, hash, nickname || username, user_type, parent_agent_id);
  const uid = result.lastInsertRowid;

  db.prepare("INSERT INTO points_account (uid, points) VALUES (?, 0)").run(uid);
  if (user_type === "agent" || user_type === "top_agent") {
    db.prepare("INSERT INTO credit_account (uid, credit) VALUES (?, 0)").run(uid);
    db.prepare("INSERT INTO commission_account (uid, commission, total_commission) VALUES (?, 0, 0)").run(uid);
  }

  res.json({ code: 20000, data: { uid, username } });
});

// 获取用户信息
router.get("/user/info", auth, (req, res) => {
  const user = db.prepare("SELECT uid, username, nickname, avatar, user_type, agent_power FROM users WHERE uid = ?").get(req.uid);
  if (!user) return res.json({ code: 40004, msg: "用户不存在" });

  const points = db.prepare("SELECT points FROM points_account WHERE uid = ?").get(req.uid);
  const credit = db.prepare("SELECT credit FROM credit_account WHERE uid = ?").get(req.uid);
  const commission = db.prepare("SELECT commission FROM commission_account WHERE uid = ?").get(req.uid);

  res.json({
    code: 20000,
    data: {
      ...user,
      roles: [user.user_type === "admin" ? "admin" : "user"],
      points: points ? points.points : 0,
      credit: credit ? credit.credit : 0,
      commission: commission ? commission.commission : 0,
    }
  });
});

// 登出
router.post("/user/logout", auth, (req, res) => {
  res.json({ code: 20000, data: "success" });
});

// JWT 中间件
function auth(req, res, next) {
  const token = req.headers["x-token"] || req.headers["authorization"]?.replace("Bearer ", "");
  if (!token) return res.json({ code: 50008, msg: "未登录" });
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.uid = decoded.uid;
    req.user_type = decoded.type;
    next();
  } catch (e) {
    res.json({ code: 50014, msg: "Token 已过期" });
  }
}

module.exports = router;
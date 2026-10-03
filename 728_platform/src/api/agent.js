// 代理 API - 上下分、信用分管理、返佣
const { Router } = require("express");
const jwt = require("jsonwebtoken");
const config = require("../config");
const db = require("../db/init");

const router = Router();

function auth(req, res, next) {
  const token = req.headers["x-token"] || req.headers["authorization"]?.replace("Bearer ", "");
  if (!token) return res.json({ code: 50008, msg: "未登录" });
  try { const d = jwt.verify(token, config.JWT_SECRET); req.uid = d.uid; req.user_type = d.type; next(); }
  catch (e) { res.json({ code: 50014, msg: "Token过期" }); }
}

// 代理给玩家上分（从代理筹码扣）
router.post("/agent/charge", auth, (req, res) => {
  const { player_uid, amount, room_id } = req.body;
  const agent_uid = req.uid;

  if (req.user_type === "player") return res.json({ code: 40040, msg: "只有代理可以上分" });

  const agentPoints = db.prepare("SELECT points FROM points_account WHERE uid = ?").get(agent_uid);
  if (!agentPoints || agentPoints.points < amount) return res.json({ code: 40041, msg: "代理筹码不足" });

  db.prepare("UPDATE points_account SET points = points - ? WHERE uid = ?").run(amount, agent_uid);
  db.prepare("UPDATE points_account SET points = points + ? WHERE uid = ?").run(amount, player_uid);

  db.prepare(`INSERT INTO chip_transactions (uid, room_id, type, amount, balance_before, balance_after, operator_uid, display_tag)
    VALUES (?, ?, 'agent_add', ?, ?, (SELECT points FROM points_account WHERE uid = ?), ?, '代理上分')`)
    .run(player_uid, room_id || null, amount, 0, player_uid, agent_uid);

  db.prepare(`INSERT INTO chip_transactions (uid, room_id, type, amount, balance_before, balance_after, operator_uid, display_tag)
    VALUES (?, ?, 'agent_deduct', ?, ?, (SELECT points FROM points_account WHERE uid = ?), ?, '代理上分支出')`)
    .run(agent_uid, room_id || null, -amount, agentPoints.points, agent_uid, agent_uid);

  res.json({ code: 20000, data: { player_uid, amount, agent_points: agentPoints.points - amount } });
});

// 代理给玩家下分
router.post("/agent/deduct", auth, (req, res) => {
  const { player_uid, amount } = req.body;
  const agent_uid = req.uid;

  if (req.user_type === "player") return res.json({ code: 40040, msg: "只有代理可以操作" });

  const playerPoints = db.prepare("SELECT points FROM points_account WHERE uid = ?").get(player_uid);
  if (!playerPoints || playerPoints.points < amount) return res.json({ code: 40042, msg: "玩家筹码不足" });

  db.prepare("UPDATE points_account SET points = points - ? WHERE uid = ?").run(amount, player_uid);
  db.prepare("UPDATE points_account SET points = points + ? WHERE uid = ?").run(amount, agent_uid);

  db.prepare(`INSERT INTO chip_transactions (uid, type, amount, balance_before, balance_after, operator_uid, display_tag)
    VALUES (?, 'agent_deduct', ?, ?, (SELECT points FROM points_account WHERE uid = ?), ?, '代理下分')`)
    .run(player_uid, -amount, playerPoints.points, player_uid, agent_uid);

  res.json({ code: 20000, data: { player_uid, amount } });
});

// 查询代理信用分
router.get("/agent/credit", auth, (req, res) => {
  const credit = db.prepare("SELECT * FROM credit_account WHERE uid = ?").get(req.uid);
  res.json({ code: 20000, data: credit || { credit: 0, frozen_credit: 0 } });
});

// 查询代理返佣
router.get("/agent/commission", auth, (req, res) => {
  const commission = db.prepare("SELECT * FROM commission_account WHERE uid = ?").get(req.uid);
  res.json({ code: 20000, data: commission || { commission: 0, total_commission: 0 } });
});

// 查询代理下级玩家
router.get("/agent/players", auth, (req, res) => {
  if (req.user_type === "player") return res.json({ code: 40040, msg: "无权限" });
  const players = db.prepare(`
    SELECT u.uid, u.nickname, p.points, u.created_at FROM users u
    JOIN points_account p ON u.uid = p.uid
    WHERE u.parent_agent_id = ? ORDER BY u.created_at DESC
  `).all(req.uid);
  res.json({ code: 20000, data: players });
});

// 获取流水明细
router.get("/agent/transactions", auth, (req, res) => {
  const { limit, offset } = req.query;
  const txs = db.prepare(
    "SELECT * FROM chip_transactions WHERE uid = ? ORDER BY created_at DESC LIMIT ? OFFSET ?"
  ).all(req.uid, parseInt(limit) || 50, parseInt(offset) || 0);
  res.json({ code: 20000, data: txs });
});

module.exports = router;
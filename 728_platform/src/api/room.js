// 房间管理 API
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

// 创建房间
router.post("/room/create", auth, (req, res) => {
  const { game_type, max_buyin, min_buyin, max_players } = req.body;
  const uid = req.uid;

  // 权限检查：玩家不能开房
  if (req.user_type === "player") return res.json({ code: 40030, msg: "玩家不能开房，请联系代理" });

  // 代理检查信用分
  if (req.user_type === "agent" || req.user_type === "top_agent") {
    const credit = db.prepare("SELECT credit FROM credit_account WHERE uid = ?").get(uid);
    if (!credit || credit.credit < 100) return res.json({ code: 40031, msg: "信用分不足，无法开房" });
  }

  const game = config.GAME_LIST.find(g => g.id === game_type);
  if (!game) return res.json({ code: 40032, msg: "游戏类型不存在" });

  const roomCode = "R" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();
  const result = db.prepare(`
    INSERT INTO rooms (room_code, game_type, owner_uid, max_buyin, min_buyin, max_players)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(roomCode, game_type, uid,
    max_buyin || config.ROOM_DEFAULT.max_buyin,
    min_buyin || config.ROOM_DEFAULT.min_buyin,
    max_players || game.max_players
  );

  res.json({ code: 20000, data: { room_id: result.lastInsertRowid, room_code: roomCode, game_type } });
});

// 获取房间列表
router.get("/rooms", auth, (req, res) => {
  const { game_type, status } = req.query;
  let sql = "SELECT r.*, u.nickname as owner_name FROM rooms r JOIN users u ON r.owner_uid = u.uid WHERE 1=1";
  const params = [];
  if (game_type) { sql += " AND r.game_type = ?"; params.push(game_type); }
  if (status) { sql += " AND r.status = ?"; params.push(status); }
  else { sql += " AND r.status != 'closed'"; }
  sql += " ORDER BY r.created_at DESC LIMIT 50";

  const rooms = db.prepare(sql).all(...params);
  res.json({ code: 20000, data: rooms });
});

// 进入房间
router.post("/room/enter", auth, (req, res) => {
  const { room_id } = req.body;
  const uid = req.uid;
  const room = db.prepare("SELECT * FROM rooms WHERE id = ?").get(room_id);
  if (!room) return res.json({ code: 40033, msg: "房间不存在" });
  if (room.status === "closed") return res.json({ code: 40034, msg: "房间已关闭" });
  if (room.cur_players >= room.max_players) return res.json({ code: 40035, msg: "房间已满" });

  const existing = db.prepare("SELECT * FROM room_players WHERE room_id = ? AND uid = ? AND status = 'active'").get(room_id, uid);
  if (existing) return res.json({ code: 20000, data: { room, msg: "已在房间中" } });

  const points = db.prepare("SELECT points FROM points_account WHERE uid = ?").get(uid);
  const enterPoints = Math.min(points.points, room.max_buyin);

  db.prepare("INSERT INTO room_players (room_id, uid, seat, points) VALUES (?, ?, ?, ?)").run(room_id, uid, room.cur_players + 1, enterPoints);
  db.prepare("UPDATE rooms SET cur_players = cur_players + 1 WHERE id = ?").run(room_id);
  db.prepare("UPDATE points_account SET points = points - ?, frozen_points = frozen_points + ? WHERE uid = ?").run(enterPoints, enterPoints, uid);

  db.prepare(`INSERT INTO chip_transactions (uid, room_id, type, amount, balance_before, balance_after, display_tag)
    VALUES (?, ?, 'room_enter', ?, ?, (SELECT points FROM points_account WHERE uid = ?), '进房带入筹码')`).run(uid, room_id, enterPoints, points.points + enterPoints, uid);

  res.json({ code: 20000, data: { room, enter_points: enterPoints } });
});

// 离开房间
router.post("/room/leave", auth, (req, res) => {
  const { room_id } = req.body;
  const uid = req.uid;

  const rp = db.prepare("SELECT * FROM room_players WHERE room_id = ? AND uid = ? AND status = 'active'").get(room_id, uid);
  if (!rp) return res.json({ code: 40036, msg: "不在房间中" });

  db.prepare("UPDATE room_players SET status = 'left', left_at = datetime('now') WHERE id = ?").run(rp.id);
  db.prepare("UPDATE rooms SET cur_players = MAX(0, cur_players - 1) WHERE id = ?").run(room_id);
  db.prepare("UPDATE points_account SET points = points + ?, frozen_points = frozen_points - ? WHERE uid = ?").run(rp.points, rp.points, uid);

  db.prepare(`INSERT INTO chip_transactions (uid, room_id, type, amount, balance_before, balance_after, display_tag)
    VALUES (?, ?, 'room_leave', ?, ?, (SELECT points FROM points_account WHERE uid = ?), '离房退回筹码')`).run(uid, room_id, rp.points, 0, uid);

  res.json({ code: 20000, data: { returned_points: rp.points } });
});

module.exports = router;
// WebSocket 网关 - 对接 Cocos Creator 客户端协议
// 协议: JSON → Base64编码, event路由: Msg_模块_动作 → /动作
const jwt = require("jsonwebtoken");
const config = require("../config");

// 在线用户映射: uid → socket
const onlineUsers = new Map();

module.exports = function (io, socket, db) {
  console.log(`[WS] 新连接: ${socket.id}`);

  socket.on("message", (raw) => {
    let msg;
    try {
      // 协议: Base64(JSON)
      const decoded = Buffer.from(raw, "base64").toString("utf-8");
      msg = JSON.parse(decoded);
    } catch (e) {
      // 尝试直接 JSON
      try { msg = JSON.parse(raw); } catch (e2) {
        return socket.emit("message", pack({ event: "Msg_Hall_ERROR", data: { msg: "消息格式错误" } }));
      }
    }

    if (!msg.event) return;
    const route = msg.event.split("_").pop(); // Msg_Hall_Connect → Connect
    handleEvent(io, socket, db, msg, route);
  });

  socket.on("disconnect", () => {
    for (const [uid, s] of onlineUsers) {
      if (s.id === socket.id) {
        onlineUsers.delete(uid);
        db.prepare("DELETE FROM online_users WHERE uid = ?").run(uid);
        console.log(`[WS] 用户离线: uid=${uid}`);
        break;
      }
    }
  });
};

function handleEvent(io, socket, db, msg, route) {
  const { event, uid, data = {} } = msg;

  switch (route) {
    // ========== 大厅 ==========
    case "Connect": {
      try {
        const decoded = jwt.verify(data.token, config.JWT_SECRET);
        const user = db.prepare("SELECT * FROM users WHERE uid = ?").get(decoded.uid);
        if (!user) return reply(socket, event, uid, { status: -1, msg: "用户不存在" });

        socket.uid = decoded.uid;
        onlineUsers.set(decoded.uid, socket);
        db.prepare("INSERT OR REPLACE INTO online_users (uid, ws_session_id, login_time, last_heartbeat) VALUES (?, ?, datetime('now'), datetime('now'))").run(decoded.uid, socket.id);

        const points = db.prepare("SELECT points FROM points_account WHERE uid = ?").get(decoded.uid);
        const credit = db.prepare("SELECT credit FROM credit_account WHERE uid = ?").get(decoded.uid);
        const commission = db.prepare("SELECT commission FROM commission_account WHERE uid = ?").get(decoded.uid);

        reply(socket, event, decoded.uid, {
          status: 1,
          uid: user.uid,
          nickname: user.nickname,
          user_type: user.user_type,
          agent_power: user.agent_power,
          gold: points ? points.points : 0,
          credit: credit ? credit.credit : 0,
          commission: commission ? commission.commission : 0,
          rid: 0,
          gamestatus: 0,
        });
        console.log(`[WS] 用户登录: uid=${decoded.uid}, nickname=${user.nickname}`);
      } catch (e) {
        reply(socket, event, 0, { status: -1, msg: "Token无效" });
      }
      break;
    }

    case "Heart": {
      if (socket.uid) {
        db.prepare("UPDATE online_users SET last_heartbeat = datetime('now') WHERE uid = ?").run(socket.uid);
        reply(socket, event, socket.uid, { status: 1 });
      }
      break;
    }

    // ========== 房间 ==========
    case "EnterRoom": {
      if (!socket.uid) return reply(socket, event, 0, { status: -1, msg: "未登录" });
      const room = db.prepare("SELECT * FROM rooms WHERE id = ?").get(data.room_id);
      if (!room) return reply(socket, event, socket.uid, { status: -1, msg: "房间不存在" });

      // 加入 Socket.IO 房间
      socket.join(`room_${room.id}`);
      reply(socket, event, socket.uid, {
        status: 1,
        data: {
          room_id: room.id,
          room_code: room.room_code,
          game_type: room.game_type,
          owner_uid: room.owner_uid,
          max_buyin: room.max_buyin,
          max_players: room.max_players,
          cur_players: room.cur_players,
        }
      });
      break;
    }

    case "GameStatus": {
      if (!socket.uid) return;
      const room = db.prepare("SELECT * FROM rooms WHERE id = ?").get(data.room_id);
      reply(socket, event, socket.uid, {
        status: 1,
        data: room || {}
      });
      break;
    }

    case "FinishLoad": {
      if (!socket.uid) return;
      reply(socket, event, socket.uid, { status: 1 });
      break;
    }

    // ========== 游戏事件转发 ==========
    case "Start":
    case "Out":
    case "Ready":
    case "Bet":
    case "Settle":
    case "WinJPList": {
      if (!socket.uid) return;
      // 广播给同房间其他玩家
      if (data.room_id) {
        socket.to(`room_${data.room_id}`).emit("message", pack({ ...msg, uid: socket.uid }));
      }
      reply(socket, event, socket.uid, { status: 1, data: data });
      break;
    }

    // ========== 金币变动 ==========
    case "ChangeGolds": {
      if (!socket.uid) return;
      const points = db.prepare("SELECT points FROM points_account WHERE uid = ?").get(socket.uid);
      reply(socket, event, socket.uid, {
        status: 1,
        gold: points ? points.points : 0,
      });
      break;
    }

    // ========== 救济金 ==========
    case "GetBenefits": {
      if (!socket.uid) return;
      const points = db.prepare("SELECT points FROM points_account WHERE uid = ?").get(socket.uid);
      if (points && points.points < 1000) {
        db.prepare("UPDATE points_account SET points = points + 1000 WHERE uid = ?").run(socket.uid);
        reply(socket, event, socket.uid, { status: 1, gold: points.points + 1000, msg: "领取成功" });
      } else {
        reply(socket, event, socket.uid, { status: -1, msg: "筹码充足，无需领取" });
      }
      break;
    }

    // ========== 代理相关 ==========
    case "QueryAgentList": {
      const agents = db.prepare(
        "SELECT uid, nickname, invite_code FROM users WHERE user_type IN ('agent','top_agent') AND is_banned = 0 LIMIT 50"
      ).all();
      reply(socket, event, socket.uid, { status: 1, data: agents });
      break;
    }

    // ========== 默认 ==========
    default:
      reply(socket, event, uid || socket.uid || 0, { status: 1, data: data });
  }
}

// 回复消息
function reply(socket, event, uid, data) {
  socket.emit("message", pack({ event, uid: uid || 0, area: 0, data }));
}

// 打包消息: JSON → Base64
function pack(msg) {
  return Buffer.from(JSON.stringify(msg)).toString("base64");
}

module.exports.onlineUsers = onlineUsers;
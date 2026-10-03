#!/usr/bin/env node
// 728棋牌平台 - 信用分代理制后端
// 零外部依赖，纯 Node.js 内置模块
"use strict";

const http = require("http");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

// ==================== 配置 ====================
const CFG = {
  PORT: 8000,
  DATA_DIR: path.join(__dirname, "data"),
  ADMIN_DIR: path.join(__dirname, "..", "728_admin_deploy"),
  JWT_SECRET: "728-platform-secret-2024",
  RATES: { rake: 3, agentDeduct: 2, agentComm: 1, topAgentComm: 1 },
};

// ==================== 数据存储（JSON文件） ====================
fs.mkdirSync(CFG.DATA_DIR, { recursive: true });

function loadDB(name) {
  const fp = path.join(CFG.DATA_DIR, name + ".json");
  try { return JSON.parse(fs.readFileSync(fp, "utf-8")); } catch { return {}; }
}
function saveDB(name, data) {
  fs.writeFileSync(path.join(CFG.DATA_DIR, name + ".json"), JSON.stringify(data, null, 2));
}

// 初始化默认数据
let users = loadDB("users");
let points = loadDB("points");
let credits = loadDB("credits");
let commissions = loadDB("commissions");
let rooms = loadDB("rooms");
let txs = loadDB("transactions");
let settlements = loadDB("settlements");
let online = loadDB("online");

// 默认管理员
if (!users["10000"]) {
  const salt = crypto.randomBytes(16).toString("hex");
  users["10000"] = {
    uid: 10000, username: "admin",
    password: hashPassword("123456", salt), salt,
    nickname: "超级管理员", user_type: "admin", agent_power: 1,
    created_at: now()
  };
  points["10000"] = { points: 999999999, frozen: 0 };
  credits["10000"] = { credit: 999999999, frozen: 0 };
  commissions["10000"] = { commission: 0, total: 0 };
  saveDB("users", users); saveDB("points", points);
  saveDB("credits", credits); saveDB("commissions", commissions);
  console.log("[DB] 默认管理员: admin/123456 (uid=10000)");
}

// ==================== 工具函数 ====================
function hashPassword(pw, salt) {
  return crypto.pbkdf2Sync(pw, salt, 10000, 64, "sha512").toString("hex");
}
function checkPassword(pw, salt, hash) {
  return hashPassword(pw, salt) === hash;
}
function signToken(uid, type) {
  const payload = JSON.stringify({ uid, type, exp: Date.now() + 7 * 24 * 3600 * 1000 });
  const b64 = Buffer.from(payload).toString("base64url");
  const sig = crypto.createHmac("sha256", CFG.JWT_SECRET).update(b64).digest("base64url");
  return `${b64}.${sig}`;
}
function verifyToken(token) {
  try {
    const [b64, sig] = token.split(".");
    const expected = crypto.createHmac("sha256", CFG.JWT_SECRET).update(b64).digest("base64url");
    if (sig !== expected) return null;
    const payload = JSON.parse(Buffer.from(b64, "base64url").toString());
    if (payload.exp < Date.now()) return null;
    return { uid: payload.uid, type: payload.type };
  } catch { return null; }
}
function json(res, data) {
  res.writeHead(200, { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" });
  res.end(JSON.stringify(data));
}
function readBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (c) => body += c);
    req.on("end", () => {
      try { resolve(JSON.parse(body)); } catch { resolve({}); }
    });
  });
}
function getAuth(req) {
  const t = req.headers["x-token"] || req.headers["authorization"]?.replace("Bearer ", "");
  return t ? verifyToken(t) : null;
}
function uid() {
  return String(Math.max(...Object.values(users).map(u => u.uid || 0), 10000) + 1);
}
function now() { return new Date().toISOString(); }

// ==================== HTTP 路由 ====================
const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization,X-Token");
  if (req.method === "OPTIONS") return res.writeHead(200) && res.end();

  const url = new URL(req.url, "http://localhost");
  const p = url.pathname;
  const auth = getAuth(req);
  const body = req.method === "POST" ? await readBody(req) : {};

  // ========== 静态文件 ==========
  if (p.startsWith("/admin/") || p === "/admin") {
    return serveStatic(req, res, p.replace("/admin", ""));
  }

  // ========== 健康检查 ==========
  if (p === "/health") return json(res, { status: "ok", time: now() });

  // ========== 登录 ==========
  if (p === "/api/login" || p === "/terrace/login" || p === "/vue-admin-template/user/login") {
    const { username, password } = body;
    const u = Object.values(users).find(x => x.username === username);
    if (!u) return json(res, { code: 40001, msg: "账号不存在" });
    if (!checkPassword(password, u.salt, u.password)) return json(res, { code: 40003, msg: "密码错误" });
    const token = signToken(u.uid, u.user_type);
    return json(res, { code: 20000, data: { token, uid: u.uid, nickname: u.nickname, user_type: u.user_type } });
  }

  // ========== 注册 ==========
  if (p === "/api/register") {
    const { username, password, nickname } = body;
    if (Object.values(users).find(x => x.username === username)) return json(res, { code: 40011, msg: "用户名已存在" });
    const newUid = uid();
    const salt = crypto.randomBytes(16).toString("hex");
    users[newUid] = {
      uid: parseInt(newUid), username, password: hashPassword(password, salt), salt,
      nickname: nickname || username, user_type: "player", created_at: now()
    };
    points[newUid] = { points: 0, frozen: 0 };
    saveDB("users", users); saveDB("points", points);
    return json(res, { code: 20000, data: { uid: newUid, username } });
  }

  // ========== 鉴权路由 ==========
  if (!auth) return json(res, { code: 50008, msg: "未登录" });
  const myUid = String(auth.uid);

  // --- 用户信息 ---
  if (p === "/api/user/info" || p === "/vue-admin-template/user/info") {
    const u = users[myUid];
    const pt = points[myUid] || { points: 0 };
    const cr = credits[myUid] || { credit: 0 };
    const cm = commissions[myUid] || { commission: 0 };
    return json(res, {
      code: 20000,
      data: {
        uid: u.uid, username: u.username, nickname: u.nickname,
        roles: [u.user_type === "admin" ? "admin" : "user"],
        user_type: u.user_type, agent_power: u.agent_power,
        points: pt.points, credit: cr.credit, commission: cm.commission,
      }
    });
  }

  // --- 登出 ---
  if (p === "/api/user/logout" || p === "/vue-admin-template/user/logout") {
    return json(res, { code: 20000, data: "success" });
  }

  // --- 数据总览 ---
  if (p === "/api/mainpage" || p === "/terrace/mainpage") {
    const allUsers = Object.values(users);
    const agentCount = allUsers.filter(u => u.user_type === "agent" || u.user_type === "top_agent").length;
    const onlineCount = Object.keys(online).length;
    const allSettlements = Object.values(settlements);
    const totalProfit = allSettlements.reduce((s, x) => s + (x.platform_net || 0), 0);
    return json(res, {
      code: 20000,
      data: {
        today_new_users: 0, today_active_users: onlineCount, today_room_count: Object.keys(rooms).length,
        today_water: 0, total_users: allUsers.length, total_agents: agentCount,
        total_profit: totalProfit, online_users: onlineCount,
      }
    });
  }

  // --- 用户列表 ---
  if (p === "/api/users" || p === "/vue-admin-template/table/list") {
    const items = Object.values(users).map(u => {
      const pt = points[String(u.uid)] || { points: 0 };
      const cr = credits[String(u.uid)] || { credit: 0 };
      const cm = commissions[String(u.uid)] || { commission: 0 };
      return { ...u, points: pt.points, credit: cr.credit, commission: cm.commission };
    });
    return json(res, { code: 20000, data: { items, total: items.length } });
  }

  // --- 创建房间 ---
  if (p === "/api/room/create") {
    const { game_type, max_buyin } = body;
    const roomId = "R" + Date.now().toString(36).toUpperCase();
    rooms[roomId] = {
      id: roomId, game_type, owner_uid: auth.uid, max_buyin: max_buyin || 100000,
      min_buyin: 100, max_players: 6, cur_players: 0,
      status: "waiting", total_flow: 0, total_rake: 0, created_at: now()
    };
    saveDB("rooms", rooms);
    return json(res, { code: 20000, data: rooms[roomId] });
  }

  // --- 房间列表 ---
  if (p === "/api/rooms") {
    const list = Object.values(rooms).filter(r => r.status !== "closed");
    return json(res, { code: 20000, data: list });
  }

  // --- 代理上分 ---
  if (p === "/api/agent/charge") {
    const { player_uid, amount } = body;
    const agPts = points[myUid] || { points: 0 };
    if (agPts.points < amount) return json(res, { code: 40041, msg: "筹码不足" });
    agPts.points -= amount;
    points[myUid] = agPts;
    const plPts = points[String(player_uid)] || { points: 0 };
    plPts.points += amount;
    points[String(player_uid)] = plPts;
    saveDB("points", points);
    addTx(player_uid, "agent_add", amount, auth.uid, "代理上分");
    addTx(auth.uid, "agent_deduct", -amount, auth.uid, "代理上分支出");
    return json(res, { code: 20000, data: { player_uid, amount } });
  }

  // --- 代理信用分 ---
  if (p === "/api/agent/credit") {
    const cr = credits[myUid] || { credit: 0, frozen: 0 };
    return json(res, { code: 20000, data: cr });
  }

  // --- 代理返佣 ---
  if (p === "/api/agent/commission") {
    const cm = commissions[myUid] || { commission: 0, total: 0 };
    return json(res, { code: 20000, data: cm });
  }

  // --- 游戏结算 ---
  if (p === "/api/game/settle") {
    const { room_id, winner_profit, total_flow } = body;
    const room = rooms[room_id];
    if (!room) return json(res, { code: 40050, msg: "房间不存在" });

    const rake = Math.floor(winner_profit * CFG.RATES.rake / 100);
    const creditCost = Math.floor(total_flow * CFG.RATES.agentDeduct / 100);
    const agentComm = Math.floor(total_flow * CFG.RATES.agentComm / 100);
    const topAgentComm = Math.floor(total_flow * CFG.RATES.topAgentComm / 100);
    const platformNet = rake - agentComm - topAgentComm;

    room.total_flow += total_flow;
    room.total_rake += rake;
    saveDB("rooms", rooms);

    // 扣代理信用分
    const ownerCr = credits[String(room.owner_uid)];
    if (ownerCr) { ownerCr.credit = Math.max(0, ownerCr.credit - creditCost); credits[String(room.owner_uid)] = ownerCr; }

    // 代理返佣
    const ownerCm = commissions[String(room.owner_uid)] || { commission: 0, total: 0 };
    ownerCm.commission += agentComm;
    ownerCm.total += agentComm;
    commissions[String(room.owner_uid)] = ownerCm;

    saveDB("credits", credits);
    saveDB("commissions", commissions);

    return json(res, { code: 20000, data: { rake, creditCost, agentComm, topAgentComm, platformNet } });
  }

  // --- 房间结算 ---
  if (p === "/api/game/room_settle") {
    const { room_id } = body;
    const room = rooms[room_id];
    if (!room) return json(res, { code: 40051, msg: "房间不存在" });

    const totalRake = Math.floor(room.total_flow * CFG.RATES.rake / 100);
    const creditCost = Math.floor(room.total_flow * CFG.RATES.agentDeduct / 100);
    const agentComm = Math.floor(room.total_flow * CFG.RATES.agentComm / 100);
    const topAgentComm = Math.floor(room.total_flow * CFG.RATES.topAgentComm / 100);
    const platformNet = totalRake - agentComm - topAgentComm;

    room.status = "closed";
    room.ended_at = now();
    saveDB("rooms", rooms);

    const sid = "S" + Date.now();
    settlements[sid] = {
      room_id, game_type: room.game_type, owner_uid: room.owner_uid,
      total_flow: room.total_flow, total_rake: totalRake,
      credit_cost: creditCost, agent_commission: agentComm,
      top_agent_commission: topAgentComm, platform_net: platformNet,
      settled_at: now()
    };
    saveDB("settlements", settlements);

    return json(res, { code: 20000, data: settlements[sid] });
  }

  // --- 对账明细 ---
  if (p === "/api/settlements") {
    return json(res, { code: 20000, data: Object.values(settlements).reverse() });
  }

  // --- 系统配置 ---
  if (p === "/api/config") {
    if (req.method === "GET") return json(res, { code: 20000, data: CFG.RATES });
    return json(res, { code: 20000, msg: "配置暂不支持修改" });
  }

  // --- 管理员增加信用分 ---
  if (p === "/api/credit/add" && auth.type === "admin") {
    const { uid, amount } = body;
    const cr = credits[String(uid)] || { credit: 0, frozen: 0 };
    cr.credit += amount;
    credits[String(uid)] = cr;
    saveDB("credits", credits);
    return json(res, { code: 20000, data: { uid, credit: cr.credit } });
  }

  // 默认兜底
  json(res, { code: 20000, data: {} });
});

// ==================== 静态文件服务 ====================
function serveStatic(req, res, subPath) {
  const filePath = subPath === "/" || subPath === "" ? "/index.html" : subPath;
  const fullPath = path.join(CFG.ADMIN_DIR, filePath);

  // 安全检查
  if (!fullPath.startsWith(CFG.ADMIN_DIR)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  const mime = {
    ".html": "text/html", ".css": "text/css", ".js": "application/javascript",
    ".ico": "image/x-icon", ".png": "image/png", ".jpg": "image/jpeg",
    ".svg": "image/svg+xml", ".json": "application/json"
  };
  const ext = path.extname(fullPath);

  try {
    const content = fs.readFileSync(fullPath);
    res.writeHead(200, { "Content-Type": mime[ext] || "application/octet-stream" });
    res.end(content);
  } catch {
    // SPA fallback
    try {
      const index = fs.readFileSync(path.join(CFG.ADMIN_DIR, "index.html"));
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(index);
    } catch {
      res.writeHead(404);
      res.end("Not Found");
    }
  }
}

// ==================== 交易记录 ====================
function addTx(uid, type, amount, operator, tag) {
  const key = String(uid);
  const pt = points[key] || { points: 0 };
  const txId = Date.now() + "_" + Math.random().toString(36).slice(2, 6);
  txs[txId] = {
    uid: parseInt(uid), type, amount, balance_after: pt.points,
    operator_uid: operator, display_tag: tag, created_at: now()
  };
  saveDB("transactions", txs);
}

// ==================== 启动 ====================
server.listen(CFG.PORT, () => {
  console.log(`
╔══════════════════════════════════════════════╗
║     728棋牌平台 - 信用分代理制 v1.0          ║
╠══════════════════════════════════════════════╣
║  HTTP API:  http://localhost:${CFG.PORT}             ║
║  后台管理:  http://localhost:${CFG.PORT}/admin        ║
║  管理员:    admin / 123456                   ║
║  零依赖，纯 Node.js 内置模块                 ║
╚══════════════════════════════════════════════╝
`);
});
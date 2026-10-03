// 728棋牌平台 - 主服务入口
const express = require("express");
const http = require("http");
const { Server: SocketIOServer } = require("socket.io");
const config = require("./src/config");
const db = require("./src/db/init");

// ==================== Express HTTP ====================
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Token");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// ==================== API 路由 ====================
app.use("/api", require("./src/api/auth"));
app.use("/api", require("./src/api/admin"));
app.use("/api", require("./src/api/room"));
app.use("/api", require("./src/api/agent"));
app.use("/api", require("./src/api/game"));

// 兼容原版后台管理API路径
app.use("/terrace", require("./src/api/admin"));
app.use("/vue-admin-template", require("./src/api/admin"));

// 静态文件 - 后台管理系统
app.use("/admin", express.static("../728_admin_deploy"));

// 健康检查
app.get("/health", (req, res) => res.json({ status: "ok", time: new Date().toISOString() }));

// ==================== HTTP Server ====================
const httpServer = http.createServer(app);

// ==================== WebSocket ====================
const io = new SocketIOServer(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] },
  pingInterval: 5000,
  pingTimeout: 15000,
});

const wsHandler = require("./src/ws/handler");
io.on("connection", (socket) => wsHandler(io, socket, db));

// ==================== 启动 ====================
httpServer.listen(config.HTTP_PORT, () => {
  console.log(`
╔══════════════════════════════════════════════╗
║       728棋牌平台 - 信用分代理制              ║
╠══════════════════════════════════════════════╣
║  HTTP API:  http://localhost:${config.HTTP_PORT}           ║
║  WebSocket: ws://localhost:${config.HTTP_PORT}            ║
║  后台管理:  http://localhost:${config.HTTP_PORT}/admin      ║
║  管理员:   admin / 123456                     ║
╚══════════════════════════════════════════════╝
`);
});

// 优雅关闭
process.on("SIGINT", () => {
  console.log("\n[Server] 关闭中...");
  io.close();
  httpServer.close();
  db.close();
  process.exit(0);
});
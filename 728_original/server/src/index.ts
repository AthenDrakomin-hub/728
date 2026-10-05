import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { formDataParser } from "./middleware/formDataParser.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { createLegacyWSS, roomManager, wss } from "./socket/legacyWs.js";
import { getSupportedGames, destroyAllGames } from "./games/index.js";
import { logger } from "./lib/logger.js";
import { getAllGameConfigs, getGlobalConfig, reloadConfig } from "./lib/gameConfig.js";
import { getAuditLogs, getAuditStats } from "./lib/security.js";
import "./db/seed.js";

const app = express();
const PORT = Number(process.env.PORT || 8000);
const WS_PORT = Number(process.env.WS_PORT || 10000);
const ADMIN_PORT = Number(process.env.ADMIN_PORT || 9999);

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(formDataParser);

// 后台管理前端静态文件 (访问 /admin/)
import path from "path";
import fs from "fs";
const adminStaticPath = path.resolve(process.cwd(), "admin");
app.use("/admin", (req, res, next) => {
  // 去掉 /admin 前缀，得到相对路径
  const relPath = req.path.replace(/^\/+/, "");
  const filePath = path.join(adminStaticPath, relPath);
  // 如果文件存在且不是目录，直接返回
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    return res.sendFile(filePath);
  }
  // 否则返回index.html (SPA回退)
  if (fs.existsSync(path.join(adminStaticPath, "index.html"))) {
    return res.sendFile(path.join(adminStaticPath, "index.html"));
  }
  next();
});

// 健康检查
app.get("/health", (_req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

// 房间列表
app.get("/api/rooms", (req, res) => {
  const page = Number(req.query.page) || 1;
  const pageSize = Number(req.query.pageSize) || 20;
  const gameType = req.query.gameType as string | undefined;
  res.json({ code: 20000, data: roomManager.listRooms(page, pageSize, gameType) });
});

// 游戏列表
app.get("/api/games", (_req, res) => {
  res.json({ code: 20000, data: { games: getSupportedGames() } });
});

// 游戏配置 (外部化)
app.get("/api/games/config", (_req, res) => {
  res.json({ code: 20000, data: { games: getAllGameConfigs(), global: getGlobalConfig() } });
});

// 热重载配置
app.post("/api/games/reload", (_req, res) => {
  const ok = reloadConfig();
  res.json({ code: ok ? 20000 : 50000, data: { reloaded: ok } });
});

// 服务器统计
app.get("/api/stats", (_req, res) => {
  const rooms = roomManager.listRooms(1, 100);
  res.json({
    code: 20000,
    data: {
      totalRooms: rooms.total,
      activeRooms: rooms.list.filter((r: any) => r.status > 0).length,
      supportedGames: getSupportedGames().length,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    },
  });
});

// 审计日志查询接口
app.get("/api/audit", (req, res) => {
  const type = req.query.type as string | undefined;
  const userId = req.query.userId ? Number(req.query.userId) : undefined;
  const limit = Math.min(Number(req.query.limit || 100), 500);
  const logs = getAuditLogs(type, userId, limit);
  res.json({ code: 20000, data: { logs, stats: getAuditStats() } });
});

// 原协议 HTTP 路由
app.use(authRoutes);
app.use("/terrace", adminRoutes);

// 全局错误处理中间件
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error("Unhandled error:", err.message);
  res.status(500).json({ code: 50000, message: "Internal Server Error" });
});

// 404
app.use((_req, res) => {
  res.status(404).json({ code: 40400, message: "Not Found" });
});

const httpServer = app.listen(PORT, "0.0.0.0", () => {
  logger.info(`HTTP API server listening on http://0.0.0.0:${PORT}`);
});

// WebSocket 大厅服务
createLegacyWSS(WS_PORT);

logger.info(`Admin panel should be served separately on port ${ADMIN_PORT}`);

// 优雅关闭
let shuttingDown = false;
async function gracefulShutdown(signal: string) {
  if (shuttingDown) return;
  shuttingDown = true;
  logger.info(`Received ${signal}, shutting down gracefully...`);

  // 关闭WS连接
  if (wss) {
    wss.close(() => logger.info("WebSocket server closed"));
  }

  // 销毁所有游戏实例
  destroyAllGames();

  // 关闭HTTP服务
  httpServer.close(() => {
    logger.info("HTTP server closed");
    process.exit(0);
  });

  // 强制退出超时
  setTimeout(() => {
    logger.warn("Forced shutdown after 10s timeout");
    process.exit(1);
  }, 10000);
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("uncaughtException", (err) => {
  logger.error("Uncaught exception:", err.message);
});
process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled rejection:", String(reason));
});

import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server as SocketIOServer } from "socket.io";
import authRoutes from "./routes/auth.routes";
import adminRoutes from "./routes/admin.routes";
import agentRoutes from "./routes/agent.routes";
import profileRoutes from "./routes/profile.routes";
import roomsRoutes, { startTimeoutChecker } from "./routes/rooms.routes";
import assetsRoutes from "./routes/assets.routes";
import miscRoutes from "./routes/misc.routes";
import { appRouter } from "./routes/app.routes";
import { setupRoomSockets } from "./socket/roomSocket";

const app = express();
const server = http.createServer(app);
const PORT = parseInt(process.env.PORT || "3001", 10);

// Socket.io
const io = new SocketIOServer(server, {
  cors: {
    origin: (origin, callback) => {
      if (!allowedOrigins) return callback(null, true);
      if (allowedOrigins.includes(origin || "")) return callback(null, true);
      if (!origin || origin === "null" || origin.startsWith("file://")) return callback(null, true);
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  },
  path: "/socket.io",
  pingInterval: 25000,      // 每25秒发送ping包
  pingTimeout: 60000,       // 60秒无响应则断开
  maxHttpBufferSize: 1e6,   // 1MB消息大小限制
});

// CORS：允许前端跨域访问，支持凭证（Cookie）
// 同时允许APP环境(file://协议，origin为null)的请求
const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",") : null;
app.use(
  cors({
    origin: (origin, callback) => {
      // 允许所有来源（未配置CORS_ORIGIN时）
      if (!allowedOrigins) return callback(null, true);
      // 允许配置的来源
      if (allowedOrigins.includes(origin || "")) return callback(null, true);
      // 允许APP环境（file://协议，origin为null或undefined）
      if (!origin || origin === "null" || origin.startsWith("file://")) return callback(null, true);
      // 其他来源拒绝
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// 禁用API缓存，避免旧数据残留
app.use("/api", (req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

// 健康检查（不需要认证）
app.use("/api", miscRoutes);
app.use("/api/app", appRouter);

// 认证相关
app.use("/api/auth", authRoutes);

// 管理后台
app.use("/api/admin", adminRoutes);

// 代理
app.use("/api/agent", agentRoutes);

// 个人资料
app.use("/api/profile", profileRoutes);

// 房间
app.use("/api/rooms", roomsRoutes);

// 素材
app.use("/api/assets", assetsRoutes);

// 404
app.use("/api", (_req, res) => {
  res.status(404).json({ error: "API 不存在" });
});

// 设置房间WebSocket
setupRoomSockets(io);

// 全局错误兜底：防止未捕获异常导致进程崩溃（PM2频繁重启）
process.on("uncaughtException", (err) => {
  console.error("[FATAL] uncaughtException:", err.message, err.stack);
});
process.on("unhandledRejection", (reason) => {
  console.error("[FATAL] unhandledRejection:", reason);
});

server.listen(PORT, () => {
  console.log(`[V-POKER API] 服务已启动: http://localhost:${PORT}`);
  console.log(`[V-POKER API] 数据库: ${process.env.DATABASE_URL ? "已配置" : "未配置 DATABASE_URL"}`);
  console.log(`[V-POKER API] WebSocket: 已启用`);
  startTimeoutChecker();
});

export { io };

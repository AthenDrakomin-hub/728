import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { formDataParser } from "./middleware/formDataParser.js";
import authRoutes from "./routes/auth.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import { createLegacyWSS } from "./socket/legacyWs.js";
import "./db/seed.js";

const app = express();
const PORT = Number(process.env.PORT || 8000);
const WS_PORT = Number(process.env.WS_PORT || 10000);
const ADMIN_PORT = Number(process.env.ADMIN_PORT || 9999);

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(formDataParser);

// 健康检查
app.get("/health", (_req, res) => {
  res.json({ ok: true, ts: Date.now() });
});

// 原协议 HTTP 路由
app.use(authRoutes);
app.use("/terrace", adminRoutes);

// 404
app.use((_req, res) => {
  res.status(404).json({ code: 40400, message: "Not Found" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`HTTP API server listening on http://0.0.0.0:${PORT}`);
});

// WebSocket 大厅服务
createLegacyWSS(WS_PORT);

console.log(`Admin panel should be served separately on port ${ADMIN_PORT}`);

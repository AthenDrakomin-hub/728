import { io, Socket } from "socket.io-client";
import { getToken } from "./api";

// 单例socket
let socket: Socket | null = null;
let connected = false;

// 获取API基础URL
function getApiUrl(): string {
  if (typeof window === "undefined") return "";
  // 优先使用环境变量，否则用当前域名
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl) {
    // 去掉末尾的 /api
    return envUrl.replace(/\/api\/?$/, "");
  }
  // 当前域名
  return window.location.origin;
}

/**
 * 获取或创建socket连接
 * 使用动态auth回调，每次连接/重连都重新获取最新token
 */
export function getSocket(): Socket {
  if (socket) return socket;

  socket = io(getApiUrl(), {
    path: "/socket.io",
    auth: (cb) => {
      const token = getToken();
      cb({ token });
    },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,          // 20秒超时
  });

  socket.on("connect", () => {
    connected = true;
    console.log("[WS] 已连接, id:", socket?.id);
  });

  socket.on("disconnect", (reason) => {
    connected = false;
    console.log("[WS] 已断开:", reason);
  });

  socket.on("connect_error", (err) => {
    console.warn("[WS] 连接错误:", err.message);
  });

  return socket;
}

/**
 * 是否连接成功
 */
export function isSocketConnected(): boolean {
  return connected;
}

/**
 * 加入房间
 */
export function joinRoom(roomId: number) {
  const s = getSocket();
  // 每次加入房间时刷新token，避免单例socket使用旧token
  const token = getToken();
  if (token) {
    s.auth = { token };
  }
  s.emit("join_room", { roomId });
}

/**
 * 离开房间
 */
export function leaveRoom(roomId: number) {
  const s = getSocket();
  s.emit("leave_room", { roomId });
}

/**
 * 监听房间状态变更
 * 返回取消监听函数
 */
export function onRoomStateChanged(
  roomId: number,
  callback: (data: { roomId: number; ts: number }) => void
): () => void {
  const s = getSocket();
  const handler = (data: { roomId: number; ts: number }) => {
    if (data.roomId === roomId) {
      callback(data);
    }
  };
  s.on("state_changed", handler);
  return () => {
    s.off("state_changed", handler);
  };
}

import { Server, Socket } from "socket.io";
import { verifyToken } from "../lib/auth";

// 全局io实例，供其他模块调用广播
let ioInstance: Server | null = null;

/**
 * 设置房间WebSocket
 * 事件：
 *   join_room { roomId }  -> 加入房间
 *   leave_room { roomId } -> 离开房间
 * 服务端推送：
 *   room_update { room }  -> 房间状态更新
 *   hand_update { hand }  -> 牌局状态更新
 *   chat_message { msg }  -> 聊天消息
 */
export function setupRoomSockets(io: Server) {
  ioInstance = io;

  io.on("connection", (socket: Socket) => {
    // 从握手认证中获取用户
    const token =
      (socket.handshake.auth?.token as string) ||
      (socket.handshake.headers?.cookie?.match(/token=([^;]+)/)?.[1] || "");

    let userId: number | null = null;
    try {
      if (token) {
        const payload = verifyToken(token);
        if (payload) userId = payload.id;
      }
    } catch {
      // 未认证连接，允许连接但只能接收广播
    }

    socket.data.userId = userId;

    // 加入房间
    socket.on("join_room", ({ roomId }: { roomId: number }) => {
      socket.join(`room:${roomId}`);
      console.log(`[WS] 用户${userId} 加入房间 ${roomId}`);
    });

    // 离开房间
    socket.on("leave_room", ({ roomId }: { roomId: number }) => {
      socket.leave(`room:${roomId}`);
      console.log(`[WS] 用户${userId} 离开房间 ${roomId}`);
    });

    socket.on("disconnect", () => {
      console.log(`[WS] 用户${userId} 断开连接`);
    });
  });
}

/**
 * 广播房间状态更新给房间内所有玩家
 */
export function broadcastRoomUpdate(roomId: number, room: any) {
  if (!ioInstance) return;
  ioInstance.to(`room:${roomId}`).emit("room_update", room);
}

/**
 * 广播牌局状态更新
 */
export function broadcastHandUpdate(roomId: number, hand: any) {
  if (!ioInstance) return;
  ioInstance.to(`room:${roomId}`).emit("hand_update", hand);
}

/**
 * 广播聊天消息
 */
export function broadcastChatMessage(roomId: number, message: any) {
  if (!ioInstance) return;
  ioInstance.to(`room:${roomId}`).emit("chat_message", message);
}

/**
 * 广播状态变更信号（前端收到后自动重新load获取自己视角的完整状态）
 * 这是最简单可靠的方式，避免不同玩家视角的牌可见性问题
 */
export function broadcastStateChanged(roomId: number) {
  if (!ioInstance) return;
  ioInstance.to(`room:${roomId}`).emit("state_changed", { roomId, ts: Date.now() });
}

import { WebSocketServer, WebSocket } from "ws";
import { users, onlineSessions } from "../db/schema.js";
import { verifyToken } from "../lib/auth.js";
import { RoomManager } from "../lib/roomManager.js";

interface WsClient {
  ws: WebSocket;
  userId?: number;
  account?: string;
  token?: string;
  lastHeartbeat: number;
}

const clients = new Map<WebSocket, WsClient>();
const roomManager = new RoomManager();

export function createLegacyWSS(port: number) {
  const wss = new WebSocketServer({ port });

  wss.on("connection", (ws) => {
    const client: WsClient = { ws, lastHeartbeat: Date.now() };
    clients.set(ws, client);

    ws.on("message", async (raw) => {
      try {
        const decoded = JSON.parse(Buffer.from(raw.toString(), "base64").toString());
        const { event, data = {}, uid = 0 } = decoded;
        await handleMessage(ws, client, event, data, uid);
      } catch (err) {
        console.error("WS decode error:", err);
        sendRaw(ws, "Msg_Hall_ERROR", { message: "消息格式错误" });
      }
    });

    ws.on("close", () => {
      clients.delete(ws);
      if (client.userId) {
        roomManager.userOffline(client.userId);
      }
    });

    ws.on("error", (err) => {
      console.error("WS error:", err);
      clients.delete(ws);
    });
  });

  // 心跳检测
  setInterval(() => {
    const now = Date.now();
    for (const [ws, client] of clients.entries()) {
      if (now - client.lastHeartbeat > 30000) {
        ws.terminate();
        clients.delete(ws);
      }
    }
  }, 10000);

  console.log(`Legacy WebSocket server listening on ws://0.0.0.0:${port}`);
  return wss;
}

async function handleMessage(
  ws: WebSocket,
  client: WsClient,
  event: string,
  data: any,
  uid: number
) {
  // 基础验证，除 Connect 外都需要 token
  if (event !== "Msg_Hall_Connect") {
    if (!client.token || !client.userId) {
      return sendRaw(ws, "Msg_Hall_ERROR", { message: "未连接大厅" });
    }
  }

  switch (event) {
    case "Msg_Hall_Connect": {
      const token = String(data?.token || "");
      const payload = verifyToken(token);
      if (!payload) {
        return sendRaw(ws, "Msg_Hall_ERROR", { message: "token 无效" });
      }

      const userRows = users.select().where((u) => u.id === payload.userId).limit(1);
      if (!userRows.length) {
        return sendRaw(ws, "Msg_Hall_ERROR", { message: "用户不存在" });
      }

      const user = userRows[0];
      client.userId = user.id;
      client.account = user.account;
      client.token = token;
      client.lastHeartbeat = Date.now();

      const nowTs = Math.floor(Date.now() / 1000);
      const existingSession = onlineSessions.select().where((s) => s.userId === user.id).limit(1);
      if (existingSession.length) {
        onlineSessions.update({ token, deviceId: user.deviceId || "", lastHeartbeat: nowTs })
          .where((s) => s.userId === user.id);
      } else {
        onlineSessions.insert({
          userId: user.id,
          token,
          deviceId: user.deviceId || "",
          lastHeartbeat: nowTs,
          createdAt: nowTs,
        });
      }

      sendRaw(ws, "Msg_Hall_Connect", {
        status: 1,
        uid: user.id,
        account: user.account,
        nickname: user.nickname || user.account,
        gold: user.gold,
        bank: user.bankGold,
        rcard: user.rcard,
        agentPower: user.agentPower,
        power: user.power,
        headimgurl: user.avatar,
        pictureframe: user.headFrame,
        invite_code: user.inviteCode,
        user_status: user.status,
      });
      break;
    }

    case "Msg_Hall_Heart": {
      client.lastHeartbeat = Date.now();
      const nowTs = Math.floor(Date.now() / 1000);
      if (client.userId) {
        onlineSessions.update({ lastHeartbeat: nowTs })
          .where((s) => s.userId === client.userId);
      }
      sendRaw(ws, "Msg_Hall_Heart", { time: Date.now() });
      break;
    }

    case "Msg_Hall_EnterRoom": {
      if (!client.userId) break;
      const result = await roomManager.enterRoom(client.userId, data);
      sendRaw(ws, "Msg_Hall_EnterRoom", result);
      break;
    }

    case "Msg_Hall_LeaveRoom": {
      if (!client.userId) break;
      const result = await roomManager.leaveRoom(client.userId, data);
      sendRaw(ws, "Msg_Hall_LeaveRoom", result);
      break;
    }

    case "Msg_Hall_CreateRoom": {
      if (!client.userId) break;
      const result = await roomManager.createRoom(client.userId, data);
      sendRaw(ws, "Msg_Hall_CreateRoom", result);
      break;
    }

    case "Msg_Hall_QueryAgentList": {
      // 返回代理列表（占位）
      sendRaw(ws, "Msg_Hall_QueryAgentList", { list: [] });
      break;
    }

    case "Msg_Hall_GetBenefits": {
      if (!client.userId) break;
      // 救济金逻辑占位
      sendRaw(ws, "Msg_Hall_GetBenefits", { status: 1, gold: 5000 });
      break;
    }

    default:
      console.log(`Unhandled WS event: ${event}`, data);
      sendRaw(ws, "Msg_Hall_ERROR", { message: `未实现: ${event}` });
  }
}

export function sendRaw(ws: WebSocket, event: string, data: any, uid = 0) {
  if (ws.readyState !== WebSocket.OPEN) return;
  const msg = JSON.stringify({ event, area: 0, uid, data });
  ws.send(Buffer.from(msg).toString("base64"));
}

export function broadcastToUser(userId: number, event: string, data: any) {
  for (const client of clients.values()) {
    if (client.userId === userId && client.ws.readyState === WebSocket.OPEN) {
      sendRaw(client.ws, event, data, userId);
    }
  }
}

export { roomManager };

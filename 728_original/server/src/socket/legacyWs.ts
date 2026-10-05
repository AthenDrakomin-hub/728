import { WebSocketServer, WebSocket } from "ws";
import { users, onlineSessions } from "../db/schema.js";
import { verifyToken } from "../lib/auth.js";
import { RoomManager } from "../lib/roomManager.js";
import { createGame, getGame, setGame, getSupportedGames } from "../games/index.js";
import { cardName } from "../games/mahjong/huAlgorithm.js";
import { wsLimiter, betLimiter, writeAuditLog } from "../lib/security.js";
import { mapGameId, mapGameCode } from "../lib/gameIdMap.js";

interface WsClient {
  ws: WebSocket;
  userId?: number;
  account?: string;
  token?: string;
  lastHeartbeat: number;
}

const clients = new Map<WebSocket, WsClient>();
const roomManager = new RoomManager();
let wss: WebSocketServer | null = null;

export function createLegacyWSS(port: number) {
  wss = new WebSocketServer({ port });

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
  // WS消息频率限制
  const rateKey = client.userId ? `ws:${client.userId}` : `ws:${ws.url}`;
  if (!wsLimiter.tryAcquire(rateKey)) {
    return sendRaw(ws, "Msg_Hall_ERROR", { message: "操作过于频繁，请稍后再试" });
  }

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
        rid: 0,
        gamestatus: {},
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
      // 客户端格式: {tableid, gtype, level}，tableid=0表示快速匹配
      const gtype = Number(data?.gtype ?? 0);
      const tableid = Number(data?.tableid ?? 0);
      const gameCode = mapGameId(gtype);
      if (!gameCode) {
        sendRaw(ws, "Msg_Hall_EnterRoom", { status: 0, msg: `不支持的游戏ID: ${gtype}` });
        break;
      }
      // tableid>0时用tableid作为roomId，否则自动生成
      const roomId = tableid > 0 ? tableid : (gtype * 1e7 + 1);
      let game = getGame(roomId);
      if (!game) {
        game = createGame(gameCode, roomId);
        if (!game) {
          sendRaw(ws, "Msg_Hall_EnterRoom", { status: 0, msg: `不支持的游戏: ${gameCode}` });
          break;
        }
        setGame(roomId, game);
      }
      game.addPlayer(client.userId, 0);
      sendRaw(ws, "Msg_Hall_EnterRoom", { status: 1, rid: roomId, game: gameCode, gtype });
      // 推送游戏状态
      const state = game.getState ? game.getState() : {};
      sendRaw(ws, `Msg_${gameCode}_RoomInfo`, { status: 1, rid: roomId, ...state });
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

    case "Msg_Hall_Match": {
      if (!client.userId) break;
      const result = await roomManager.matchRoom(
        client.userId,
        String(data?.gameType || data?.game_type || ""),
        Number(data?.level || 1)
      );
      sendRaw(ws, "Msg_Hall_Match", result);
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

    case "Msg_Hall_FinishLoad": {
      // 客户端进房后资源加载完成，通知服务端
      sendRaw(ws, "Msg_Hall_FinishLoad", { status: 1, rid: data?.rid || 0 });
      break;
    }

    case "Msg_Hall_EnterGame": {
      // 进入游戏：客户端期望 e.data 为桌子列表(tableList)，然后loadGame加载资源
      const gtype = Number(data?.gtype ?? data?.gameId ?? 0);
      const gameCode = mapGameId(gtype);
      if (!gameCode) {
        sendRaw(ws, "Msg_Hall_ERROR", { message: `不支持的游戏ID: ${gtype}` });
        break;
      }
      const roomId = Number(data?.roomId || data?.rid || gtype * 1e7 + 1);
      let game = getGame(roomId);
      if (!game) {
        game = createGame(gameCode, roomId);
        if (!game) {
          sendRaw(ws, "Msg_Hall_ERROR", { message: `不支持的游戏: ${gameCode}` });
          break;
        }
        setGame(roomId, game);
      }
      game.addPlayer(client.userId, data?.seat ?? 0);
      // 返回桌子列表数组（客户端期望 e.status==1 且 e.data=tableList数组）
      // 数组附加status属性，sendRaw会提取到顶层
      const tableList: any = [
        { tableid: roomId, rid: roomId, game: gameCode, gtype, level: data?.level || 1, playerCount: 1, maxPlayers: 5, status: 1 }
      ];
      tableList.status = 1;
      sendRaw(ws, "Msg_Hall_EnterGame", tableList);
      // 同时推送游戏状态
      const state = game.getState ? game.getState() : {};
      sendRaw(ws, `Msg_${gameCode}_RoomInfo`, { status: 1, rid: roomId, ...state });
      break;
    }

    case "Msg_Hall_GetGameList": {
      // 返回游戏列表（客户端也有本地配置，这里返回服务端已支持的21款）
      const games = getSupportedGames().map((code) => {
        const gtype = mapGameCode(code);
        return { code, gtype, name: code, status: 1, online: Math.floor(Math.random() * 50) + 5 };
      });
      sendRaw(ws, "Msg_Hall_GetGameList", { status: 1, list: games });
      break;
    }

    default:
      // 客户端通用游戏协议: Msg_Game_{Action} + gtype(数字ID)
      // 适配为服务端格式: Msg_{GAME}_{Action}
      if (event.startsWith("Msg_Game_")) {
        const gtype = Number(data?.gtype ?? data?.gameId ?? 0);
        const gameCode = mapGameId(gtype);
        if (!gameCode) {
          console.log(`[GameAdapter] 未映射的游戏ID: ${gtype}, event: ${event}`);
          sendRaw(ws, "Msg_Hall_ERROR", { message: `不支持的游戏ID: ${gtype}` });
          break;
        }
        const action = event.slice("Msg_Game_".length);
        const adaptedEvent = `Msg_${gameCode}_${action}`;
        console.log(`[GameAdapter] ${event}(gtype=${gtype}) -> ${adaptedEvent}`);
        // 确保data中包含roomId (客户端可能用room_id或其他字段)
        const adaptedData = { ...data };
        if (!adaptedData.roomId && adaptedData.room_id) adaptedData.roomId = adaptedData.room_id;
        await handleGameMessage(ws, client, adaptedEvent, adaptedData);
        break;
      }

      // 游戏消息分发: Msg_{GAME}_{Action} 格式
      if (event.startsWith("Msg_") && !event.startsWith("Msg_Hall_")) {
        await handleGameMessage(ws, client, event, data);
      } else {
        console.log(`Unhandled WS event: ${event}`, data);
        sendRaw(ws, "Msg_Hall_ERROR", { message: `未实现: ${event}` });
      }
  }
}

/**
 * 游戏消息分发 — 解析 Msg_{GAME}_{Action}, 路由到对应游戏实例
 */
async function handleGameMessage(
  ws: WebSocket,
  client: WsClient,
  event: string,
  data: any
) {
  if (!client.userId) {
    return sendRaw(ws, "Msg_Hall_ERROR", { message: "未登录" });
  }

  // 解析: Msg_WZMJ_DrawCard -> gameType=WZMJ, action=DrawCard
  const parts = event.split("_");
  if (parts.length < 3) {
    return sendRaw(ws, "Msg_Hall_ERROR", { message: "消息格式错误" });
  }
  const gameType = parts[1];
  const action = parts.slice(2).join("_");
  const roomId = Number(data?.roomId || data?.room_id || 0);

  if (!roomId) {
    return sendRaw(ws, "Msg_Hall_ERROR", { message: "缺少roomId" });
  }

  // 获取或创建游戏实例
  let game = getGame(roomId);
  if (!game) {
    game = createGame(gameType, roomId);
    if (!game) {
      return sendRaw(ws, "Msg_Hall_ERROR", { message: `不支持的游戏: ${gameType}, 已支持: ${getSupportedGames().join(",")}` });
    }
    setGame(roomId, game);
  }

  // 路由到具体动作
  try {
    switch (action) {
      case "Start":
      case "StartGame": {
        game.addPlayer(client.userId, data.seat ?? 0);
        const ok = game.start();
        sendRaw(ws, event, { ok, state: game.getState() });
        break;
      }
      case "Draw":
      case "DrawCard": {
        const card = game.drawCard(data.seat);
        sendRaw(ws, event, { card, cardName: card !== null ? cardName(card) : null, state: game.getState() });
        break;
      }
      case "Discard":
      case "PlayCard": {
        const ok = game.discardCard(data.seat, data.card);
        sendRaw(ws, event, { ok, state: game.getState() });
        break;
      }
      case "Peng": {
        const ok = game.peng(data.seat);
        sendRaw(ws, event, { ok, state: game.getState() });
        break;
      }
      case "Gang": {
        const ok = game.gang(data.seat, data.isAnGang ?? false);
        sendRaw(ws, event, { ok, state: game.getState() });
        break;
      }
      case "Hu": {
        const ok = game.hu(data.seat);
        sendRaw(ws, event, { ok, state: game.getState() });
        break;
      }
      case "Pass": {
        game.pass(data.seat);
        sendRaw(ws, event, { ok: true, state: game.getState() });
        break;
      }
      case "GetState":
      case "Query": {
        // idle状态自动开始（龙虎斗等无自动start的游戏）
        if ((game as any).stage === 'idle' && (game as any).start) {
          (game as any).start();
        }
        const state0 = game.getState();
        // 补充当前玩家的gold和myBets
        const user0 = users.findById(client.userId);
        if (user0) (state0 as any).gold = user0.gold;
        const myBets0 = (game as any).getPlayerBets?.(client.userId) || (game as any).getUserBets?.(client.userId);
        if (myBets0) (state0 as any).myBets = myBets0;
        sendRaw(ws, event, { state: state0 });
        break;
      }
      case "GetTing": {
        const ting = (game as any).getTing?.(data.seat) ?? [];
        sendRaw(ws, event, { tingCards: ting, tingNames: ting.map(cardName) });
        break;
      }
      // === 通用下注 (牛牛2参数/电玩3参数, 游戏类自行适配) ===
      case "Bet":
      case "ActBet": {
        // 下注频率限制
        if (!betLimiter.tryAcquire(`bet:${client.userId}`)) {
          return sendRaw(ws, "Msg_Hall_ERROR", { message: "下注过于频繁，请稍后再试" });
        }
        const betResult = (game as any).bet?.(client.userId, data.region, data.amount) ?? false;
        const ok = typeof betResult === 'object' ? betResult.ok : betResult;
        if (ok) {
          writeAuditLog("bet", client.userId, { game: gameType, roomId, region: data.region, amount: data.amount });
        }
        const state1 = game.getState();
        const user1 = users.findById(client.userId);
        if (user1) (state1 as any).gold = user1.gold;
        const myBets1 = (game as any).getPlayerBets?.(client.userId) || (game as any).getUserBets?.(client.userId);
        if (myBets1) (state1 as any).myBets = myBets1;
        sendRaw(ws, event, { ok, state: state1 });
        break;
      }
      case "Deal": {
        const ok = (game as any).deal?.() ?? false;
        sendRaw(ws, event, { ok, state: game.getState() });
        break;
      }
      case "QiangZhuang":
      case "Qiang": {
        const ok = (game as any).qiangZhuang?.(client.userId, data.multi ?? 1) ?? false;
        sendRaw(ws, event, { ok, state: game.getState() });
        break;
      }
      // === 炸金花类动作 ===
      case "Call": {
        const ok = (game as any).call?.(client.userId) ?? false;
        sendRaw(ws, event, { ok, state: game.getState() });
        break;
      }
      case "Raise": {
        const ok = (game as any).raise?.(client.userId, data.amount) ?? false;
        sendRaw(ws, event, { ok, state: game.getState() });
        break;
      }
      case "SeeCards":
      case "See": {
        const ok = (game as any).seeCards?.(client.userId) ?? false;
        sendRaw(ws, event, { ok, state: game.getState() });
        break;
      }
      case "Compare": {
        const ok = (game as any).compare?.(client.userId, data.targetSeat) ?? false;
        sendRaw(ws, event, { ok, state: game.getState() });
        break;
      }
      case "Fold": {
        const ok = (game as any).fold?.(client.userId) ?? false;
        sendRaw(ws, event, { ok, state: game.getState() });
        break;
      }
      // === 电玩类动作 ===
      case "ApplyBanker":
      case "ToBanker": {
        const ok = (game as any).applyBanker?.(client.userId) ?? false;
        sendRaw(ws, event, { ok, state: game.getState() });
        break;
      }
      case "LeaveBanker": {
        const ok = (game as any).leaveBanker?.(client.userId) ?? false;
        sendRaw(ws, event, { ok, state: game.getState() });
        break;
      }
      default:
        sendRaw(ws, "Msg_Hall_ERROR", { message: `未实现的游戏动作: ${action}` });
    }
  } catch (err) {
    console.error(`Game ${gameType} ${action} error:`, err);
    sendRaw(ws, "Msg_Hall_ERROR", { message: "游戏内部错误" });
  }
}

export function sendRaw(ws: WebSocket, event: string, data: any, uid = 0) {
  if (ws.readyState !== WebSocket.OPEN) return;
  // 客户端协议要求 status/msg 在顶层（与728原始服务端对齐）
  const payload: any = { event, area: 0, uid };
  if (data && typeof data === "object") {
    if ("status" in data) payload.status = data.status;
    if ("msg" in data) payload.msg = data.msg;
    if ("message" in data) payload.msg = data.message;
  }
  payload.data = data;
  ws.send(Buffer.from(JSON.stringify(payload)).toString("base64"));
}

export function broadcastToUser(userId: number, event: string, data: any) {
  for (const client of clients.values()) {
    if (client.userId === userId && client.ws.readyState === WebSocket.OPEN) {
      sendRaw(client.ws, event, data, userId);
    }
  }
}

export { roomManager, wss };

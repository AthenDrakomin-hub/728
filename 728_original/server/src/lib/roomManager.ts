import { users, rooms, roomPlayers, gameRounds } from "../db/schema.js";
import { generateRoomNo } from "./utils.js";

export class RoomManager {
  // 内存中的房间状态缓存
  private roomStates = new Map<number, any>();

  async createRoom(userId: number, data: any) {
    const userRows = users.select().where((u) => u.id === userId).limit(1);
    if (!userRows.length) return { status: 0, message: "用户不存在" };
    const user = userRows[0];

    // 仅代理/总代理/管理员可开房
    if (user.role !== "agent" && user.role !== "top_agent" && user.role !== "admin") {
      return { status: 0, message: "无开房权限" };
    }

    const gameType = String(data.game_type || data.gameType || "ZJH").toUpperCase();
    const level = Number(data.level || 1);
    const totalRounds = Number(data.total_rounds || data.totalRounds || 25);
    const maxSeats = Number(data.max_seats || data.maxSeats || 5);
    const password = String(data.password || "");

    let roomNo = generateRoomNo();
    while (true) {
      const exists = rooms.select().where((r) => r.roomNo === roomNo).limit(1);
      if (!exists.length) break;
      roomNo = generateRoomNo();
    }

    const nowTs = Math.floor(Date.now() / 1000);
    const room = rooms.insert({
      roomNo,
      password,
      gameType,
      level,
      status: 0,
      totalRounds,
      maxSeats,
      agentId: userId,
      clubId: null,
      currentRound: 0,
      initialGold: 0,
      totalFlow: 0,
      totalRake: 0,
      rule: data.rule || {},
      createdAt: nowTs,
      startedAt: null,
      endedAt: null,
    });

    // 房主默认加入 0 号位
    roomPlayers.insert({
      roomId: room.id,
      userId,
      seat: 0,
      gold: user.gold,
      ready: false,
      isSpectator: false,
      joinedAt: nowTs,
    });

    return {
      status: 1,
      room: this.formatRoom(room),
    };
  }

  async enterRoom(userId: number, data: any) {
    const roomNo = String(data.room_no || data.roomNo || "");
    const password = String(data.password || "");

    if (!roomNo) return { status: 0, message: "房号为空" };

    const roomRows = rooms.select().where((r) => r.roomNo === roomNo).limit(1);
    if (!roomRows.length) return { status: 0, message: "房间不存在" };
    const room = roomRows[0];

    if (room.password && room.password !== password) {
      return { status: 0, message: "房间密码错误" };
    }

    const userRows = users.select().where((u) => u.id === userId).limit(1);
    if (!userRows.length) return { status: 0, message: "用户不存在" };
    const user = userRows[0];

    // 检查是否已经在房间
    const existing = roomPlayers.select()
      .where((p) => p.roomId === room.id && p.userId === userId).limit(1);

    if (!existing.length) {
      // 找空位
      const players = roomPlayers.select().where((p) => p.roomId === room.id);
      const occupiedSeats = new Set(players.map((p) => p.seat));
      let seat = -1;
      for (let i = 0; i < room.maxSeats; i++) {
        if (!occupiedSeats.has(i)) {
          seat = i;
          break;
        }
      }
      if (seat === -1) return { status: 0, message: "房间已满" };

      roomPlayers.insert({
        roomId: room.id,
        userId,
        seat,
        gold: user.gold,
        ready: false,
        isSpectator: false,
        joinedAt: Math.floor(Date.now() / 1000),
      });
    }

    return {
      status: 1,
      room: this.formatRoom(room),
      players: this.getRoomPlayers(room.id),
    };
  }

  async leaveRoom(userId: number, data: any) {
    const roomId = Number(data.room_id || data.roomId || 0);
    if (!roomId) return { status: 0, message: "房间ID无效" };

    roomPlayers.delete()
      .where((p) => p.roomId === roomId && p.userId === userId);

    const remaining = roomPlayers.select().where((p) => p.roomId === roomId);
    if (remaining.length === 0) {
      rooms.delete().where((r) => r.id === roomId);
    }

    return { status: 1 };
  }

  async userOffline(userId: number) {
    // 离开所有房间，或标记离线
    roomPlayers.update({ ready: false })
      .where((p) => p.userId === userId);
  }

  private formatRoom(room: typeof rooms.$inferSelect) {
    return {
      id: room.id,
      room_no: room.roomNo,
      game_type: room.gameType,
      level: room.level,
      status: room.status,
      current_round: room.currentRound,
      total_rounds: room.totalRounds,
      max_seats: room.maxSeats,
      agent_id: room.agentId,
      total_flow: room.totalFlow,
      total_rake: room.totalRake,
      rule: room.rule,
    };
  }

  private getRoomPlayers(roomId: number) {
    const players = roomPlayers.select().where((p) => p.roomId === roomId);
    if (!players.length) return [];
    const userIds = players.map((p) => p.userId);
    const userRows = users.all().filter((u) => userIds.includes(u.id));
    const userMap = new Map(userRows.map((u) => [u.id, u]));

    return players.map((p) => {
      const u = userMap.get(p.userId);
      return {
        uid: p.userId,
        seat: p.seat,
        gold: p.gold,
        ready: p.ready,
        is_spectator: p.isSpectator,
        account: u?.account || "",
        nickname: u?.nickname || u?.account || "",
        headimgurl: u?.avatar || "",
      };
    });
  }
}

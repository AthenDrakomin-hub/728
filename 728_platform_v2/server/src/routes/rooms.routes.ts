import { Router, Request, Response } from "express";
import { db } from "@/db";
import {
  rooms,
  roomPlayers,
  gameRounds,
  users,
  handStates,
  roomMessages,
  chipTransactions,
  deductionRecords,
  creditTransactions,
} from "@/db/schema";
import { and, desc, eq, inArray, gt } from "drizzle-orm";
import { getCurrentUser, genRoomNo } from "@/lib/auth";
import { LEVELS, Level } from "@/lib/rooms";
import { HandState, publicState, optionsFor, createHand, applyAction, GameType } from "@/lib/hand";

import { commitHand, settleRoom } from "@/lib/settle";
import { getRakeRate } from "@/lib/config";
import { broadcastStateChanged } from "@/socket/roomSocket";

const router = Router();

// POST /api/rooms/create
router.post("/create", async (req: Request, res: Response) => {
  const u = await getCurrentUser(req);
  if (!u) {
    res.status(401).json({ error: "未登录" });
    return;
  }
  const unlimited = u.role === "admin";
  if (!unlimited && u.role !== "agent" && u.role !== "top_agent") {
    res.status(403).json({ error: "无开房权限" });
    return;
  }
  const body = req.body || {};
  const { gameType, level, initialPoints, password } = body;
  if (!["texas", "jinhua", "sangong", "niuniu"].includes(gameType)) {
    res.status(400).json({ error: "游戏类型无效" });
    return;
  }
  if (!["junior", "senior", "top"].includes(level)) {
    res.status(400).json({ error: "房间级别无效" });
    return;
  }
  if (!password) {
    res.status(400).json({ error: "请设置房间密码" });
    return;
  }
  if (!unlimited && u.credit < 100) {
    res.status(403).json({ error: "信用分低于100，无法开房" });
    return;
  }
  if (!unlimited && u.openRoomBlocked) {
    res.status(403).json({ error: "存在未成功扣除的对局，请联系客服补足信用分后开房" });
    return;
  }
  const failed = unlimited ? [] : await db
    .select()
    .from(deductionRecords)
    .where(and(eq(deductionRecords.agentId, u.id), eq(deductionRecords.success, false), eq(deductionRecords.resolved, false)));
  if (failed.length) {
    res.status(403).json({ error: "有扣分失败的对局未处理，暂不能开新房" });
    return;
  }
  const lv = LEVELS[level as Level];
  if (!unlimited && u.credit < lv.creditReq) {
    res.status(403).json({ error: `信用分需达到${lv.creditReq}才能开${lv.name}` });
    return;
  }
  const ip = isNaN(Number(initialPoints)) ? lv.min : Math.max(lv.min, Math.min(lv.max, Number(initialPoints)));
  if (ip < lv.min || ip > lv.max) {
    res.status(400).json({ error: `${lv.name}初始筹码需在${lv.min}-${lv.max}之间` });
    return;
  }
  let roomNo = genRoomNo();
  for (let i = 0; i < 5; i++) {
    const dup = await db.select().from(rooms).where(eq(rooms.roomNo, roomNo)).limit(1);
    if (!dup.length) break;
    roomNo = genRoomNo();
  }
  const inserted = await db
    .insert(rooms)
    .values({ roomNo, password: String(password), gameType, level, initialPoints: ip, agentId: u.id, status: "waiting" })
    .returning();
  const room = inserted[0];
  // 房主创建房间后默认进入观众席位，可选择加入游戏
  await db.insert(roomPlayers).values({ roomId: room.id, userId: u.id, seat: 0, points: 0, isSpectator: true, ready: false });
  res.json({ room });
});

// POST /api/rooms/join
router.post("/join", async (req: Request, res: Response) => {
  const u = await getCurrentUser(req);
  if (!u) {
    res.status(401).json({ error: "未登录" });
    return;
  }
  const body = req.body || {};
  const roomNo = String(body?.roomNo || "").trim();
  const password = String(body?.password || "");
  const wantSpectate = Boolean(body?.spectate);
  if (!roomNo) {
    res.status(400).json({ error: "请输入房号" });
    return;
  }
  const rows = await db.select().from(rooms).where(eq(rooms.roomNo, roomNo)).limit(1);
  const room = rows[0];
  if (!room) {
    res.status(404).json({ error: "房间不存在" });
    return;
  }
  const privileged = u.role === "admin" || u.role === "top_agent" || room.agentId === u.id;
  if (!privileged) {
    if (!password) {
      res.status(400).json({ error: "请输入房间密码" });
      return;
    }
    if (room.password !== password) {
      res.status(401).json({ error: "房间密码错误" });
      return;
    }
  }
  if (room.status === "finished" || room.settled) {
    res.status(400).json({ error: "该房间已结束" });
    return;
  }
  // 房间互斥：普通玩家不能同时在多个未结束的房间中（观众身份不算）
  // 代理/总代理不受此限制，可以同时管理多个房间
  const isAgentOrAbove = u.role === "agent" || u.role === "top_agent" || u.role === "admin";
  if (!isAgentOrAbove) {
    const otherRooms = await db
      .select({ roomId: roomPlayers.roomId, status: rooms.status, roomNo: rooms.roomNo })
      .from(roomPlayers)
      .innerJoin(rooms, eq(roomPlayers.roomId, rooms.id))
      .where(and(eq(roomPlayers.userId, u.id), eq(roomPlayers.isSpectator, false)));
    const activeOther = otherRooms.filter((r) => r.roomId !== room.id && r.status !== "finished");
    if (activeOther.length) {
      res.status(400).json({ error: `你已在房间 ${activeOther[0].roomNo} 中，请先退出该房间` });
      return;
    }
  }
  const existing = await db
    .select()
    .from(roomPlayers)
    .where(and(eq(roomPlayers.roomId, room.id), eq(roomPlayers.userId, u.id)))
    .limit(1);
  // 如果已在房间中：
  // - 已是玩家：直接返回
  // - 是观众且房主本人想加入游戏：删除观众记录，继续加入流程
  if (existing.length) {
    if (!existing[0].isSpectator) {
      res.json({ room });
      return;
    }
    // 观众转玩家：删除观众记录
    await db.delete(roomPlayers).where(and(eq(roomPlayers.roomId, room.id), eq(roomPlayers.userId, u.id)));
  }
  const current = await db.select().from(roomPlayers).where(eq(roomPlayers.roomId, room.id));
  const seated = current.filter((p) => !p.isSpectator);
  // 管理员和客服只能观战，不能加入游戏
  const isStaff = u.role === "admin" || u.role === "customer_service";
  // 默认加入观众席位；只有明确传wantSpectate=false且不是staff才能加入游戏
  const joinAsPlayer = wantSpectate === false && !isStaff;
  if (!joinAsPlayer) {
    await db.insert(roomPlayers).values({ roomId: room.id, userId: u.id, seat: 0, points: 0, isSpectator: true, ready: false });
    res.json({ room, seatType: "spectator" });
    return;
  }
  if (seated.length >= room.maxSeats) {
    res.status(400).json({ error: `房间已满（最多 ${room.maxSeats} 人）` });
    return;
  }
  // 玩家进房带筹码，上限为房间买入上限（超出部分留在账户）
  const maxBuyIn = room.initialPoints;
  const bringIn = Math.min(u.points, maxBuyIn);
  const nextBal = u.points - bringIn;
  if (bringIn > 0) {
    await db.update(users).set({ points: nextBal }).where(eq(users.id, u.id));
    await db.insert(chipTransactions).values({
      userId: u.id, amount: -bringIn, balanceAfter: nextBal, type: "buyin",
      note: `房间 ${room.roomNo} 带入筹码（上限${maxBuyIn}）`, roomId: room.id,
    });
  }
  const taken = new Set(seated.map((p) => p.seat));
  let seat = 1;
  while (taken.has(seat) && seat <= room.maxSeats) seat++;
  await db.insert(roomPlayers).values({ roomId: room.id, userId: u.id, seat, points: bringIn, isSpectator: false, ready: false });
  res.json({ room, seatType: "player", seat, balance: nextBal, broughtIn: bringIn, maxBuyIn });
});

// GET /api/rooms/mine
router.get("/mine", async (req: Request, res: Response) => {
  const u = await getCurrentUser(req);
  if (!u) {
    res.status(401).json({ error: "未登录" });
    return;
  }
  const gameType = req.query.gameType as string | undefined;
  let agentIds: number[] = [u.id];
  if (u.role === "top_agent") {
    const downs = await db.select({ id: users.id }).from(users).where(eq(users.invitedById, u.id));
    agentIds = [u.id, ...downs.map((d) => d.id)];
  }
  const conds = [];
  if (u.role !== "admin") conds.push(inArray(rooms.agentId, agentIds));
  if (gameType) conds.push(eq(rooms.gameType, gameType));
  const rows = await db
    .select()
    .from(rooms)
    .where(conds.length ? and(...conds) : undefined)
    .orderBy(desc(rooms.createdAt))
    .limit(80);
  const ids = [...new Set(rows.map((r) => r.agentId))];
  const owners = ids.length ? await db.select().from(users).where(inArray(users.id, ids)) : [];
  const nameMap = new Map(owners.map((o) => [o.id, o.nickname || o.account]));
  res.json({
    rooms: rows.map((r) => ({ ...r, ownerName: nameMap.get(r.agentId) || "-", isMine: r.agentId === u.id })),
    canSpectateFree: u.role === "admin" || u.role === "top_agent",
  });
});

// GET /api/rooms/joined — 当前用户已加入但未结束的房间（用于继续游戏）
router.get("/joined", async (req: Request, res: Response) => {
  const u = await getCurrentUser(req);
  if (!u) {
    res.status(401).json({ error: "未登录" });
    return;
  }
  // 查询用户加入的房间（玩家或观众）
  const joined = await db
    .select({
      id: rooms.id,
      roomNo: rooms.roomNo,
      gameType: rooms.gameType,
      level: rooms.level,
      status: rooms.status,
      currentRound: rooms.currentRound,
      totalRounds: rooms.totalRounds,
      agentId: rooms.agentId,
      isSpectator: roomPlayers.isSpectator,
      seat: roomPlayers.seat,
      points: roomPlayers.points,
    })
    .from(roomPlayers)
    .innerJoin(rooms, eq(roomPlayers.roomId, rooms.id))
    .where(eq(roomPlayers.userId, u.id))
    .orderBy(desc(rooms.createdAt))
    .limit(20);
  // 过滤未结束的房间
  const active = joined.filter((r) => r.status !== "finished");
  const agentIds = [...new Set(active.map((r) => r.agentId))];
  const agents = agentIds.length ? await db.select().from(users).where(inArray(users.id, agentIds)) : [];
  const nameMap = new Map(agents.map((a) => [a.id, a.nickname || a.account]));
  res.json({
    rooms: active.map((r) => ({ ...r, ownerName: nameMap.get(r.agentId) || "-" })),
  });
});

// GET /api/rooms/:id
router.get("/:id", async (req: Request, res: Response) => {
  const u = await getCurrentUser(req);
  if (!u) {
    res.status(401).json({ error: "未登录" });
    return;
  }
  const roomId = Number(req.params.id);
  const rows = await db.select().from(rooms).where(eq(rooms.id, roomId)).limit(1);
  const room = rows[0];
  if (!room) {
    res.status(404).json({ error: "房间不存在" });
    return;
  }
  const rps = await db.select().from(roomPlayers).where(eq(roomPlayers.roomId, roomId));
  const userIds = [...new Set(rps.map((r) => r.userId))];
  const uRows = userIds.length ? await db.select().from(users).where(inArray(users.id, userIds)) : [];
  const nameMap = new Map(uRows.map((x) => [x.id, x.nickname || x.account]));
  const avaMap = new Map(uRows.map((x) => [x.id, x.avatar]));
  const players = rps.map((r) => ({
    userId: r.userId, account: nameMap.get(r.userId) || "?", avatar: avaMap.get(r.userId) || "1",
    seat: r.seat, points: r.points, isSpectator: r.isSpectator, ready: r.ready,
  }));
  const roundsRows = await db.select().from(gameRounds).where(eq(gameRounds.roomId, roomId)).orderBy(desc(gameRounds.roundNo)).limit(25);
  const hsRows = await db.select().from(handStates).where(eq(handStates.roomId, roomId)).limit(1);
  const st = hsRows.length ? (hsRows[0].state as HandState) : null;
  const me = rps.find((r) => r.userId === u.id);
  const viewerIsSpectator = !me || me.isSpectator;
  const isAgent = room.agentId === u.id;
  // 注意：GET请求不触发broadcastStateChanged，否则会导致前端load→广播→load无限循环
  // 广播只在状态实际变更时触发（准备、开始游戏、操作等）
  res.json({
    room, players, rounds: roundsRows,
    me: me ? { seat: me.seat, points: me.points, isSpectator: me.isSpectator, ready: me.ready } : null,
    isAgent, isHost: room.agentId === u.id, role: u.role, userId: u.id,
    hand: st ? publicState(st, u.id, viewerIsSpectator) : null,
    options: st && !viewerIsSpectator ? optionsFor(st, u.id) : [],
  });
});

// POST /api/rooms/:id/ready
router.post("/:id/ready", async (req: Request, res: Response) => {
  const u = await getCurrentUser(req);
  if (!u) {
    res.status(401).json({ error: "未登录" });
    return;
  }
  const roomId = Number(req.params.id);
  const body = req.body || {};
  const want = typeof body?.ready === "boolean" ? body.ready : null;
  const rp = await db
    .select()
    .from(roomPlayers)
    .where(and(eq(roomPlayers.roomId, roomId), eq(roomPlayers.userId, u.id)))
    .limit(1);
  if (!rp.length) {
    res.status(400).json({ error: "你不在该房间" });
    return;
  }
  if (rp[0].isSpectator) {
    res.status(400).json({ error: "观众无需准备" });
    return;
  }
  // 0筹码玩家不能准备游戏，需等代理上分（房主除外）
  const roomRows = await db.select().from(rooms).where(eq(rooms.id, roomId)).limit(1);
  const isHost = roomRows[0]?.agentId === u.id;
  if (rp[0].points <= 0 && !isHost) {
    res.status(400).json({ error: "筹码为0，无法准备，请联系代理上分" });
    return;
  }
  const hs = await db.select().from(handStates).where(eq(handStates.roomId, roomId)).limit(1);
  if (hs.length) {
    const st = hs[0].state as HandState;
    if (!st.finished) {
      res.status(400).json({ error: "本局进行中" });
      return;
    }
  }
  const next = want === null ? !rp[0].ready : want;
  await db.update(roomPlayers).set({ ready: next }).where(eq(roomPlayers.id, rp[0].id));
  broadcastStateChanged(roomId);
  res.json({ ok: true, ready: next });
});

// DELETE /api/rooms/:id/ready (leave room)
router.delete("/:id/ready", async (req: Request, res: Response) => {
  const u = await getCurrentUser(req);
  if (!u) {
    res.status(401).json({ error: "未登录" });
    return;
  }
  const roomId = Number(req.params.id);
  const roomRows = await db.select().from(rooms).where(eq(rooms.id, roomId)).limit(1);
  if (!roomRows.length) {
    res.status(404).json({ error: "房间不存在" });
    return;
  }
  const mine = await db
    .select()
    .from(roomPlayers)
    .where(and(eq(roomPlayers.roomId, roomId), eq(roomPlayers.userId, u.id)))
    .limit(1);
  if (mine.length && !mine[0].isSpectator && mine[0].points > 0) {
    const refAmt = mine[0].points;
    const next = u.points + refAmt;
    await db.update(users).set({ points: next }).where(eq(users.id, u.id));
    await db.insert(chipTransactions).values({
      userId: u.id, amount: refAmt, balanceAfter: next, type: "cashout",
      note: `离开房间 ${roomRows[0].roomNo} 带出筹码`, roomId,
    });
  }
  // 游戏进行中玩家离开：自动弃牌，让游戏继续
  const hs = await loadState(roomId);
  if (hs && !hs.finished) {
    const seatIdx = hs.seats.findIndex((s) => s.userId === u.id);
    if (seatIdx >= 0 && !hs.seats[seatIdx].folded) {
      try {
        applyAction(hs, u.id, "fold");
        await saveState(roomId, hs);
        if (hs.finished) await commitHand(roomId, hs);
      } catch {}
    }
  }
  await db.delete(roomPlayers).where(and(eq(roomPlayers.roomId, roomId), eq(roomPlayers.userId, u.id)));
  const remaining = await db.select().from(roomPlayers).where(eq(roomPlayers.roomId, roomId));
  const activePlayers = remaining.filter((r) => !r.isSpectator);
  if (activePlayers.length === 0) {
    await db.update(rooms).set({ status: "finished", settled: true }).where(eq(rooms.id, roomId));
    await db.delete(handStates).where(eq(handStates.roomId, roomId));
  }
  broadcastStateChanged(roomId);
  res.json({ ok: true });
});

// POST /api/rooms/:id/spectate (切换到观战：玩家→观众，退回筹码)
router.post("/:id/spectate", async (req: Request, res: Response) => {
  const u = await getCurrentUser(req);
  if (!u) {
    res.status(401).json({ error: "未登录" });
    return;
  }
  const roomId = Number(req.params.id);
  const roomRows = await db.select().from(rooms).where(eq(rooms.id, roomId)).limit(1);
  if (!roomRows.length) {
    res.status(404).json({ error: "房间不存在" });
    return;
  }
  const room = roomRows[0];
  const rp = await db
    .select()
    .from(roomPlayers)
    .where(and(eq(roomPlayers.roomId, roomId), eq(roomPlayers.userId, u.id)))
    .limit(1);
  if (!rp.length) {
    res.status(400).json({ error: "你不在房间中" });
    return;
  }
  if (rp[0].isSpectator) {
    res.status(400).json({ error: "你已经是观众" });
    return;
  }
  // 游戏进行中不能切换到观战
  const hs = await db.select().from(handStates).where(eq(handStates.roomId, roomId)).limit(1);
  if (hs.length && !(hs[0].state as HandState).finished) {
    res.status(400).json({ error: "游戏进行中无法切换到观战" });
    return;
  }
  // 退回座位筹码到钱包
  if (rp[0].points > 0) {
    const ur = await db.select().from(users).where(eq(users.id, u.id)).limit(1);
    if (ur.length) {
      const next = ur[0].points + rp[0].points;
      await db.update(users).set({ points: next }).where(eq(users.id, u.id));
      await db.insert(chipTransactions).values({
        userId: u.id, amount: rp[0].points, balanceAfter: next, type: "cashout",
        note: `切换到观战退回筹码`, roomId,
      });
    }
  }
  // 转为观众
  await db.update(roomPlayers).set({ isSpectator: true, points: 0, ready: false, seat: 0 }).where(eq(roomPlayers.id, rp[0].id));
  broadcastStateChanged(roomId);
  res.json({ ok: true });
});

// GET /api/rooms/:id/chat
router.get("/:id/chat", async (req: Request, res: Response) => {
  const u = await getCurrentUser(req);
  if (!u) {
    res.status(401).json({ error: "未登录" });
    return;
  }
  const roomId = Number(req.params.id);
  const since = Number(req.query.since || 0);
  const rows = await db
    .select()
    .from(roomMessages)
    .where(since ? and(eq(roomMessages.roomId, roomId), gt(roomMessages.id, since)) : eq(roomMessages.roomId, roomId))
    .orderBy(desc(roomMessages.id))
    .limit(40);
  const ids = [...new Set([...rows.map((r) => r.userId), ...rows.map((r) => r.targetUserId).filter((x): x is number => !!x)])];
  const uRows = ids.length ? await db.select().from(users).where(inArray(users.id, ids)) : [];
  const nameMap = new Map(uRows.map((x) => [x.id, x.nickname || x.account]));
  const avaMap = new Map(uRows.map((x) => [x.id, x.avatar]));
  res.json({
    messages: rows.map((r) => ({
      id: r.id, userId: r.userId, account: nameMap.get(r.userId) || "?", avatar: avaMap.get(r.userId) || "1",
      kind: r.kind, content: r.content, targetUserId: r.targetUserId,
      targetName: r.targetUserId ? nameMap.get(r.targetUserId) : null, createdAt: r.createdAt,
    })).reverse(),
  });
});

// POST /api/rooms/:id/chat
router.post("/:id/chat", async (req: Request, res: Response) => {
  const u = await getCurrentUser(req);
  if (!u) {
    res.status(401).json({ error: "未登录" });
    return;
  }
  const roomId = Number(req.params.id);
  const me = await db
    .select()
    .from(roomPlayers)
    .where(and(eq(roomPlayers.roomId, roomId), eq(roomPlayers.userId, u.id)))
    .limit(1);
  if (!me) {
    res.status(403).json({ error: "你不在该房间" });
    return;
  }
  const KINDS = ["text", "quick", "emoji", "interact"];
  const b = req.body || {};
  const kind = String(b?.kind || "text");
  let content = String(b?.content ?? "").trim();
  const targetUserId = b?.targetUserId ? Number(b.targetUserId) : null;
  if (!KINDS.includes(kind)) {
    res.status(400).json({ error: "消息类型无效" });
    return;
  }
  if (!content) {
    res.status(400).json({ error: "内容为空" });
    return;
  }
  if (content.length > 60) content = content.slice(0, 60);
  const recent = await db
    .select({ id: roomMessages.id })
    .from(roomMessages)
    .where(and(eq(roomMessages.roomId, roomId), eq(roomMessages.userId, u.id), gt(roomMessages.createdAt, new Date(Date.now() - 3000))));
  if (recent.length >= 5) {
    res.status(429).json({ error: "发送太快了，歇一歇" });
    return;
  }
  const ins = await db.insert(roomMessages).values({ roomId, userId: u.id, kind, content, targetUserId }).returning();
  res.json({ ok: true, id: ins[0].id });
});

async function loadState(roomId: number): Promise<HandState | null> {
  const rows = await db.select().from(handStates).where(eq(handStates.roomId, roomId)).limit(1);
  return rows.length ? (rows[0].state as HandState) : null;
}

async function isSpectator(roomId: number, userId: number) {
  const rp = await db
    .select()
    .from(roomPlayers)
    .where(and(eq(roomPlayers.roomId, roomId), eq(roomPlayers.userId, userId)))
    .limit(1);
  return !rp.length || rp[0].isSpectator;
}

async function saveState(roomId: number, st: HandState) {
  const existing = await db.select().from(handStates).where(eq(handStates.roomId, roomId)).limit(1);
  if (existing.length) {
    await db.update(handStates).set({ state: st, updatedAt: new Date() }).where(eq(handStates.roomId, roomId));
  } else {
    await db.insert(handStates).values({ roomId, state: st });
  }
}

// GET /api/rooms/:id/hand
router.get("/:id/hand", async (req: Request, res: Response) => {
  const u = await getCurrentUser(req);
  if (!u) {
    res.status(401).json({ error: "未登录" });
    return;
  }
  const roomId = Number(req.params.id);
  if (isNaN(roomId) || roomId < 1) {
    res.status(400).json({ error: "房间ID无效" });
    return;
  }
  const st = await loadState(roomId);
  if (!st) {
    res.json({ hand: null, options: [] });
    return;
  }
  const spec = await isSpectator(roomId, u.id);
  res.json({ hand: publicState(st, u.id, spec), options: spec ? [] : optionsFor(st, u.id) });
});

// POST /api/rooms/:id/hand (start new hand)
router.post("/:id/hand", async (req: Request, res: Response) => {
  const u = await getCurrentUser(req);
  if (!u) {
    res.status(401).json({ error: "未登录" });
    return;
  }
  const roomId = Number(req.params.id);
  // 并发锁：防止同时开始
  if (processingRooms.has(roomId)) {
    res.status(429).json({ error: "操作过于频繁，请稍后重试" });
    return;
  }
  processingRooms.add(roomId);
  try {
  const roomRows = await db.select().from(rooms).where(eq(rooms.id, roomId)).limit(1);
  const room = roomRows[0];
  if (!room) {
    res.status(404).json({ error: "房间不存在" });
    return;
  }
  if (room.settled || room.status === "finished") {
    res.status(400).json({ error: "该房间已结束" });
    return;
  }
  const existing = await loadState(roomId);
  if (existing && !existing.finished) {
    res.status(400).json({ error: "本局尚未结束" });
    return;
  }
  const rps = await db.select().from(roomPlayers).where(eq(roomPlayers.roomId, roomId));
  // 房主可以0筹码参与，其他玩家需要points>0
  const seated = rps.filter((r) => !r.isSpectator && (r.points > 0 || r.userId === room.agentId));
  if (seated.length < 2) {
    res.status(400).json({ error: "至少需要 2 名玩家才能开局" });
    return;
  }
  if (seated.length > room.maxSeats) {
    res.status(400).json({ error: "房间人数超出上限" });
    return;
  }
  const isHost = room.agentId === u.id;
  // 第一局只有房主能手动开始；第2-25局自动开始，任何玩家端都可触发
  if (room.currentRound === 0 && !isHost) {
    res.status(403).json({ error: "只有房主可以开始对局" });
    return;
  }
  if (room.currentRound > 0) {
    const me = seated.find((r) => r.userId === u.id);
    // 第2-25局：房主（即使是观众）或在座位上的玩家都能自动开始
    if (!me && !isHost) {
      res.status(403).json({ error: "你不在座位上" });
      return;
    }
  }
  // 第一局需要所有玩家准备（房主豁免），之后的局自动开始不需要重新准备
  if (room.currentRound === 0) {
    const notReady = seated.filter((r) => !r.ready && r.userId !== room.agentId);
    if (notReady.length) {
      res.status(400).json({ error: `还有 ${notReady.length} 位玩家未准备` });
      return;
    }
  }
  const uRows = await db.select().from(users).where(inArray(users.id, seated.map((s) => s.userId)));
  const nameMap = new Map(uRows.map((x) => [x.id, x.account]));
  const players = seated.sort((a, b) => a.seat - b.seat).map((s) => ({
    userId: s.userId, account: nameMap.get(s.userId) || "?", points: s.points,
  }));
  const st = createHand(room.gameType as GameType, players, room.level, room.currentRound + 1, room.currentRound % players.length);
  st.rakeRate = await getRakeRate();
  await saveState(roomId, st);
  for (const r of seated) {
    await db.update(roomPlayers).set({ ready: false }).where(eq(roomPlayers.id, r.id));
  }
  const spec = await isSpectator(roomId, u.id);
  res.json({ hand: publicState(st, u.id, spec), options: spec ? [] : optionsFor(st, u.id) });
  } catch (e: any) {
    console.error(`[开始游戏失败] room=${roomId}:`, e.message);
    res.status(500).json({ error: `开始游戏失败: ${e.message}` });
  } finally {
    processingRooms.delete(roomId);
  }
});

// PUT /api/rooms/:id/hand (perform action)
router.put("/:id/hand", async (req: Request, res: Response) => {
  const u = await getCurrentUser(req);
  if (!u) {
    res.status(401).json({ error: "未登录" });
    return;
  }
  const roomId = Number(req.params.id);
  // 并发锁：防止同一个房间同时处理多个操作
  if (processingRooms.has(roomId)) {
    res.status(429).json({ error: "操作过于频繁，请稍后重试" });
    return;
  }
  processingRooms.add(roomId);
  try {
    const body = req.body || {};
    const { action, amount } = body;
    if (!action) {
      res.status(400).json({ error: "缺少操作" });
      return;
    }
    if (await isSpectator(roomId, u.id)) {
      res.status(403).json({ error: "观众无法参与对局" });
      return;
    }
    const st = await loadState(roomId);
    if (!st) {
      res.status(400).json({ error: "本局未开始" });
      return;
    }
    if (st.finished) {
      res.status(400).json({ error: "本局已结束" });
      return;
    }
    const result = applyAction(st, u.id, action, amount);
    if (!result.ok) {
      res.status(400).json({ error: result.error });
      return;
    }
    st.lastActionTime = Date.now();
    await saveState(roomId, st);
    let commit = null;
    if (st.finished) {
      commit = await commitHand(roomId, st);
    }
    // WebSocket广播：通知房间内所有玩家状态已变更
    broadcastStateChanged(roomId);
    res.json({ hand: publicState(st, u.id), options: optionsFor(st, u.id), commit });
  } catch (e: any) {
    console.error(`[游戏操作失败] room=${roomId} user=${u.id} action=${req.body?.action}:`, e.message);
    res.status(500).json({ error: `操作失败: ${e.message}` });
  } finally {
    processingRooms.delete(roomId);
  }
});

// POST /api/rooms/:id/gift
router.post("/:id/gift", async (req: Request, res: Response) => {
  const u = await getCurrentUser(req);
  if (!u) {
    res.status(401).json({ error: "未登录" });
    return;
  }
  const roomId = Number(req.params.id);
  const rows = await db.select().from(rooms).where(eq(rooms.id, roomId)).limit(1);
  const room = rows[0];
  if (!room) {
    res.status(404).json({ error: "房间不存在" });
    return;
  }
  if (room.agentId !== u.id) {
    res.status(403).json({ error: "只有房主代理可赠送筹码" });
    return;
  }
  const body = req.body || {};
  const { targetUserId, amount } = body;
  const amt = Number(amount);
  if (!targetUserId || isNaN(amt) || amt <= 0) {
    res.status(400).json({ error: "赠送参数无效" });
    return;
  }
  const rp = await db
    .select()
    .from(roomPlayers)
    .where(and(eq(roomPlayers.roomId, roomId), eq(roomPlayers.userId, Number(targetUserId))))
    .limit(1);
  if (!rp.length) {
    res.status(400).json({ error: "目标玩家不在房间" });
    return;
  }
  // 检查代理筹码是否足够
  if (u.points < amt) {
    res.status(400).json({ error: `代理筹码不足，当前 ${u.points}，需要 ${amt}` });
    return;
  }
  // 房间筹码上限：玩家座位筹码不能超过房间买入上限
  const maxSeat = room.initialPoints;
  const next = rp[0].points + amt;
  if (next > maxSeat) {
    res.status(400).json({ error: `该玩家座位筹码已达上限（${maxSeat}），当前 ${rp[0].points}，最多可上 ${maxSeat - rp[0].points}` });
    return;
  }
  // 如果目标是观众，上分后自动转为玩家
  if (rp[0].isSpectator) {
    await db.update(roomPlayers).set({ isSpectator: false, points: next }).where(eq(roomPlayers.id, rp[0].id));
  } else {
    await db.update(roomPlayers).set({ points: next }).where(eq(roomPlayers.id, rp[0].id));
  }
  // 从代理账户扣除
  const agentNext = u.points - amt;
  await db.update(users).set({ points: agentNext }).where(eq(users.id, u.id));
  // 玩家座位流水
  await db.insert(chipTransactions).values({
    userId: Number(targetUserId), operatorId: u.id, amount: amt,
    balanceAfter: next, type: "room_gift",
    note: `房间 ${room.roomNo} 内代理上分`, roomId,
  });
  // 代理账户流水
  await db.insert(chipTransactions).values({
    userId: u.id, operatorId: u.id, amount: -amt,
    balanceAfter: agentNext, type: "agent_sub",
    note: `房间 ${room.roomNo} 给玩家上分`, roomId,
  });
  broadcastStateChanged(roomId);
  res.json({ ok: true, points: next, agentPoints: agentNext });
});

// POST /api/rooms/:id/early-settle
router.post("/:id/early-settle", async (req: Request, res: Response) => {
  const u = await getCurrentUser(req);
  if (!u) {
    res.status(401).json({ error: "未登录" });
    return;
  }
  const roomId = Number(req.params.id);
  const roomRows = await db.select().from(rooms).where(eq(rooms.id, roomId)).limit(1);
  const room = roomRows[0];
  if (!room) {
    res.status(404).json({ error: "房间不存在" });
    return;
  }
  if (room.settled || room.status === "finished") {
    res.status(400).json({ error: "房间已结束" });
    return;
  }
  if (room.agentId !== u.id && u.role !== "admin") {
    res.status(403).json({ error: "无权操作" });
    return;
  }
  const rps = await db.select().from(roomPlayers).where(eq(roomPlayers.roomId, roomId));
  const hsRows = await db.select().from(handStates).where(eq(handStates.roomId, roomId)).limit(1);
  if (hsRows.length) {
    const st = hsRows[0].state as HandState;
    if (!st.finished) {
      // 只退还玩家本轮下注（streetBet），pot中的钱不退（已下注的钱不归玩家）
      for (const s of st.seats) {
        if (s.streetBet > 0) {
          const rp = rps.find((r) => r.userId === s.userId && !r.isSpectator);
          if (rp) rp.points += s.streetBet;
          s.streetBet = 0;
        }
      }
      st.pot = 0;
      st.finished = true;
      st.phase = "showdown";
      await db.update(handStates).set({ state: st, updatedAt: new Date() }).where(eq(handStates.roomId, roomId));
    }
  }
  // 更新玩家座位筹码（含退还的streetBet）
  for (const rp of rps) {
    await db.update(roomPlayers).set({ points: rp.points }).where(eq(roomPlayers.id, rp.id));
  }
  // 退还玩家当前剩余筹码到钱包
  const refunded: { userId: number; amount: number }[] = [];
  for (const rp of rps) {
    if (rp.isSpectator || rp.points <= 0) continue;
    const ur = await db.select().from(users).where(eq(users.id, rp.userId)).limit(1);
    if (!ur.length) continue;
    const next = ur[0].points + rp.points;
    await db.update(users).set({ points: next }).where(eq(users.id, rp.userId));
    await db.insert(chipTransactions).values({
      userId: rp.userId, amount: rp.points, balanceAfter: next, type: "cashout",
      note: `房间 ${room.roomNo} 提前结算带出筹码`, roomId,
    });
    refunded.push({ userId: rp.userId, amount: rp.points });
  }
  // 提前结算：按已完成局数的流水扣除代理信用分 + 计算返佣
  // 即使只玩了1局，也要扣除对应的水费
  let settlement = null;
  if (room.totalFlow > 0 || room.currentRound > 0) {
    settlement = await settleRoom(
      roomId,
      room.agentId,
      room.totalRake,
      room.totalFlow,
      room.gameType
    );
  }

  await db.update(rooms).set({ status: "finished", settled: true, archivedAt: new Date() }).where(eq(rooms.id, roomId));
  await db.delete(roomPlayers).where(eq(roomPlayers.roomId, roomId));
  await db.delete(handStates).where(eq(handStates.roomId, roomId));
  broadcastStateChanged(roomId);
  res.json({ ok: true, refunded, totalRake: room.totalRake, totalFlow: room.totalFlow, settlement });
});

// POST /api/rooms/:id/kick (房主踢出单个玩家)
router.post("/:id/kick", async (req: Request, res: Response) => {
  const u = await getCurrentUser(req);
  if (!u) {
    res.status(401).json({ error: "未登录" });
    return;
  }
  const roomId = Number(req.params.id);
  const roomRows = await db.select().from(rooms).where(eq(rooms.id, roomId)).limit(1);
  const room = roomRows[0];
  if (!room) {
    res.status(404).json({ error: "房间不存在" });
    return;
  }
  if (room.agentId !== u.id && u.role !== "admin") {
    res.status(403).json({ error: "只有房主可踢出玩家" });
    return;
  }
  const { targetUserId } = req.body || {};
  if (!targetUserId) {
    res.status(400).json({ error: "缺少 targetUserId" });
    return;
  }
  const rpRows = await db
    .select()
    .from(roomPlayers)
    .where(and(eq(roomPlayers.roomId, roomId), eq(roomPlayers.userId, Number(targetUserId))))
    .limit(1);
  const rp = rpRows[0];
  if (!rp) {
    res.status(404).json({ error: "玩家不在房间" });
    return;
  }
  if (rp.isSpectator) {
    res.status(400).json({ error: "不能踢出观战者" });
    return;
  }

  // 如果牌局进行中，标记该玩家弃牌
  const hsRows = await db.select().from(handStates).where(eq(handStates.roomId, roomId)).limit(1);
  if (hsRows.length) {
    const st = hsRows[0].state as HandState;
    if (!st.finished) {
      const seat = st.seats.find((s) => s.userId === Number(targetUserId));
      if (seat && !seat.folded) {
        applyAction(st, Number(targetUserId), "fold");
        st.lastActionTime = Date.now();
        await db.update(handStates).set({ state: st, updatedAt: new Date() }).where(eq(handStates.roomId, roomId));
      }
    }
  }

  // 退回该玩家剩余筹码到钱包
  let refunded = 0;
  if (rp.points > 0) {
    const ur = await db.select().from(users).where(eq(users.id, Number(targetUserId))).limit(1);
    if (ur.length) {
      const next = ur[0].points + rp.points;
      await db.update(users).set({ points: next }).where(eq(users.id, Number(targetUserId)));
      await db.insert(chipTransactions).values({
        userId: Number(targetUserId),
        amount: rp.points,
        balanceAfter: next,
        type: "cashout",
        note: `房间 ${room.roomNo} 被房主踢出，退回筹码`,
        roomId,
      });
      refunded = rp.points;
    }
  }

  // 从房间移除
  await db.delete(roomPlayers).where(eq(roomPlayers.id, rp.id));

  broadcastStateChanged(roomId);
  res.json({ ok: true, refunded });
});

// POST /api/rooms/:id/continue (代理续开房间：25局结束后重置计数，玩家不用重新进房)
router.post("/:id/continue", async (req: Request, res: Response) => {
  const u = await getCurrentUser(req);
  if (!u) {
    res.status(401).json({ error: "未登录" });
    return;
  }
  const roomId = Number(req.params.id);
  const roomRows = await db.select().from(rooms).where(eq(rooms.id, roomId)).limit(1);
  const room = roomRows[0];
  if (!room) {
    res.status(404).json({ error: "房间不存在" });
    return;
  }
  if (room.agentId !== u.id && u.role !== "admin") {
    res.status(403).json({ error: "只有房主可续开房间" });
    return;
  }
  if (room.status !== "waiting_continue") {
    res.status(400).json({ error: `当前状态不可续开（${room.status}）` });
    return;
  }
  // 重置房间计数，进入等待准备状态
  await db.update(rooms).set({
    currentRound: 0,
    totalRake: 0,
    totalFlow: 0,
    settled: false,
    status: "waiting",
  }).where(eq(rooms.id, roomId));
  // 玩家座位保留，重置准备状态；自动从钱包带筹码到座位（和加入房间时一样）
  const rps = await db.select().from(roomPlayers).where(eq(roomPlayers.roomId, roomId));
  for (const rp of rps) {
    if (rp.isSpectator) {
      await db.update(roomPlayers).set({ ready: false, points: 0 }).where(eq(roomPlayers.id, rp.id));
      continue;
    }
    const ur = await db.select().from(users).where(eq(users.id, rp.userId)).limit(1);
    if (!ur.length) continue;
    const bringIn = Math.min(ur[0].points, room.initialPoints);
    const nextBal = ur[0].points - bringIn;
    if (bringIn > 0) {
      await db.update(users).set({ points: nextBal }).where(eq(users.id, rp.userId));
      await db.insert(chipTransactions).values({
        userId: rp.userId, amount: -bringIn, balanceAfter: nextBal, type: "buyin",
        note: `房间 ${room.roomNo} 续开带入筹码（上限${room.initialPoints}）`, roomId,
      });
    }
    await db.update(roomPlayers).set({ ready: false, points: bringIn }).where(eq(roomPlayers.id, rp.id));
  }
  // 清除上一轮牌局状态
  await db.delete(handStates).where(eq(handStates.roomId, roomId));
  broadcastStateChanged(roomId);
  res.json({ ok: true, message: "房间已续开，玩家可重新准备" });
});

// ========== 超时自动行动 ==========
const TIMEOUT_MS = 30 * 1000; // 30秒
const GRAB_RESULT_MS = 3 * 1000; // 抢庄结果展示3秒
const CHECK_INTERVAL = 5 * 1000; // 每5秒检查一次
const processingRooms = new Set<number>();

async function autoTimeoutCheck() {
  try {
    const rows = await db.select().from(handStates);
    for (const row of rows) {
      const st = row.state as HandState;
      if (st.finished) continue;

      // grab_result阶段：展示3秒后自动进入下注
      if (st.phase === "grab_result") {
        if (Date.now() - (st.lastActionTime || 0) < GRAB_RESULT_MS) continue;
        if (processingRooms.has(row.roomId)) continue;
        processingRooms.add(row.roomId);
        try {
          const bi = st.bankerIdx ?? 0;
          st.seats.forEach((s) => (s.acted = false));
          st.phase = "betting";
          // 从庄家下一位开始下注
          st.turn = (bi + 1) % st.seats.length;
          st.log.push("下注阶段：闲家请依次下注筹码（可多次点击累加）");
          st.lastActionTime = Date.now();
          await saveState(row.roomId, st);
          broadcastStateChanged(row.roomId);
        } catch (e) {
          console.error(`[grab_result] room ${row.roomId} error:`, e);
        } finally {
          processingRooms.delete(row.roomId);
        }
        continue;
      }

      if (st.turn < 0) continue;
      if (Date.now() - (st.lastActionTime || 0) < TIMEOUT_MS) continue;
      if (processingRooms.has(row.roomId)) continue;
      processingRooms.add(row.roomId);

      try {
        const currentSeat = st.seats[st.turn];
        if (!currentSeat) continue;

        // grab阶段：如果当前玩家已掷过骰，跳到下一个未掷的玩家
        if (st.phase === "grab" && currentSeat.diceRoll !== null) {
          const n = st.seats.length;
          let nextIdx = -1;
          for (let k = 1; k <= n; k++) {
            const i = (st.turn + k) % n;
            if (st.seats[i].diceRoll === null) { nextIdx = i; break; }
          }
          if (nextIdx >= 0) {
            st.turn = nextIdx;
            st.lastActionTime = Date.now();
            await saveState(row.roomId, st);
            broadcastStateChanged(row.roomId);
          }
          processingRooms.delete(row.roomId);
          continue;
        }

        // 根据游戏和阶段决定默认行动
        let defaultAction = "fold";
        let defaultAmount: number | undefined;
        if (st.gameType === "sangong" || st.gameType === "niuniu") {
          if (st.phase === "grab") {
            defaultAction = "roll";
          } else if (st.phase === "betting") {
            // 下注阶段超时：已下注则确认，未下注则下最小面额后确认
            if (currentSeat.totalBet >= st.baseBet) {
              defaultAction = "confirm_bet";
            } else {
              defaultAction = "bet";
              defaultAmount = st.chips[0];
            }
          } else if (st.phase === "dealt") {
            defaultAction = "confirm";
          }
        } else if (st.gameType === "texas") {
          // 德州超时：当前注为0则过牌，否则弃牌
          const toCall = Math.max(0, st.currentBet - currentSeat.streetBet);
          if (toCall === 0) defaultAction = "check";
        }

        const result = applyAction(st, currentSeat.userId, defaultAction, defaultAmount);
        // 如果bet成功但还需要confirm_bet，自动确认
        if (result.ok && defaultAction === "bet") {
          applyAction(st, currentSeat.userId, "confirm_bet");
        }
        if (result.ok) {
          const actionLabel = defaultAction === "fold" ? "弃牌" : defaultAction === "roll" ? "掷骰" : defaultAction === "confirm" ? "确认" : defaultAction === "check" ? "过牌" : defaultAction === "confirm_bet" ? "确认下注" : "下注";
          st.lastActionTime = Date.now();
          st.log.push(`⏱ ${currentSeat.account} 超时自动${actionLabel}`);
          await saveState(row.roomId, st);
          if (st.finished) {
            await commitHand(row.roomId, st);
          }
          broadcastStateChanged(row.roomId);
        }
      } catch (e) {
        console.error(`[timeout] room ${row.roomId} error:`, e);
      } finally {
        processingRooms.delete(row.roomId);
      }
    }
  } catch (e) {
    console.error("[timeout] check error:", e);
  }
}

export function startTimeoutChecker() {
  setInterval(autoTimeoutCheck, CHECK_INTERVAL);
  console.log("[V-POKER API] 超时自动行动已启动 (30秒)");
}

export default router;

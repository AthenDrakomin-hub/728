import { db } from "@/db";
import {
  rooms,
  roomPlayers,
  gameRounds,
  users,
  creditTransactions,
  deductionRecords,
  chipTransactions,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { HandState } from "./hand";
import { TOP_AGENT_SHARE } from "./rates";
import { getAgentDeductRate, getAgentCommissionRate, getTopAgentCommissionRate } from "./config";
import { broadcastStateChanged } from "@/socket/roomSocket";

// Persist a finished hand: player stacks, round record, room totals,
// and (on the final round) the agent/top-agent accounting.
export async function commitHand(roomId: number, st: HandState) {
  const roomRows = await db
    .select()
    .from(rooms)
    .where(eq(rooms.id, roomId))
    .limit(1);
  const room = roomRows[0];
  if (!room || !st.result) return null;

  const rps = await db
    .select()
    .from(roomPlayers)
    .where(eq(roomPlayers.roomId, roomId));

  for (const seat of st.seats) {
    const rp = rps.find((r) => r.userId === seat.userId && !r.isSpectator);
    if (rp) {
      await db
        .update(roomPlayers)
        .set({ points: Math.max(0, seat.points) })
        .where(eq(roomPlayers.id, rp.id));
    }
  }

  // 结算后筹码为0的玩家自动转为观战（房主除外）
  const brokePlayers: number[] = [];
  for (const seat of st.seats) {
    const rp = rps.find((r) => r.userId === seat.userId && !r.isSpectator);
    if (rp && seat.points <= 0 && rp.userId !== room.agentId) {
      await db
        .update(roomPlayers)
        .set({ isSpectator: true, ready: false })
        .where(eq(roomPlayers.id, rp.id));
      brokePlayers.push(rp.userId);
    }
  }
  if (brokePlayers.length > 0) {
    console.log(`[结算] 筹码不足转为观战: room=${roomId} players=${brokePlayers.join(",")}`);
  }

  const roundNo = room.currentRound + 1;
  await db.insert(gameRounds).values({
    roomId,
    roundNo,
    gameType: room.gameType,
    result: st.result,
    winnerUserId: st.result.winnerUserId,
    potBeforeRake: st.result.flow,
    rake: st.result.rake,
  });

  const totalRake = room.totalRake + st.result.rake;
  const totalFlow = room.totalFlow + st.result.flow;
  const isLast = roundNo >= room.totalRounds;

  await db
    .update(rooms)
    .set({
      currentRound: roundNo,
      totalRake,
      totalFlow,
      // 25局结束进入"待续开"状态，代理确认后续开，玩家不用重新进房
      status: isLast ? "waiting_continue" : "playing",
      settled: isLast,
    })
    .where(eq(rooms.id, roomId));

  // 总局结束：把桌上筹码退回玩家钱包 + 结算信用分
  if (isLast) {
    await cashOutAll(roomId, room.roomNo);
  }

  let settlement = null;
  if (isLast) {
    settlement = await settleRoom(
      roomId,
      room.agentId,
      totalRake,
      totalFlow,
      room.gameType
    );
  }
  // 广播状态变更（包括筹码不足转为观战的玩家）
  broadcastStateChanged(roomId);
  return { roundNo, isLast, totalRake, totalFlow, settlement, brokePlayers };
}

/** 把房内所有玩家的剩余筹码退回其钱包 */
export async function cashOutAll(roomId: number, roomNo: string) {
  const rps = await db
    .select()
    .from(roomPlayers)
    .where(eq(roomPlayers.roomId, roomId));
  for (const rp of rps) {
    if (rp.isSpectator || rp.points <= 0) continue;
    const ur = await db
      .select()
      .from(users)
      .where(eq(users.id, rp.userId))
      .limit(1);
    if (!ur.length) continue;
    const next = ur[0].points + rp.points;
    await db.update(users).set({ points: next }).where(eq(users.id, rp.userId));
    await db.insert(chipTransactions).values({
      userId: rp.userId,
      amount: rp.points,
      balanceAfter: next,
      type: "cashout",
      note: `房间 ${roomNo} 结算带出筹码`,
      roomId,
    });
    await db
      .update(roomPlayers)
      .set({ points: 0 })
      .where(eq(roomPlayers.id, rp.id));
  }
}

export const UNLIMITED = 1_000_000_000;

export async function settleRoom(
  roomId: number,
  agentId: number,
  totalRake: number,
  totalFlow: number,
  gameType: string
) {
  // 代理信用分扣除比例从全局配置读取（默认2%）
  const deductRate = await getAgentDeductRate();
  const deductAmt = Math.round(totalFlow * deductRate / 100);

  // 代理返佣比例从全局配置读取（默认1%）
  const agentRate = await getAgentCommissionRate();
  const agentCommission = Math.round(totalFlow * agentRate / 100);

  const agentRows = await db
    .select()
    .from(users)
    .where(eq(users.id, agentId))
    .limit(1);
  const agent = agentRows[0];
  if (!agent) return null;

  // 总代理返佣（从平台抽水里出）
  let topAgentCommission = 0;
  if (agent.invitedById) {
    const upRows = await db
      .select()
      .from(users)
      .where(eq(users.id, agent.invitedById))
      .limit(1);
    const up = upRows[0];
    if (up && up.role === "top_agent") {
      const upRate = await getTopAgentCommissionRate();
      topAgentCommission = Math.round(totalFlow * upRate / 100);
    }
  }

  // 平台净收入 = 总抽水 - 代理返佣 - 总代理返佣
  // 返佣由平台从抽水中支付，不额外扣玩家
  const platformNetIncome = totalRake - agentCommission - topAgentCommission;

  const unlimited = agent.role === "admin";
  let success = false;
  let newCredit = agent.credit;
  let newCommission = agent.commission || 0;

  // 扣除代理信用分（2%流水，开房成本）
  if (unlimited || agent.credit >= deductAmt) {
    if (!unlimited) {
      newCredit = agent.credit - deductAmt;
      await db.update(users).set({ credit: newCredit }).where(eq(users.id, agentId));
    }
    success = true;

    // 记录信用分扣除
    if (deductAmt > 0) {
      await db.insert(creditTransactions).values({
        userId: agentId,
        amount: unlimited ? 0 : -deductAmt,
        balanceAfter: newCredit,
        type: "room_deduct",
        note: `房间#${roomId} 信用分扣除（流水${totalFlow}×${deductRate}%=${deductAmt}）`,
      });
    }
  } else {
    // 信用分不足 -> 冻结开房权限
    await db.update(users).set({ openRoomBlocked: true }).where(eq(users.id, agentId));
  }

  // 代理返佣：从平台抽水中支付，计入代理commission余额
  if (agentCommission > 0) {
    newCommission = (agent.commission || 0) + agentCommission;
    await db.update(users).set({ commission: newCommission }).where(eq(users.id, agentId));
    await db.insert(creditTransactions).values({
      userId: agentId,
      amount: agentCommission,
      balanceAfter: newCommission,
      type: "agent_commission",
      note: `房间#${roomId} 代理返佣（流水${totalFlow}×${agentRate}%=${agentCommission}，平台抽水支付）`,
    });
  }

  // 总代理返佣：从平台抽水中支付（已在前面计算topAgentCommission）
  if (topAgentCommission > 0 && agent.invitedById) {
    const upRows = await db
      .select()
      .from(users)
      .where(eq(users.id, agent.invitedById))
      .limit(1);
    const up = upRows[0];
    if (up) {
      const upNewCommission = (up.commission || 0) + topAgentCommission;
      await db.update(users).set({ commission: upNewCommission }).where(eq(users.id, up.id));
      await db.insert(creditTransactions).values({
        userId: up.id,
        amount: topAgentCommission,
        balanceAfter: upNewCommission,
        type: "top_agent_commission",
        note: `下线 ${agent.account} 房间#${roomId} 流水返佣（流水${totalFlow}×总代理比例=${topAgentCommission}，平台抽水支付）`,
      });
    }
  }

  await db.insert(deductionRecords).values({
    roomId,
    agentId,
    totalFlow,
    amount: deductAmt,
    success,
    resolved: success,
    gameType,
  });

  return {
    deductAmt,
    totalRake,
    totalFlow,
    deductSuccess: success,
    agentCredit: newCredit,
    agentCommission,
    topAgentCommission,
    platformNetIncome,
  };
}

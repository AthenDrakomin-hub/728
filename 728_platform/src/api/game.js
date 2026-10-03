// 游戏 API - 游戏结算与抽水逻辑
const { Router } = require("express");
const jwt = require("jsonwebtoken");
const config = require("../config");
const db = require("../db/init");

const router = Router();

function auth(req, res, next) {
  const token = req.headers["x-token"] || req.headers["authorization"]?.replace("Bearer ", "");
  if (!token) return res.json({ code: 50008, msg: "未登录" });
  try { const d = jwt.verify(token, config.JWT_SECRET); req.uid = d.uid; req.user_type = d.type; next(); }
  catch (e) { res.json({ code: 50014, msg: "Token过期" }); }
}

// 游戏结算（每局结束调用）
router.post("/game/settle", auth, (req, res) => {
  const { room_id, winner_uid, winner_profit, total_flow } = req.body;
  const room = db.prepare("SELECT * FROM rooms WHERE id = ?").get(room_id);
  if (!room) return res.json({ code: 40050, msg: "房间不存在" });

  const rakeRate = getConfig("platform_rake_rate") / 100;
  const agentDeductRate = getConfig("agent_deduct_rate") / 100;
  const agentCommissionRate = getConfig("agent_commission_rate") / 100;
  const topAgentCommissionRate = getConfig("top_agent_commission_rate") / 100;

  const rake = Math.floor(winner_profit * rakeRate);
  const creditCost = Math.floor(total_flow * agentDeductRate);
  const agentCommission = Math.floor(total_flow * agentCommissionRate);
  const topAgentCommission = Math.floor(total_flow * topAgentCommissionRate);
  const platformNet = rake - agentCommission - topAgentCommission;

  // 更新房间流水
  db.prepare("UPDATE rooms SET total_flow = total_flow + ?, total_rake = total_rake + ?, cur_round = cur_round + 1 WHERE id = ?").run(total_flow, rake, room_id);

  // 扣代理信用分
  if (room.owner_uid) {
    db.prepare("UPDATE credit_account SET credit = MAX(0, credit - ?), updated_at = datetime('now') WHERE uid = ?").run(creditCost, room.owner_uid);
    db.prepare(`INSERT INTO chip_transactions (uid, room_id, type, amount, balance_before, balance_after, display_tag)
      VALUES (?, ?, 'credit_room_cost', ?, ?, (SELECT credit FROM credit_account WHERE uid = ?), '房间水费')`)
      .run(room.owner_uid, room_id, -creditCost, 0, room.owner_uid);

    // 代理返佣
    db.prepare("UPDATE commission_account SET commission = commission + ?, total_commission = total_commission + ?, updated_at = datetime('now') WHERE uid = ?").run(agentCommission, agentCommission, room.owner_uid);
    db.prepare(`INSERT INTO chip_transactions (uid, room_id, type, amount, balance_before, balance_after, display_tag)
      VALUES (?, ?, 'commission_add', ?, ?, (SELECT commission FROM commission_account WHERE uid = ?), '代理返佣')`)
      .run(room.owner_uid, room_id, agentCommission, 0, room.owner_uid);

    // 总代理返佣
    const owner = db.prepare("SELECT parent_agent_id FROM users WHERE uid = ?").get(room.owner_uid);
    if (owner && owner.parent_agent_id) {
      const topAgent = db.prepare("SELECT uid FROM users WHERE uid = ? AND user_type = 'top_agent'").get(owner.parent_agent_id);
      if (topAgent) {
        db.prepare("UPDATE commission_account SET commission = commission + ?, total_commission = total_commission + ?, updated_at = datetime('now') WHERE uid = ?").run(topAgentCommission, topAgentCommission, topAgent.uid);
        db.prepare(`INSERT INTO chip_transactions (uid, room_id, type, amount, balance_before, balance_after, display_tag)
          VALUES (?, ?, 'commission_add', ?, ?, (SELECT commission FROM commission_account WHERE uid = ?), '总代理返佣')`)
          .run(topAgent.uid, room_id, topAgentCommission, 0, topAgent.uid);
      }
    }
  }

  res.json({
    code: 20000,
    data: {
      rake, credit_cost: creditCost,
      agent_commission: agentCommission, top_agent_commission: topAgentCommission,
      platform_net: platformNet
    }
  });
});

// 房间结算（25局结束或提前结算）
router.post("/game/room_settle", auth, (req, res) => {
  const { room_id } = req.body;
  const room = db.prepare("SELECT * FROM rooms WHERE id = ?").get(room_id);
  if (!room) return res.json({ code: 40051, msg: "房间不存在" });

  const rakeRate = getConfig("platform_rake_rate") / 100;
  const agentDeductRate = getConfig("agent_deduct_rate") / 100;
  const agentCommissionRate = getConfig("agent_commission_rate") / 100;
  const topAgentCommissionRate = getConfig("top_agent_commission_rate") / 100;

  const totalRake = Math.floor(room.total_flow * rakeRate);
  const creditCost = Math.floor(room.total_flow * agentDeductRate);
  const agentCommission = Math.floor(room.total_flow * agentCommissionRate);

  let topAgentCommission = 0;
  const owner = db.prepare("SELECT parent_agent_id FROM users WHERE uid = ?").get(room.owner_uid);
  if (owner && owner.parent_agent_id) {
    topAgentCommission = Math.floor(room.total_flow * topAgentCommissionRate);
  }
  const platformNet = totalRake - agentCommission - topAgentCommission;

  // 更新房间
  db.prepare(`UPDATE rooms SET status = 'closed', total_rake = ?, agent_credit_cost = ?,
    agent_commission = ?, top_agent_commission = ?, platform_net = ?, ended_at = datetime('now')
    WHERE id = ?`).run(totalRake, creditCost, agentCommission, topAgentCommission, platformNet, room_id);

  // 写入对账记录
  db.prepare(`INSERT INTO settlement_records (room_id, game_type, owner_uid, total_flow, total_rake,
    credit_cost, agent_commission, top_agent_commission, platform_net)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
    room_id, room.game_type, room.owner_uid, room.total_flow,
    totalRake, creditCost, agentCommission, topAgentCommission, platformNet
  );

  res.json({
    code: 20000,
    data: {
      total_flow: room.total_flow, total_rake: totalRake,
      credit_cost: creditCost, agent_commission: agentCommission,
      top_agent_commission: topAgentCommission, platform_net: platformNet
    }
  });
});

function getConfig(key) {
  const row = db.prepare("SELECT value FROM system_config WHERE key = ?").get(key);
  return row ? parseFloat(row.value) : 0;
}

module.exports = router;
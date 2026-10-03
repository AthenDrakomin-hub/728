import { users, adminUsers, gameConfigs, systemConfig } from "./schema.js";
import { hashPassword } from "../lib/auth.js";

function now() {
  return Math.floor(Date.now() / 1000);
}

function seed() {
  console.log("Seeding...");

  const adminExists = adminUsers.findFirst((u) => u.account === "admin");
  if (!adminExists) {
    adminUsers.insert({
      account: "admin",
      password: hashPassword("123456"),
      name: "超级管理员",
      role: "admin",
      createdAt: now(),
      lastLoginAt: null,
    });
    console.log("Admin created: admin / 123456");
  }

  const testUser = users.findFirst((u) => u.account === "test001");
  if (!testUser) {
    users.insert({
      account: "test001",
      password: hashPassword("123456"),
      securityCode: "1234",
      nickname: "测试玩家",
      avatar: "",
      headFrame: "",
      gold: 100000,
      bankGold: 50000,
      rcard: 0,
      status: 1,
      role: "player",
      agentPower: 0,
      power: 0,
      control: 0,
      controlGold: 0,
      monthlyEnd: 0,
      income: 0,
      expenditure: 0,
      inviteCode: "A00001",
      invitedById: null,
      invitedByCode: null,
      deviceId: "",
      lastLoginAt: 0,
      lastLoginIp: "",
      createdAt: now(),
    });
    console.log("Test user created: test001 / 123456");
  }

  const games = [
    { gameType: "ZJH", name: "炸金花", baseScore: 1, minEntry: 1000 },
    { gameType: "DZPK", name: "德州扑克", baseScore: 1, minEntry: 2000 },
    { gameType: "QZNN", name: "抢庄牛牛", baseScore: 1, minEntry: 1000 },
    { gameType: "BRNN", name: "百人牛牛", baseScore: 1, minEntry: 100 },
    { gameType: "SRNN", name: "三人牛牛", baseScore: 1, minEntry: 1000 },
    { gameType: "ERNN", name: "二人牛牛", baseScore: 1, minEntry: 1000 },
    { gameType: "TBNN", name: "通比牛牛", baseScore: 1, minEntry: 1000 },
    { gameType: "JCBY", name: "金蝉捕鱼", baseScore: 1, minEntry: 1000 },
    { gameType: "BCBM", name: "奔驰宝马", baseScore: 1, minEntry: 1000 },
    { gameType: "LHD", name: "龙虎斗", baseScore: 1, minEntry: 1000 },
    { gameType: "BJL", name: "百家乐", baseScore: 1, minEntry: 1000 },
    { gameType: "MJHJ", name: "麻将胡了", baseScore: 1, minEntry: 1000 },
    { gameType: "WZMJ", name: "温州麻将", baseScore: 1, minEntry: 1000 },
  ];
  for (const g of games) {
    const exists = gameConfigs.findFirst((c) => c.gameType === g.gameType);
    if (!exists) {
      gameConfigs.insert({
        gameType: g.gameType,
        name: g.name,
        baseScore: g.baseScore,
        minEntry: g.minEntry,
        enabled: true,
        maintenance: false,
        rule: {},
        updatedAt: now(),
      });
    }
  }
  console.log("Game configs seeded.");

  const configs = [
    ["platform_rake_rate", "3"],
    ["agent_deduct_rate", "2"],
    ["agent_commission_rate", "1"],
    ["top_agent_commission_rate", "1"],
    ["benefit_amount", "5000"],
    ["benefit_min_gold", "1000"],
  ];
  for (const [k, v] of configs) {
    if (!systemConfig.findFirst((c) => c.key === k)) {
      systemConfig.insert({ key: k, value: v, updatedAt: now() });
    }
  }

  console.log("Seed done.");
}

seed();

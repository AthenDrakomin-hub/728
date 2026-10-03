# 728 二开平台 v2

基于 V-poker-2.0 服务端 + 728 逆向产物的信用分代理制棋牌平台。

## 当前状态

| 模块 | 状态 | 说明 |
|------|------|------|
| **服务端 (server/)** | ✅ 运行中 | Express + PostgreSQL + Socket.io，端口 3001 |
| **数据库** | ✅ 已初始化 | PostgreSQL `vpoker728`，11 张表，seed 数据已生成 |
| **前端参考 (client/web-vpoker/)** | ✅ 就绪 | Next.js 源码，可作 Telegram Mini App 基础 |
| **Cocos 客户端改造** | ⏳ 待开始 | 需 Cocos Creator 2.4.x 环境 |
| **后台管理改造** | ⏳ 待开始 | Vue2 原版前端改造 |
| **25款游戏抽水 Hook** | ⏳ 待开始 | 每款游戏结算处插入 3% 抽水逻辑 |

---

## 快速启动

### 1. 启动服务端（已有数据库）
```powershell
cd 728_platform_v2/server
npx tsx src/index.ts
# 服务启动在 http://localhost:3001
```

### 2. 默认账号
| 角色 | 账号 | 密码 |
|------|------|------|
| 超级管理员 | admin | admin888 |
| 测试代理 | agent001 | 123456 |
| 测试玩家 | player001 | 123456 |

### 3. 验证 API
```powershell
# 健康检查
curl http://localhost:3001/api/health

# 登录
curl -X POST http://localhost:3001/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"account":"admin","password":"admin888"}'
```

---

## 数据库 Schema

共 11 张表，核心表：

| 表名 | 说明 |
|------|------|
| `users` | 用户（含筹码 points、信用分 credit、返佣 commission）|
| `rooms` | 房间（房号、密码、游戏类型、场次、流水统计）|
| `room_players` | 座位（筹码、观战状态、准备状态）|
| `game_rounds` | 每局结果（牌面、赢家、抽水）|
| `hand_states` | 当前牌局状态（JSONB）|
| `chip_transactions` | 筹码变动审计 |
| `credit_transactions` | 信用分变动审计 |
| `deduction_records` | 房间结算扣费记录 |
| `system_config` | 全局配置（抽水比例、返佣比例等）|
| `devices` | 设备关联 |
| `room_messages` | 房间聊天消息 |

---

## 经济模型

- **抽水**：每局从赢家盈利扣 3%（`platform_rake_rate`，可配置）
- **水费**：房间结束扣代理信用分 2% 流水（`agent_deduct_rate`）
- **代理返佣**：流水 × 1%（从抽水中支付）
- **总代理返佣**：下线代理流水 × 1%（从抽水中支付）
- **平台净收入** = 总抽水 - 代理返佣 - 总代理返佣

---

## 项目结构

```
728_platform_v2/
├── server/                    # Express + Socket.io API 服务（已运行）
│   ├── src/
│   │   ├── db/schema.ts       # Drizzle ORM 表定义
│   │   ├── lib/               # 业务逻辑（settle/auth/config/engines...）
│   │   ├── routes/            # API 路由（auth/admin/agent/rooms/profile）
│   │   ├── socket/            # WebSocket 房间通信
│   │   └── index.ts           # 入口
│   ├── migrations/            # SQL 增量迁移
│   └── .env                   # 环境变量（已配置）
├── client/
│   └── web-vpoker/            # V-poker Next.js 前端（参考用）
├── admin/                     # 待改造：Vue2 后台管理
├── database/
│   └── init.sql               # 数据库初始化脚本
└── tg-mini-app/               # 待开发：Telegram Mini App
```

---

## 下一步

1. **后台管理改造** — 在现有 Vue2 源码基础上增加信用分/返佣/对账模块
2. **Cocos 客户端大厅改造** — 安装 Cocos Creator 2.4.x，接入邀请码+信用分 UI
3. **游戏抽水 Hook** — 逐款修改 25 款游戏的结算函数
4. **Telegram Mini App** — 复用 web-vpoker 前端，对接 Telegram SDK

*启动时间：2026-08-18*

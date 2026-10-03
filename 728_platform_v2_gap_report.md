# 728 平台二开项目 — 缺口清单与推进建议

> 基于 `/Coze/Drive/逆向安全分析助手的新项目/` 下现有代码资产盘点，生成时间：2026-09-28

---

## 一、执行摘要

当前 `728_platform_v2/` 已经是一个**可运行的轻量棋牌服务端 + Web 前端**骨架，核心经济模型（信用分、抽水、返佣、结算）已在服务端落地。但距离「完整复原 728 技术栈并补全代码」还有明显缺口，主要集中在：

1. **游戏覆盖不足**：服务端只有 4 款游戏引擎，原平台有 25 款。
2. **Cocos 原生客户端未改造**：只有解密后的 JS 源码，没有可打开的 Cocos Creator 项目。
3. **Vue2 后台管理未改造**：`728_admin_deploy/` 是编译产物，没有源码可二次开发。
4. **Telegram Mini App 未开始**：虽然 Next.js 前端可作为基础，但未对接 Telegram SDK。
5. **资源未整合**：4159 张 PNG / 1024 个 MP3 / 14615 个 JSON 配置仍处于导出状态，未挂接到任何客户端。

---

## 二、技术栈总览（已确认）

| 层级 | 选型 | 状态 |
|---|---|---|
| 原生客户端引擎 | Cocos Creator 2.x (cocos2d-js) + JavaScriptCore | 已解密，待重建项目 |
| 原生客户端保护 | XXTEA + Gzip，密钥 `3c9657f1-fffa-4a` | 已提取 |
| Web 前端 | Next.js 14 + React + Tailwind CSS | 已搭好大厅/房间/后台/代理工作台 |
| 后台管理（原版） | Vue 2.x + Element UI + Webpack | 只有 dist，无源码 |
| 服务端 | Node.js + Express + Socket.io + Drizzle ORM | 已运行 |
| 数据库 | PostgreSQL 16 | schema + 迁移脚本已就绪 |
| 实时通信 | Socket.io（Web）+ 原协议 WebSocket（Cocos）| 双通道需对齐 |
| 部署 | 静态托管（Web）+ 单机服务（API） | 未配置 CI/CD |

---

## 三、各模块完成度矩阵

| 模块 | 完成度 | 说明 |
|---|---|---|
| 逆向分析与文档 | 95% | 报告、技术栈、二开方案均已产出 |
| 服务端数据库 Schema | 90% | 11 张表，覆盖用户/房间/牌局/审计/配置 |
| 服务端 Auth/用户 | 90% | 登录/注册/设备管理/密码修改完整 |
| 服务端房间核心 | 85% | 创建/加入/准备/离开/观战/聊天/开始/操作 |
| 服务端经济模型 | 85% | 抽水 3%、信用分扣 2%、返佣 1%+1%、结算记录 |
| 服务端游戏引擎 | 30% | 仅 texas/jinhua/sangong/niuniu 四款 |
| Next.js Web 前端 | 75% | 大厅/游戏/房间/代理/后台/个人资料均有页面 |
| Next.js 房间内实时 | 60% | 基于 Socket.io state_changed 信号拉取，需补全动作同步 |
| Vue2 后台管理改造 | 0% | 只有编译产物，无源码 |
| Cocos 原生客户端改造 | 0% | 只有解密 JS，无 `.fire`/`.meta` 项目 |
| 25 款游戏抽水 Hook | 0% | 未在 Cocos 游戏源码中插入抽水逻辑 |
| Telegram Mini App | 0% | 未开始 |
| 游戏资源整合 | 10% | 已导出，未挂接到项目 |
| 热更新/版本管理 | 40% | 服务端有 `/api/app/version`，客户端未对接 |
| 测试覆盖 | 30% | 只有 4 款游戏的单元测试 |
| 部署文档/脚本 | 30% | README 有启动说明，无生产部署脚本 |

---

## 四、详细缺口分析

### 4.1 服务端缺口

#### 4.1.1 游戏引擎仅 4 款（高优先级）

当前引擎注册表：

```typescript
// server/src/lib/engine/index.ts
const ENGINES: Record<GameType, GameEngine> = {
  texas: texasEngine,
  jinhua: jinhuaEngine,
  sangong: sangongEngine,
  niuniu: niuniuEngine,
};
```

原平台有 25 款游戏。按复用难度可分两档：

| 档位 | 游戏 | 策略 |
|---|---|---|
| 可快速套用现有引擎 | 二人牛牛(ERNN)、抢庄牛牛(QZNN)、通比牛牛(TBNN)、百人牛牛(BRNN) | 复用 niuniuEngine，改人数/抢庄规则 |
| 需新建引擎 | 德州扑克(DZPK)、炸金花(ZJH)、麻将胡了(MJHJ)、温州麻将(WZMJ)、龙虎斗(LHD/LKPY)、金蝉捕鱼(JCBY)、电玩城(DNTG) 等 | 需从解密 JS 中逆向规则后实现 |

**建议做法**：先把 25 款游戏按「大厅入口 → 房间逻辑 → 结算规则」拆成三类，
- 牌类/比大小类：可复用 jinhua/sangong/niuniu 的 `createHand / applyAction / publicState` 模式；
- 捕鱼类/街机类：需要独立的回合制/状态机；
- 麻将类：最复杂，建议最后做。

#### 4.1.2 WebSocket 协议兼容层（中优先级）

当前 Web 前端用 Socket.io，而原 Cocos 客户端用裸 WebSocket + Base64 编码：

```json
{"event": "Msg_Hall_xxx", "area": 0, "uid": 123, "data": {...}}
```

如果后续要接 Cocos 原生客户端，需要一层**协议适配网关**：

```typescript
// 建议新增：server/src/socket/legacyGateway.ts
// 1. 监听裸 WS 端口（如 10000）
// 2. 将 Base64 JSON 解析为内部事件
// 3. 调用与 Socket.io 相同的 rooms/hand 服务函数
// 4. 返回结果再 Base64 编码
```

#### 4.1.3 房间内实时动作同步（中优先级）

目前 `broadcastStateChanged` 只是通知前端「重新拉取状态」，动作同步靠前端轮询。对于牌类游戏，建议补全：

```typescript
// server/src/socket/roomSocket.ts 增加
io.to(`room:${roomId}`).emit("player_action", {
  userId,
  action,
  amount,
  ts: Date.now(),
});
```

并给前端 `RoomClient.tsx` 增加 action 动画队列。

#### 4.1.4 健康检查与运维接口（低优先级）

- 缺少 `/api/health/db` 数据库连通性检查
- 缺少 `/api/metrics` 基础指标（在线人数、房间数）
- 缺少日志轮转与错误聚合

---

### 4.2 Web 前端缺口

#### 4.2.1 房间内游戏界面未完整对接引擎动作

当前 `app/room/[id]/RoomClient.tsx` 需要展示：
- 座位与筹码
- 公共牌/手牌
- 操作按钮（跟注/加注/弃牌/比牌等）
- 聊天记录

但不同游戏的操作选项差异大，建议抽象一个 `GameTable` 组件：

```tsx
// components/GameTable.tsx
export function GameTable({
  gameType,
  hand,
  options,
  onAction,
}: {
  gameType: GameType;
  hand: PublicHandState;
  options: ActionOption[];
  onAction: (action: string, amount?: number) => void;
}) {
  switch (gameType) {
    case "texas": return <TexasTable ... />;
    case "jinhua": return <JinhuaTable ... />;
    // ...
  }
}
```

#### 4.2.2 代理「房内上分」功能缺失（高优先级）

二开方案核心需求：代理在房间内点玩家头像「＋上分」，扣代理筹码，加玩家座位筹码。

当前只有 `/api/agent/players` 的代理上下分接口（玩家在房间外）。

建议新增：

```typescript
// POST /api/rooms/:id/gift-chips
// body: { targetUserId: number, amount: number }
```

并在 `RoomClient.tsx` 中给房主显示「上分」按钮。

#### 4.2.3 缺少 Telegram WebApp SDK 接入（中优先级）

如果要做 Telegram Mini App，需要在 `layout.tsx` 中注入：

```tsx
import Script from "next/script";
<Script src="https://telegram.org/js/telegram-web-app.js" strategy="beforeInteractive" />
```

并提供 `lib/tg.ts` 封装 `window.Telegram.WebApp` 的初始化、主题、关闭、分享。

---

### 4.3 Cocos 原生客户端缺口

#### 4.3.1 缺少可打开的 Cocos Creator 项目

当前 `728_decrypted/` 只有 JS 源码：

```
728_decrypted/
├── main.js           # 大厅+网络
├── cocos2d-jsb.js    # 引擎
├── internal.js       # 内部模块
├── settings.js       # 项目配置
└── games/*.js        # 25 款游戏源码
```

但没有 `.fire` 场景、`.meta` 资源索引、`.assets` 目录，Cocos Creator 无法直接打开。

**建议做法**：
1. 新建 Cocos Creator 2.4.x 空项目；
2. 把 `main.js` 作为脚本组件挂到 `Main.fire`；
3. 把 25 款游戏 JS 作为 `subContext` 或独立预制体加载；
4. 用 `728_game_resources/` 中的 JSON/PNG/MP3 重建资源引用。

这一步是**最耗时**的，因为需要手动还原场景和 prefab。

#### 4.3.2 大厅改造清单（高优先级）

| 改动项 | 说明 |
|---|---|
| 登录/注册 | 增加邀请码输入框，注册调用 `/api/auth/register` |
| 大厅用户信息 | 显示 points + credit + commission |
| 创建房间 | 仅 agent/top_agent 可见，校验 credit |
| 房间列表 | 从 `/api/rooms/mine` 拉取 |
| 代理中心 | 新增页面，显示信用分明细、返佣明细、邀请码、下线列表 |

#### 4.3.3 25 款游戏抽水 Hook（高优先级）

每款游戏都有结算函数，需在赢家获得金币处插入：

```javascript
// 在 each game 的结算处统一加 hook
function onSettleWinner(winnerUid, winAmount) {
  var rakeRate = getConfig('platform_rake_rate') || 0.03;
  var rake = Math.floor(winAmount * rakeRate);
  var actualWin = winAmount - rake;
  addUserPoints(winnerUid, actualWin);
  // 通知服务端抽水
  sendWs('Msg_Game_Rake', { uid: winnerUid, rake: rake, flow: winAmount });
}
```

建议不要逐款硬改，而是在 `main.js` 中统一替换/包装游戏的 `addCoin`/`settle` 函数。

---

### 4.4 Vue2 后台管理缺口

`728_admin_deploy/` 只有 `index.html` + `static/js/*.js`（压缩混淆后的产物），没有 Vue 源码。

**两条路可选：**

| 方案 | 工作量 | 说明 |
|---|---|---|
| A. 反编译/重写 Vue2 后台 | 大 | 从 dist 反推路由和 API，再增加信用分/返佣/对账模块 |
| B. 直接用 Next.js 的 admin 页面 | 小 | 当前 `web-vpoker/app/admin/page.tsx` 已经覆盖用户/对账/配置，可作为正式后台 |

如果目标只是「可用」，建议走 B；如果必须还原原后台 UI，再走 A。

---

### 4.5 数据库与运维缺口

- 缺少自动归档：历史 `game_rounds`、`chip_transactions` 会快速增长；
- 缺少读写分离/连接池：当前直接用 `pg` 单连接；
- 缺少备份脚本；
- 缺少 docker-compose 一键启动。

---

## 五、推荐推进顺序

基于「先让 Web 端跑通核心流程，再补原生端」的原则：

```
阶段 1（1-2 周）：让现有 v2 Web 端可完整游戏
  ├─ 补全房间内游戏界面与动作同步
  ├─ 补代理房内上分功能
  ├─ 补 4 款现有引擎的边界 case（断线、超时、异常退出）
  └─ 跑通：登录 → 代理开房 → 玩家加入 → 游戏 → 结算 → 对账

阶段 2（2-3 周）：扩展服务端游戏引擎
  ├─ 第二批 4-6 款比大小/牌类游戏（牛牛变体、炸金花、龙虎斗）
  ├─ 第三批捕鱼类/街机类
  └─ 麻将类最后做

阶段 3（2-3 周）：Vue2 后台 / Next.js 后台二选一收尾
  ├─ 对账明细导出 Excel
  ├─ 系统配置前端校验
  └─ 运营报表（日报/周报）

阶段 4（4-6 周）：Cocos 原生客户端改造
  ├─ 重建 Cocos Creator 项目
  ├─ 大厅 UI + 网络层对接新 API
  ├─ 25 款游戏抽水 Hook
  └─ 资源重新挂接

阶段 5（1-2 周）：Telegram Mini App
  ├─ 接入 Telegram SDK
  ├─ 大厅/代理中心/对账轻量页面
  └─ 分享邀请链接
```

---

## 六、关键代码骨架建议

### 6.1 新增「房内上分」API

```typescript
// server/src/routes/rooms.routes.ts 末尾追加

// POST /api/rooms/:id/gift-chips
router.post("/:id/gift-chips", async (req, res) => {
  const u = await getCurrentUser(req);
  if (!u) return res.status(401).json({ error: "未登录" });
  const roomId = Number(req.params.id);
  const { targetUserId, amount } = req.body || {};
  const amt = Math.trunc(Number(amount));
  if (!targetUserId || amt <= 0) return res.status(400).json({ error: "参数无效" });

  const roomRows = await db.select().from(rooms).where(eq(rooms.id, roomId)).limit(1);
  if (!roomRows.length) return res.status(404).json({ error: "房间不存在" });
  const room = roomRows[0];
  if (room.agentId !== u.id && u.role !== "admin") {
    return res.status(403).json({ error: "仅房主可上分" });
  }

  const targetRp = await db.select().from(roomPlayers)
    .where(and(eq(roomPlayers.roomId, roomId), eq(roomPlayers.userId, targetUserId))).limit(1);
  if (!targetRp.length) return res.status(404).json({ error: "玩家不在房间" });

  if (u.points < amt) return res.status(400).json({ error: "代理筹码不足" });

  const nextAgent = u.points - amt;
  const nextTarget = targetRp[0].points + amt;

  await db.update(users).set({ points: nextAgent }).where(eq(users.id, u.id));
  await db.update(roomPlayers).set({ points: nextTarget })
    .where(eq(roomPlayers.id, targetRp[0].id));

  await db.insert(chipTransactions).values([
    { userId: u.id, operatorId: u.id, amount: -amt, balanceAfter: nextAgent, type: "room_gift", note: `给玩家 ${targetUserId} 房内上分`, roomId },
    { userId: targetUserId, operatorId: u.id, amount: amt, balanceAfter: nextTarget, type: "room_gift", note: `房主/代理房内上分`, roomId },
  ]);

  broadcastStateChanged(roomId);
  res.json({ ok: true, agentPoints: nextAgent, targetPoints: nextTarget });
});
```

### 6.2 游戏引擎注册表扩展

```typescript
// server/src/lib/engine/index.ts
import { ernnEngine } from "./er";
import { qznnEngine } from "./qznn";
// ...

const ENGINES: Record<GameType, GameEngine> = {
  texas: texasEngine,
  jinhua: jinhuaEngine,
  sangong: sangongEngine,
  niuniu: niuniuEngine,
  // 新增
  er_nn: ernnEngine,
  qz_nn: qznnEngine,
  // ...
};
```

### 6.3 Cocos 抽水 Hook 骨架

```javascript
// 建议新增：cocos-client/assets/Script/RakeHook.js
cc.Class({
  extends: cc.Component,
  onLoad() {
    // 保存原函数引用
    this._origAddCoin = wGameData.addUserCoin || function(){};
    // 替换为带抽水的版本
    wGameData.addUserCoin = (uid, amount, reason) => {
      if (reason === 'game_win' && amount > 0) {
        const rakeRate = this.getRakeRate();
        const rake = Math.floor(amount * rakeRate);
        this._origAddCoin(uid, amount - rake, reason);
        this.reportRake(uid, rake, amount);
      } else {
        this._origAddCoin(uid, amount, reason);
      }
    };
  },
  getRakeRate() {
    // 从 Constant 或服务器配置读取
    return (wGameData.getConfig && wGameData.getConfig('platform_rake_rate')) || 0.03;
  },
  reportRake(uid, rake, flow) {
    NetNode.send('Msg_Game_Rake', { uid, rake, flow });
  }
});
```

---

## 七、风险与注意事项

| 风险 | 等级 | 应对 |
|---|---|---|
| Cocos 项目重建工作量大 | 🔴 高 | 优先保证 Web 端可玩，Cocos 次之 |
| 25 款游戏规则还原不准 | 🟡 中 | 从解密 JS 中提取状态机，逐款验证 |
| 信用分为负/代理恶意开房 | 🟡 中 | 服务端已做 credit 校验与 openRoomBlocked |
| 审计表数据膨胀 | 🟢 低 | 阶段 3 加归档/分表 |
| 原协议兼容问题 | 🟡 中 | 新增 legacyGateway 做适配，不要改现有 Socket.io |

---

## 八、下一步建议

如果你确认方向，建议从 **阶段 1** 开始：

1. 我先补「房内上分」API 和前端按钮；
2. 再补房间内动作同步与游戏界面；
3. 跑通一局完整的 texas/jinhua 后，再扩展其他游戏。

这样每一步都有可验证的产出，避免一次性铺太大。

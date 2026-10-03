# 728 棋牌平台 — 完整还原方案

> 目标：基于已有逆向资产，1:1 重建可运行的原版 728 平台（Cocos 客户端 + 原生服务端 + 后台管理）
> 生成时间：2026-10-01

---

## 一、还原范围定义

「完整还原」包含三条主线：

| 主线 | 交付物 | 说明 |
|---|---|---|
| 原生客户端 | 可打包的 Cocos Creator 2.x 工程 | 支持 Android/iOS/H5，含 25 款游戏大厅 |
| 原生服务端 | 兼容原协议的 API + WebSocket 服务 | 复刻原 HTTP 8000 端口 + WS 10000 端口行为 |
| 后台管理 | 可运行的原版后台系统 | 优先复用 `728_admin_deploy` dist，按需补 Mock/真接口 |

> 不还原内容：原平台线上域名、真实用户数据、支付渠道（微信支付/支付宝）接法只做接口占位。

---

## 二、已有资产盘点

### 2.1 客户端资产

```
728_decrypted/
├── settings.js              # Cocos 项目配置，启动场景 Main.fire
├── cocos2d-jsb.js           # 引擎源码 1.8MB
├── physics.js               # 物理引擎
├── internal.js              # 内部模块
├── main.js                  # 大厅/网络/登录/支付 429KB
└── games/                   # 25 款游戏源码
    ├── BCBM.js  BJL.js  BRNN.js  DFDC.js  DNTG.js
    ├── DZPK.js  ERNN.js  ERQS.js  FQZS.js  HBSL.js
    ├── HLWZ.js  HLZZ.js  JCBY.js  JXLW.js  LHD.js
    ├── LKPY.js  MJHJ.js  QZNN.js  SDB.js   SHZ.js
    ├── SLWH.js  SRNN.js  TBNN.js  WZMJ.js  ZJH.js
```

### 2.2 游戏资源

```
728_game_resources/
├── {25_game}/
│   ├── import/              # JSON 配置（场景、预制体、动画）
│   └── native/              # PNG、MP3、Plist 等原始资源
```

### 2.3 后台管理

```
728_admin_deploy/
├── index.html
├── favicon.ico
├── mock_server.py           # 已有一个 Python Mock 服务
└── static/
    ├── css/*.css
    └── js/*.js              # Vue2 + Element UI 编译产物
```

### 2.4 协议与密钥

- XXTEA 密钥：`3c9657f1-fffa-4a`
- 原服务端：`70.39.180.192:8000(HTTP) / :10000(WS)`
- HTTP Body：`data={JSON}`，`Content-Type: application/x-www-form-urlencoded`
- WebSocket：JSON → Base64
- 后台登录：`POST /terrace/login` (admin/123456)

---

## 三、技术栈

| 层级 | 原版技术 | 还原方案 |
|---|---|---|
| 客户端引擎 | Cocos Creator 2.x (cocos2d-js) | Cocos Creator 2.4.x |
| 脚本语言 | JavaScript (ES5/bundled) | 复用解密 JS，必要时转 TypeScript |
| 原生桥接 | JavaScriptCore + JNI (Android) / JSB (iOS) | Cocos Creator JSB 原生构建 |
| 网络 | HTTP + 裸 WebSocket | Node.js + Express + `ws` |
| 服务端语言 | 原版疑似 PHP（从 URL 风格推断） | 用 Node.js 重写，兼容原协议 |
| 数据库 | 原版疑似 MySQL | PostgreSQL（已有 v2 schema，可兼容扩展） |
| 后台前端 | Vue2 + Element UI | 直接复用 dist，接口用 Mock → 真接口过渡 |
| 资源加密 | XXTEA + Gzip | 保留加密打包流程，用于发布 |

---

## 四、分阶段实施计划

### 阶段 0：环境准备与资产整理（1-2 天）

**目标**：让代码能在当前环境被版本控制、搜索、批量处理。

| 任务 | 输出 |
|---|---|
| 建立还原项目根目录 `728_original/` | 目录结构 |
| 复制 `728_decrypted/` → `728_original/client/src-decrypted/` | 可搜索源码 |
| 复制 `728_game_resources/` → `728_original/client/assets/` | 资源目录 |
| 复制 `728_admin_deploy/` → `728_original/admin/web/` | 后台 dist |
| 创建 `728_original/server/` Node.js 项目骨架 | package.json / tsconfig |
| 编写 `tools/` 脚本：批量解密/加密、资源索引生成、代码格式化 | Python/Node 脚本 |

### 阶段 1：服务端协议复刻（2-3 周）

**目标**：让解密后的客户端不改动或少量改动就能连上还原服务端。

#### 1.1 HTTP 接口层（端口 8000）

根据报告已知接口与 URL 推导规则实现：

| 原消息 | URL | 说明 |
|---|---|---|
| `Msg_User_Login` | `POST /Login` | 账号密码登录 |
| `Msg_User_register` | `POST /register` | 注册 |
| `Msg_User_ChangePassword` | `POST /ChangePassword` | 改密 |
| `Msg_User_forgeBank` | `POST /forgeBank` | 忘记密码 |
| `Msg_User_upgrade` | `POST /upgrade` | 升级/代理 |
| `Msg_User_VerificationCode` | `POST /VerificationCode` | 验证码 |
| 游戏内 HTTP | `POST /{game}/...` | 从 main.js 中逆向补全 |

**Body 解析：**

```typescript
// server/src/middleware/formDataParser.ts
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  if (req.body.data) {
    try { req.body = JSON.parse(req.body.data); } catch {}
  }
  next();
});
```

#### 1.2 WebSocket 大厅层（端口 10000）

```typescript
// server/src/legacyWs.ts
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 10000 });

wss.on("connection", (ws) => {
  ws.on("message", (raw) => {
    const decoded = JSON.parse(Buffer.from(raw.toString(), "base64").toString());
    const { event, data, uid } = decoded;
    handleLegacyMessage(ws, event, data, uid);
  });
});
```

**必须实现的消息：**

- `Msg_Hall_Connect` — 连接大厅，校验 token，返回用户信息
- `Msg_Hall_Heart` — 心跳，每 5 秒
- `Msg_Hall_EnterRoom` — 进入房间
- `Msg_Hall_GameStatus` — 游戏状态同步
- `Msg_Hall_ChangeGolds` — 金币变动推送
- `Msg_Hall_BanUser` — 封禁通知
- `Msg_Hall_QueryAgentList` — 代理列表
- `Msg_Hall_GetBenefits` — 救济金
- `Msg_Hall_ERROR` — 错误通知
- 各游戏 `Msg_{GAME}_{Action}` — 逐款逆向

#### 1.3 数据库兼容层

复用 `728_platform_v2/server/src/db/schema.ts`，但字段名需要对照原客户端读取的 key：

| 客户端读取 | v2 字段 | 说明 |
|---|---|---|
| `gold` | `points` | 身上金币 |
| `bank` | 待加 | 银行金币 |
| `uid` | `id` | 用户 ID |
| `headimgurl` | `avatar` | 头像 |
| `agentPower` | `role` + `agent` 字段 | 代理权限 |
| `power` | 待加 | 控分权限 |

**新增表：**

- `user_banks` — 银行存取
- `game_configs` — 25 款游戏配置（底注、限红、抽水）
- `control_records` — 控制/放水记录
- `benefits` — 救济金领取记录

### 阶段 2：Cocos 客户端重建（4-6 周）

#### 2.1 新建 Cocos Creator 2.4.x 项目

```
728_original/client/cocos-project/
├── assets/
│   ├── Scene/
│   │   └── Main.fire           # 从 settings.js 还原启动场景
│   ├── Script/
│   │   ├── main.js             # 解密后的主 bundle
│   │   ├── games/              # 25 款游戏脚本
│   │   └── _plugs/             # base64、fixed-render-flow
│   └── resources/
│       └── {games}/             # 对应 728_game_resources
├── build/
└── settings/
```

#### 2.2 资源重建策略

Cocos Creator 2.4 的资源依赖 `.meta` 文件和 `import` 目录下的 UUID 命名文件。当前资源已按 UUID 分目录存放，需要：

1. 编写脚本扫描 `import/` 下所有 JSON，提取 UUID 与类型；
2. 为每个资源文件生成 `.meta`（UUID 不变）；
3. 把 `native/` 下文件按 UUID 映射复制到 `assets/resources/`；
4. 在 Cocos 编辑器中批量重新关联。

**工具脚本草稿：**

```python
# tools/rebuild_assets.py
import json, os, shutil, uuid

ASSET_ROOT = "../client/cocos-project/assets/resources"
for game in os.listdir("../client/assets"):
    src_import = f"../client/assets/{game}/import"
    src_native = f"../client/assets/{game}/native"
    dst = f"{ASSET_ROOT}/{game}"
    for root, _, files in os.walk(src_import):
        for f in files:
            if not f.endswith(".json"): continue
            meta_path = os.path.join(root, f)
            with open(meta_path) as fp:
                meta = json.load(fp)
            # 根据 meta 类型生成 .meta 并复制 native
            ...
```

#### 2.3 大厅脚本接入

`main.js` 中核心全局对象：

- `wGEvent` — 事件总线
- `wNetWork` — 网络层
- `wGameData` — 全局数据
- `wUtils` — 工具函数
- `wUIManager` — UI 管理
- `wAudioMgr` — 音频

需要确保这些全局对象在 Cocos 启动时被正确初始化。解密后的 `main.js` 已经是一个完整 bundle，大概率可以直接挂到 `Main.fire` 的 Canvas 节点上运行。

#### 2.4 游戏脚本接入

每款游戏 bundle 结构类似：

```javascript
// games/ZJH.js
window.__require({...}, {
  ZJH_Controlle: [...],
  ZJH_DataMgr: [...],
  ZJH_View: [...],
  ZJH_PokerBase: [...],
  // ...
}, ["ZJH_Controlle"]);
```

接入方式：

1. 把 `games/{GAME}.js` 作为独立脚本放入 `assets/Script/games/{GAME}/`；
2. 创建对应的游戏入口 prefab / scene；
3. 在大厅点击游戏图标时动态加载该脚本：`cc.loader.loadRes("games/ZJH", cc.RawAsset, ...)`。

### 阶段 3：后台管理系统复刻（1-2 周）

#### 3.1 短期：直接部署 dist + Mock

`728_admin_deploy/` 已经可以直接用 Python 起服务：

```bash
cd 728_admin_deploy
python3 mock_server.py
```

访问 `http://localhost:9999`，账号 admin/123456。

#### 3.2 中期：把 Mock API 接到真实数据库

保留 dist，重写 `/terrace/*` 接口：

| 接口 | 功能 |
|---|---|
| `POST /terrace/login` | 后台登录 |
| `GET /terrace/mainpage` | 首页运营数据 |
| `GET /terrace/users` | 用户列表 |
| `GET /terrace/agents` | 代理列表 |
| `POST /terrace/user/ban` | 封禁/解封 |
| `POST /terrace/gold/adjust` | 金币调整 |
| `GET /terrace/games/config` | 游戏配置 |
| `POST /terrace/games/config` | 修改游戏配置 |

这些接口可以直接在阶段 1 的 Node.js 服务端里加前缀 `/terrace/*`。

#### 3.3 长期：反编译/重写 Vue2 源码（可选）

如果需要修改后台 UI，才有必要从 dist 反推源码。优先级最低。

### 阶段 4：联调与打包（2-3 周）

| 任务 | 验证方式 |
|---|---|
| 客户端登录还原服务端 | 看到大厅、金币、用户信息 |
| 进入各游戏房间 | 25 款游戏能加载场景 |
| 房间内操作同步 | 能下注、发牌、结算 |
| 金币变动正确 | 抽水、输赢、银行一致 |
| 后台管理查看数据 | 用户、代理、房间、流水 |
| Android 打包 | 生成 APK |
| iOS 打包 | 生成 Xcode 工程 |
| H5 预览 | 浏览器可访问 |

---

## 五、第一阶段详细执行清单

如果现在开始，建议按以下顺序推进：

### Week 1：服务端基础

1. 创建 `728_original/server/` 项目
2. 配置 TypeScript + Express + ws + Drizzle + PostgreSQL
3. 实现 `/Login`、`/register`、WebSocket `Msg_Hall_Connect`
4. 用报告里的 PoC 脚本验证能登录成功

### Week 2：大厅状态

1. 实现 `Msg_Hall_Heart`、在线用户管理
2. 实现 `Msg_Hall_EnterRoom`、房间创建/加入
3. 实现 `Msg_Hall_ChangeGolds`、金币变动推送
4. 对接一款简单游戏（如 ZJH）的 WS 消息

### Week 3：客户端能连

1. 新建 Cocos Creator 2.4 空项目
2. 把 `main.js` 挂到启动场景
3. 修改 `wNetWork` 里的服务器地址指向本地
4. 验证客户端能登录并进入大厅

---

## 六、风险与依赖

| 风险 | 等级 | 应对 |
|---|---|---|
| Cocos Creator 2.4 无法直接打开无 .meta 资源 | 🔴 高 | 写脚本批量生成 .meta，必要时手动修复 |
| 25 款游戏规则还原不准 | 🟡 中 | 从解密 JS 提取状态机，逐款用单元测试验证 |
| 原服务端协议未完全逆向 | 🟡 中 | 边联调边抓日志补消息 |
| iOS 打包需要 Mac + 证书 | 🟡 中 | 先做 Android/H5，iOS 放到最后 |
| 当前无桌面设备可用 | 🟡 中 | Cocos Creator 操作需等桌面设备恢复或本地执行 |
| 资源文件巨大 | 🟢 低 | 分游戏按需加载 |

---

## 七、下一步建议

完整还原是个大工程，建议先从 **阶段 1 Week 1** 开始：

> 建 `728_original/server/`，复刻原 HTTP `/Login` + WS `Msg_Hall_Connect`，用报告里的 Python PoC 跑通登录。

这一步产出可验证："客户端不发请求到 70.39.180.192，而是连到本地服务，且能拿到 token"。

如果你确认，我现在就开始搭服务端骨架并写第一个 `/Login` 接口。

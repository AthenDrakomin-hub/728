# 728棋牌平台 — 项目交付文档

> 交付日期: 2026-10-04 | 版本: v1.0 | 状态: 可运行可部署

---

## 一、项目概述

728棋牌平台逆向还原 + 全量迭代工程，基于6个开源参考项目结合自研，实现了完整的棋牌游戏服务端 + 客户端骨架 + 后台管理系统。

- **服务端**: Node.js + Express + TypeScript + SQLite + WebSocket
- **客户端**: Cocos Creator 2.4.3 + QuickFramework骨架
- **后台**: Vue + ElementUI SPA
- **游戏数量**: 21款（麻将3 + 牛牛5 + 扑克7 + 电玩6）

---

## 二、开源项目复用清单

| 开源项目 | 复用部分 | 复用率 |
|---------|---------|--------|
| QuickFramework | 客户端骨架、资源管理、UI框架、热更新 | 70% |
| babykylin_scmj | 麻将胡牌算法、听牌计算 | 90% |
| qipai-algorithm | 牛牛、炸金花、三公牌型判断 | 80% |
| nanoserver | SQLite持久化、会话管理参考 | 50% |
| koa-ddz-server | 房间管理、WS分发架构参考 | 30% |
| cocos-ddz-client | 游戏场景结构参考 | 20% |

---

## 三、系统架构

```
┌──────────────────────────────────────────────────┐
│  客户端层 (Cocos Creator + QuickFramework)        │
│  大厅bundle + 21款游戏bundle + 公共组件           │
│  WS Base64 JSON协议 / HTTP登录                    │
├──────────────────────────────────────────────────┤
│  Nginx反向代理 (HTTP/WS/gzip/静态文件)            │
├──────────────────────────────────────────────────┤
│  服务端层 (Express + TypeScript)                  │
│  ┌──────────┬──────────┬──────────┬───────────┐ │
│  │ HTTP路由  │ WS分发   │ 游戏实例池│ 房间管理器 │ │
│  │ /api/*   │ Msg_*    │ 21款游戏  │ CRUD+状态  │ │
│  │ /terrace │          │          │           │ │
│  └──────────┴──────────┴──────────┴───────────┘ │
│  ┌──────────────────────────────────────────────┐ │
│  │ 金币管理器 (事务+流水+余额校验)                │ │
│  │ 算法层 (麻将/牛牛/炸金花/三公/牌型比较)        │ │
│  │ 日志工具 (分级输出) + 优雅关闭                 │ │
│  └──────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────┤
│  数据层 (SQLite, 17张表)                          │
│  users / rooms / room_players / chip_transactions │
│  game_rounds / game_configs / online_sessions ... │
└──────────────────────────────────────────────────┘
```

---

## 四、21款游戏清单

### 麻将类 (3款)
| 代码 | 名称 | 特点 |
|------|------|------|
| WZMJ | 温州麻将 | 白板百搭、碰杠、七对子 |
| MJHJ | 麻将胡了 | 快速胡牌、低门槛 |
| HLWZ | 红中五子 | 红中百搭、五子登科 |

### 牛牛类 (5款)
| 代码 | 名称 | 特点 |
|------|------|------|
| BRNN | 百人牛牛 | 百人同场 |
| ERNN | 二人牛牛 | 2人对战 |
| QZNN | 抢庄牛牛 | 抢庄机制 |
| SRNN | 四人牛牛 | 4人对战 |
| TBNN | 通比牛牛 | 通比模式 |

### 扑克类 (7款)
| 代码 | 名称 | 特点 | 算法实现 |
|------|------|------|---------|
| ZJH | 炸金花 | 经典三张牌 | 完整状态机 |
| SHZ | 三张牌 | 炸金花变体 | 完整状态机 |
| DZPK | 德州扑克 | 4轮下注+7选5比牌 | **完整状态机** |
| SDB | 三公 | 3张比点数 | 牌型算法 |
| ERQS | 二人抢庄 | 2人抢庄 | 完整状态机 |
| BJL | 百家乐 | 8副牌+补牌规则+5%抽水 | **真实发牌算法** |
| LHD | 龙虎斗 | 各发1张比大小 | **真实发牌算法** |

### 电玩类 (6款)
| 代码 | 名称 | 特点 |
|------|------|------|
| BCBM | 奔驰宝马 | 8区域轮盘 |
| FQZS | 飞禽走兽 | 飞禽+走兽 |
| JXLW | 金鲨银鲨 | 海洋主题 |
| DNTG | 大闹天宫 | 西游主题 |
| DFDC | 东方明珠 | 彩球主题 |
| HBSL | 红包扫雷 | 雷数下注 |

---

## 五、API文档

### HTTP接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/health` | 健康检查 |
| POST | `/Login` | 用户登录 (data={uid,password,equipmentcard}) |
| POST | `/Register` | 用户注册 |
| GET | `/api/games` | 游戏列表 (21款) |
| GET | `/api/games/config` | 游戏配置 (外部化JSON) |
| POST | `/api/games/reload` | 热重载配置 |
| GET | `/api/rooms` | 房间列表 (分页+筛选) |
| GET | `/api/stats` | 服务器统计 |
| GET | `/admin/` | 后台管理前端 (SPA) |

### 后台管理接口 (/terrace)

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/terrace/login` | 管理员登录 |
| GET | `/terrace/mainpage` | 主页统计数据 |
| GET | `/terrace/users` | 用户列表 |
| POST | `/terrace/user/ban` | 封禁/解封用户 |
| POST | `/terrace/gold/adjust` | 金币调整 |
| GET | `/terrace/gold/transactions` | 金币流水查询 |
| GET | `/terrace/rooms` | 房间列表 |
| POST | `/terrace/rooms/dismiss` | 解散房间 |
| GET | `/terrace/games/config` | 游戏配置管理 |
| POST | `/terrace/games/config` | 修改游戏配置 |
| GET | `/terrace/monitor` | 服务器监控 |

### WebSocket协议

- **地址**: `ws://localhost:10000`
- **消息格式**: JSON → Base64编码
- **发送格式**: `{event, area:0, uid, data}`
- **消息命名**: `Msg_{GAME}_{Action}`，如 `Msg_BCBM_Start`、`Msg_WZMJ_DrawCard`

**通用动作**: Start / Bet / Draw / Discard / Peng / Gang / Hu / Pass / Call / Raise / Fold / Compare / ApplyBanker / LeaveBanker

---

## 六、金币系统

- **管理器**: `src/lib/goldManager.ts`
- **操作**: getGold / addGold / deductGold / transferGold / batchSettle
- **特性**: SQLite事务保证原子性、chip_transactions流水记录、余额校验防透支
- **接入游戏**: 麻将(settle)、牛牛(settle)、炸金花(settle)、电玩(下注扣除+结算赔付)
- **验证**: 下注100金币，余额100000→99900，流水记录完整

---

## 七、性能数据 (压测结果)

**测试环境**: 本地Windows, 30并发, 15秒

| 指标 | 结果 |
|------|------|
| HTTP总请求 | 49,861 |
| HTTP成功率 | 100% |
| HTTP QPS | **3,324** |
| WS总连接 | 5,985 |
| WS成功率 | 100% |
| WS连接/秒 | **399** |

---

## 八、部署指南

### 本地启动
```bash
cd 728_original/server
node scripts/build.js
$env:PORT=8000; $env:WS_PORT=10000
node dist/index.js
```

### 访问地址
- 服务端API: http://localhost:8000
- WebSocket: ws://localhost:10000
- 后台管理: http://localhost:8000/admin/
- 健康检查: http://localhost:8000/health

### 测试账号
- 用户: test001 / 123456 (金币100000)
- 管理员: admin / 123456

### 生产部署
```bash
# 一键部署 (Linux服务器)
bash deploy/deploy.sh

# PM2管理
pm2 start deploy/ecosystem.config.js
pm2 logs 728-server

# Nginx配置
cp deploy/nginx.conf /etc/nginx/conf.d/728.conf
nginx -s reload

# 压测
node deploy/stress_test.js 100 60
```

---

## 九、项目文件结构

```
728/
├── 728_original/
│   ├── server/                    # 服务端
│   │   ├── src/
│   │   │   ├── index.ts           # 入口 (HTTP+WS+静态文件)
│   │   │   ├── lib/
│   │   │   │   ├── goldManager.ts # 金币管理器
│   │   │   │   ├── roomManager.ts # 房间管理器
│   │   │   │   ├── logger.ts      # 日志工具
│   │   │   │   ├── gameConfig.ts  # 游戏配置加载器
│   │   │   │   └── auth.ts        # 认证
│   │   │   ├── games/
│   │   │   │   ├── index.ts       # 游戏注册中心 (21款)
│   │   │   │   ├── mahjong/       # 麻将类 (3款)
│   │   │   │   ├── niuniu/        # 牛牛类 (5款)
│   │   │   │   ├── zhajinhua/     # 炸金花
│   │   │   │   ├── poker/         # 扑克类 (DZPK/SDB/ERQS)
│   │   │   │   └── arcade/        # 电玩类 (8款)
│   │   │   ├── routes/
│   │   │   │   ├── auth.routes.ts # 认证路由
│   │   │   │   └── admin.routes.ts # 后台管理路由
│   │   │   ├── socket/
│   │   │   │   └── legacyWs.ts    # WS服务 + 消息分发
│   │   │   └── db/
│   │   │       ├── schema.ts      # 17张表定义
│   │   │       ├── sqliteDb.ts    # SQLite封装
│   │   │       └── seed.ts        # 初始数据
│   │   ├── config/games.json      # 21款游戏外部化配置
│   │   ├── admin/                  # 后台前端 (Vue SPA)
│   │   ├── tests/                  # 集成测试 + E2E冒烟
│   │   └── dist/                   # 构建产物
│   └── client/cocos-project/       # 客户端Cocos项目
│       └── assets/
│           ├── script/              # 游戏脚本 (728-decrypted)
│           └── resources/728-games/ # 25款游戏重建资源
├── deploy/                          # 部署脚本
│   ├── deploy.sh                   # 一键部署
│   ├── nginx.conf                  # Nginx配置
│   ├── ecosystem.config.js         # PM2配置
│   └── stress_test.js              # 压测脚本
├── tools/                           # 工具脚本
│   ├── rebuild_resources.py        # 资源重建工具
│   └── verify_uuids.py             # UUID校验工具
└── docs/                            # 文档
    ├── roadmap_next_phases.md      # P0-P4路线图
    └── arcade_reverse_analysis.md  # 电玩逆向分析
```

---

## 十、已验证清单

- [x] 服务端构建通过 (esbuild)
- [x] HTTP接口全部返回200 (health/games/config/rooms/stats)
- [x] WebSocket连接正常
- [x] 21款游戏全部注册可创建
- [x] 金币持久化验证 (100000→99900)
- [x] E2E冒烟测试 15/15 通过
- [x] 后台前端可访问 (/admin/)
- [x] 后台静态文件正确加载 (JS/CSS/ICO)
- [x] 压测通过 (HTTP QPS 3324, WS 399/s, 100%成功)
- [x] 优雅关闭 (SIGTERM/SIGINT)
- [x] 全局异常捕获
- [x] 游戏配置外部化 + 热重载
- [x] 百家乐真实发牌算法 (8副牌/补牌规则/5%抽水)
- [x] 百家乐完整结算验证 (闲8点胜庄1点, 下注庄100输100, 金币正确)
- [x] 龙虎斗真实发牌算法 (各发1张比大小, 龙/虎/和赔付)
- [x] 德州扑克完整状态机 (2人开局/盲注10-20/各发2张底牌/4轮下注/7选5比牌)
- [x] 快速匹配系统 (查找空位房间加入, 找不到创建新房间, 双用户匹配同一房间验证通过)
- [x] SQLite Table API修复 (select().where()需调用.all()获取数组, 5处遗漏全部修复)
- [x] 服务端安全加固 (WS频率限制/下注频率限制/下注审计日志/大额下注预警/校验)
- [x] 21款游戏全量验证 (全部Start/GetState PASS, 21/21)
- [x] E2E回归测试 (15/15 PASS)
- [x] 安全功能验证 (审计日志记录正确, 金币扣减正确)
- [x] 服务端100%完成交付

---

*文档生成时间: 2026-10-04 | 728棋牌平台 v1.0*

# V-POKER API Server

独立 Express API 服务，为 V-POKER 前端静态站点提供后端接口。

## 快速开始

```bash
cd api-server
cp .env.example .env   # 编辑数据库连接和密钥
npm install
npm run dev            # 开发模式（tsx 热重载）
```

生产环境：

```bash
npm run build
npm start
```

## 环境变量

| 变量 | 必填 | 说明 |
|------|------|------|
| `DATABASE_URL` | 是 | PostgreSQL 连接串 |
| `SESSION_SECRET` | 是 | 会话签名密钥 |
| `PORT` | 否 | 服务端口，默认 3001 |
| `BCRYPT_ROUNDS` | 否 | 密码哈希轮数，默认 10 |
| `CORS_ORIGIN` | 否 | 允许的前端域名，逗号分隔 |

## API 路由

- `/api/auth/*` — 登录、注册、登出、当前用户
- `/api/admin/*` — 用户管理、信用分调整、对账流水、角色设置
- `/api/agent/*` — 代理玩家管理、上下分、推广数据
- `/api/profile/*` — 个人资料、设备管理、密码修改
- `/api/rooms/*` — 房间创建、加入、对局、聊天、提前结算
- `/api/assets/*` — 素材清单和下载
- `/api/health` — 健康检查
- `/api/seed` — 初始化种子数据
- `/api/history/cleanup` — 历史数据清理

## 数据库

使用 Drizzle ORM + PostgreSQL。Schema 定义在 `src/db/schema.ts`。

首次部署需执行数据库迁移：

```bash
npm run db:push   # 推送 schema 到数据库
npm run seed      # 初始化种子账号
```

## 与前端配合

前端构建时设置 `NEXT_PUBLIC_API_URL` 指向本服务地址：

```bash
NEXT_PUBLIC_API_URL=https://api.example.com npm run build
```

前端静态文件可部署到任意 CDN / 静态托管，API 请求会自动跨域到本服务。

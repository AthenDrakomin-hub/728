# 728 Original Server

728 棋牌平台原版服务端协议复刻。

## 环境要求

- Node.js >= 20
- npm

## 安装依赖

```bash
npm install
```

当前 `node_modules` 在本环境为临时符号链接，交付后请自行安装依赖。

## 编译

```bash
npm run build
```

使用 esbuild 把 `src/` 和 `tests/` 编译到 `dist/`。

## 运行

```bash
npm start
```

默认端口：
- HTTP API: `8000`
- WebSocket 大厅: `10000`
- 后台管理（静态文件单独部署）: `9999`

## 测试账号

- 玩家：`test001` / `123456`
- 后台：`admin` / `123456`

## 测试

```bash
npm test
```

会先登录 `test001`，再连 WebSocket 大厅验证 `Msg_Hall_Connect`。

## 已实现协议

HTTP:
- `POST /Login`
- `POST /register`
- `POST /ChangePassword`
- `POST /forgeBank`（占位）
- `POST /upgrade`（占位）
- `POST /VerificationCode`
- `POST /terrace/login`
- `GET /terrace/mainpage`
- `GET /terrace/users`
- `POST /terrace/user/ban`
- `POST /terrace/gold/adjust`
- `GET /terrace/games/config`
- `POST /terrace/games/config`

WebSocket（Base64 JSON）:
- `Msg_Hall_Connect`
- `Msg_Hall_Heart`
- `Msg_Hall_CreateRoom`
- `Msg_Hall_EnterRoom`
- `Msg_Hall_LeaveRoom`
- `Msg_Hall_QueryAgentList`
- `Msg_Hall_GetBenefits`

## 数据存储

当前使用内存 JSON 表（`src/db/jsonDb.ts`），进程退出数据清空，仅用于本地快速验证。生产部署时请替换为 PostgreSQL/MySQL + Drizzle ORM。

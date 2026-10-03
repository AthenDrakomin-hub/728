# 728棋牌游戏中心 - 逆向分析报告

## 基本信息
- **目标地址**: http://70.39.180.192/view_dist/
- **应用名称**: 728棋牌游戏中心
- **技术栈**: Vue 2 + Element UI + Webpack (vue-admin-template)
- **登录凭证**: admin / 123456
- **当前用户**: 系统管理员 (Super Admin)

---

## 一、发现的 JS 文件

| 文件名 | 大小 | 类型 | 说明 |
|--------|------|------|------|
| app.797ceb1f.js | 43 KB | 主应用 | 路由配置、状态管理、登录逻辑、Mock数据 |
| chunk-elementUI.a9f82b5b.js | 668 KB | Element UI库 | Element UI 组件库 |
| chunk-libs.20e84187.js | 392 KB | 第三方库 | 第三方依赖库（axios、vuex等） |
| chunk-256f9db6.c8f63910.js | 2.8 KB | 懒加载chunk | 路由懒加载组件 |
| chunk-3cd309a1.4b119a1a.js | 3.1 KB | 懒加载chunk | 数据总览页面组件（含 /terrace/mainpage 接口） |

其他懒加载的 chunk（按需加载，未在首屏加载）：
- chunk-10f17609 (飞禽走兽)
- chunk-3c8d77bc (奔驰宝马)
- chunk-023d3e86 (九线拉王)
- chunk-50e63fcf (水浒传)
- chunk-e8d37dd2 (多福多财)
- chunk-2387d71e (森林舞会)
- chunk-9e9c9b90 + chunk-5ea47cf2 (排行榜)
- chunk-2d0ce87b (点控记录)
- chunk-55d0efac (百家乐)
- 以及其他游戏相关 chunk

---

## 二、API 接口路径

### 真实后端接口
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/terrace/login` | 登录接口 |
| GET | `/terrace/mainpage` | 数据总览主页数据 |

### Mock 接口（vue-admin-template）
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/vue-admin-template/user/login` | Mock登录 |
| GET | `/vue-admin-template/user/info` | Mock用户信息 |
| POST | `/vue-admin-template/user/logout` | Mock登出 |
| GET | `/vue-admin-template/table/list` | Mock表格列表 |

### 请求配置
- **Base URL**: `/`
- **超时**: 5000ms
- **认证方式**: Header `X-Token` 传递 token
- **响应格式**: `{ code, data, status, msg }`

---

## 三、页面功能模块（菜单结构）

### 主导航菜单（侧边栏）

| 序号 | 菜单名称 | 路由路径 | 图标 |
|------|----------|----------|------|
| 1 | 数据总览 | `/overview` | dashboard |
| 2 | 用户列表 | `/user/index` | form |
| 3 | 快捷操作 | `/quick/operation` | example |
| 4 | 创建代理 | `/createproxy/index` | link |
| 5 | 赠送记录 | `/gift/index` | tree |
| 6 | 平台赠送 | `/ptzs/index` | tree |
| 7 | 游戏记录 | `/gamerecord/index` | nested |
| 8 | 库存 | `/inventory/index` | form |
| 9 | **游戏设置** (子菜单) | | el-icon-s-help |
| 10 | 排行榜 | `/list/index` | form |
| 11 | 点控记录 | `/dkjl/index` | form |

### 游戏设置子菜单（9款游戏）

| 序号 | 游戏名称 | 路由路径 |
|------|----------|----------|
| 9.1 | 龙虎斗 | `/game/longhudou` |
| 9.2 | 百人牛牛 | `/game/brnn` |
| 9.3 | 百家乐 | `/game/bjl` |
| 9.4 | 飞禽走兽 | `/game/fqzs` |
| 9.5 | 奔驰宝马 | `/game/bcbm` |
| 9.6 | 九线拉王 | `/game/jxlw` |
| 9.7 | 水浒传 | `/game/shz` |
| 9.8 | 多福多财 | `/game/dfdc` |
| 9.9 | 森林舞会 | `/game/slwh` |

### 数据总览页面模块
- **金币流水**: 今日总出/总入、累计总出/总入（亿级）
- **用户状态**: 在线用户数、离线用户数、总用户数（按代理/玩家分类）
- **新增用户**: 今日/三日内/一周内新增（代理+玩家）

---

## 四、用户角色体系

| 角色 | 用户名 | Token | 权限等级 |
|------|--------|-------|----------|
| admin | admin | admin-token | 超级管理员 |
| editor | - | editor-token | 普通编辑 |
| agent | 111111 | 111111-token | 代理 (level:2, agentPower:0) |
| agent | 222222 | 222222-token | 代理 (level:2, agentPower:-1) |
| agent | 333333 | 333333-token | 代理 (level:2, agentPower:1) |

---

## 五、游戏类型列表（从代码中提取）

| ID | 游戏名称 |
|----|----------|
| 1 | 飞禽走兽 |
| 2 | 百人牛牛 |
| 3 | 红包扫雷 |
| 4 | 森林舞会 |
| 6 | 龙虎斗 |
| 7 | 奔驰宝马 |
| 8 | 百家乐 |
| 9 | 十点半 |
| 10 | 寻龙夺宝 |
| 11 | 捕鱼大亨 |
| 12 | 大闹天宫2 |
| 13 | 大闹天宫 |
| 14 | 抢庄牛牛 |
| 15 | 二人牛牛 |
| 16 | 欢乐五张 |
| 17 | 二人雀神 |
| 18 | 通比牛牛 |
| 19 | 德州扑克 |
| 20 | 炸金花 |
| 21 | 四人牛牛 |
| 22 | 九线拉王 |
| 23 | 水浒传 |
| 26 | 多福多财 |
| 27 | 千变双扣 |
| 28 | 温州麻将 |
| 29 | 欢乐至尊 |

---

## 六、文件清单

```
/Coze/Drive/逆向安全分析助手的新项目/728_analysis/view_dist_js/
├── app.797ceb1f.js              (43 KB)
├── chunk-elementUI.a9f82b5b.js  (668 KB)
├── chunk-libs.20e84187.js       (392 KB)
├── chunk-256f9db6.c8f63910.js   (2.8 KB)
├── chunk-3cd309a1.4b119a1a.js   (3.1 KB)
├── overview.png                 (截图)
└── analysis_report.md           (本报告)
```
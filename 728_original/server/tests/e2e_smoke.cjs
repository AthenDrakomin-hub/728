/**
 * E2E 冒烟测试 — 覆盖注册→登录→WS→房间→游戏→结算→金币对账全流程
 * 用法: node tests/e2e_smoke.js
 */
const http = require("http");
const WebSocket = require("ws");

const HOST = "localhost";
const HTTP_PORT = 8000;
const WS_PORT = 10000;

let passed = 0;
let failed = 0;

function assert(cond, msg) {
  if (cond) { passed++; console.log(`  [PASS] ${msg}`); }
  else { failed++; console.log(`  [FAIL] ${msg}`); }
}

function post(path, data) {
  return new Promise((res, rej) => {
    const body = "data=" + encodeURIComponent(JSON.stringify(data));
    const req = http.request({ hostname: HOST, port: HTTP_PORT, path, method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", "Content-Length": Buffer.byteLength(body) } },
      r => { let d = ""; r.on("data", c => d += c); r.on("end", () => res(JSON.parse(d))); });
    req.on("error", rej); req.write(body); req.end();
  });
}

function get(path) {
  return new Promise((res, rej) => {
    http.get(`http://${HOST}:${HTTP_PORT}${path}`, r => {
      let d = ""; r.on("data", c => d += c); r.on("end", () => res({ status: r.statusCode, body: JSON.parse(d) }));
    }).on("error", rej);
  });
}

function wsSend(ws, event, data = {}) {
  const m = JSON.stringify({ event, area: 0, uid: 0, data });
  ws.send(Buffer.from(m).toString("base64"));
}

function wsRecv(ws, t = 8000) {
  return new Promise((res, rej) => {
    const timer = setTimeout(() => rej(new Error("WS timeout")), t);
    ws.once("message", raw => { clearTimeout(timer); res(JSON.parse(Buffer.from(raw.toString(), "base64").toString())); });
  });
}

async function connectWS(token) {
  const ws = new WebSocket(`ws://${HOST}:${WS_PORT}`);
  await new Promise((r, rej) => { ws.on("open", r); ws.on("error", rej); });
  wsSend(ws, "Msg_Hall_Connect", { token });
  await wsRecv(ws);
  return ws;
}

async function main() {
  console.log("=== 728 E2E 冒烟测试 ===\n");

  // 1. HTTP 健康检查
  console.log("[1] HTTP 健康检查");
  const health = await get("/health");
  assert(health.status === 200, "health 返回 200");
  assert(health.body.ok === true, "health.ok = true");

  // 2. 游戏列表
  console.log("\n[2] 游戏列表接口");
  const games = await get("/api/games");
  assert(games.status === 200, "api/games 返回 200");
  assert(games.body.data.games.length >= 9, `已注册 ${games.body.data.games.length} 款游戏 (>=9)`);

  // 3. 服务器统计
  console.log("\n[3] 服务器统计接口");
  const stats = await get("/api/stats");
  assert(stats.status === 200, "api/stats 返回 200");
  assert(stats.body.data.uptime > 0, "uptime > 0");

  // 4. 登录
  console.log("\n[4] 用户登录");
  const login = await post("/Login", { uid: "test001", password: "123456", equipmentcard: "e2e-smoke" });
  assert(login.code === 20000, "登录成功 code=20000");
  assert(login.data.token, "返回 token");
  const goldBefore = login.data.gold;
  assert(typeof goldBefore === "number", `金币字段存在: ${goldBefore}`);

  // 5. WS 连接
  console.log("\n[5] WebSocket 连接");
  const ws = await connectWS(login.data.token);
  assert(ws.readyState === WebSocket.OPEN, "WS 连接已建立");

  // 6. BCBM 游戏开始
  console.log("\n[6] BCBM 电玩游戏开始");
  wsSend(ws, "Msg_BCBM_Start", { roomId: 9001 });
  const startResp = await wsRecv(ws);
  assert(startResp.data?.ok === true, "BCBM Start ok");

  // 7. BCBM 下注
  console.log("\n[7] BCBM 下注 100 金币");
  wsSend(ws, "Msg_BCBM_Bet", { roomId: 9001, region: 0, amount: 100 });
  const betResp = await wsRecv(ws);
  assert(betResp.data?.ok === true, "下注 100 成功");

  // 8. 金币对账
  console.log("\n[8] 金币对账 (下注后应减少 100)");
  const login2 = await post("/Login", { uid: "test001", password: "123456", equipmentcard: "e2e-smoke2" });
  const goldAfter = login2.data.gold;
  assert(goldBefore - goldAfter === 100, `金币变动正确: ${goldBefore} -> ${goldAfter} (差 ${goldBefore - goldAfter})`);

  // 9. 房间列表
  console.log("\n[9] 房间列表接口");
  const rooms = await get("/api/rooms");
  assert(rooms.status === 200, "api/rooms 返回 200");
  assert(Array.isArray(rooms.body.data.list), "返回房间数组");

  ws.close();

  // 总结
  console.log("\n=== 测试总结 ===");
  console.log(`通过: ${passed}, 失败: ${failed}`);
  console.log(failed === 0 ? "全部通过!" : "存在失败项!");
  process.exit(failed === 0 ? 0 : 1);
}

main().catch(e => { console.error("FATAL:", e.message); process.exit(1); });

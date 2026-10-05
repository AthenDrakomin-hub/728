/**
 * BCBM (奔驰宝马) 电玩游戏集成测试
 */
import WebSocket from "ws";
import http from "http";

const WS_URL = "ws://localhost:10000";

function httpPost(path, data) {
  return new Promise((resolve, reject) => {
    const body = "data=" + encodeURIComponent(JSON.stringify(data));
    const req = http.request(
      { hostname: "localhost", port: 8000, path, method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", "Content-Length": Buffer.byteLength(body) } },
      (res) => { let d = ""; res.on("data", (c) => (d += c)); res.on("end", () => resolve(JSON.parse(d))); }
    );
    req.on("error", reject);
    req.write(body); req.end();
  });
}

function wsSend(ws, event, data = {}) {
  const msg = JSON.stringify({ event, area: 0, uid: 0, data });
  ws.send(Buffer.from(msg).toString("base64"));
}

function wsRecv(ws, timeout = 8000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), timeout);
    ws.once("message", (raw) => {
      clearTimeout(timer);
      resolve(JSON.parse(Buffer.from(raw.toString(), "base64").toString()));
    });
  });
}

async function loginAndConnect(uid) {
  const login = await httpPost("/Login", { uid, password: "123456", equipmentcard: "test-bcbm-" + uid });
  const ws = new WebSocket(WS_URL);
  await new Promise((r) => ws.on("open", r));
  wsSend(ws, "Msg_Hall_Connect", { token: login.data.token });
  await wsRecv(ws);
  return ws;
}

async function main() {
  console.log("=== 双用户登录 ===");
  const ws1 = await loginAndConnect("test001");
  const ws2 = await loginAndConnect("test002");
  console.log("test001 + test002 connected");

  console.log("\n=== BCBM 开始游戏 ===");
  wsSend(ws1, "Msg_BCBM_Start", { roomId: 4001 });
  let r = await wsRecv(ws1);
  console.log("Start ok:", r.data?.ok, "stage:", r.data?.state?.stage);
  console.log("  betRemain:", r.data?.state?.betRemain, "秒");

  wsSend(ws2, "Msg_BCBM_Start", { roomId: 4001 });
  r = await wsRecv(ws2);
  console.log("P2 join ok, stage:", r.data?.state?.stage);

  console.log("\n=== 下注测试 ===");
  // P1 下注大保时捷(区域0, 赔率40) 100金币
  wsSend(ws1, "Msg_BCBM_Bet", { roomId: 4001, region: 0, amount: 100 });
  r = await wsRecv(ws1);
  console.log("P1 下注大保时捷 100: ok=", r.data?.ok);
  console.log("  regionTotals[0]:", r.data?.state?.regionTotals?.[0]);

  // P1 下注小大众(区域7, 赔率5) 50金币
  wsSend(ws1, "Msg_BCBM_Bet", { roomId: 4001, region: 7, amount: 50 });
  r = await wsRecv(ws1);
  console.log("P1 下注小大众 50: ok=", r.data?.ok);
  console.log("  P1 totalBet:", r.data?.state?.players?.[0]?.totalBet);

  // P2 下注大奔驰(区域1, 赔率30) 200金币
  wsSend(ws2, "Msg_BCBM_Bet", { roomId: 4001, region: 1, amount: 200 });
  r = await wsRecv(ws2);
  console.log("P2 下注大奔驰 200: ok=", r.data?.ok);
  console.log("  regionTotals[1]:", r.data?.state?.regionTotals?.[1]);

  console.log("\n=== 申请上庄 ===");
  wsSend(ws1, "Msg_BCBM_ApplyBanker", { roomId: 4001 });
  r = await wsRecv(ws1);
  console.log("P1 申请上庄: ok=", r.data?.ok, "bankerUid:", r.data?.state?.bankerUid);

  console.log("\n=== 等待开奖 (下注20秒, 这里查询状态) ===");
  await new Promise(r => setTimeout(r, 3000));
  wsSend(ws1, "Msg_BCBM_GetState", { roomId: 4001 });
  r = await wsRecv(ws1);
  console.log("当前 stage:", r.data?.state?.stage);
  console.log("betRemain:", r.data?.state?.betRemain, "秒");
  console.log("history:", JSON.stringify(r.data?.state?.history));

  console.log("\n=== 测试下注验证 ===");
  // 验证最小下注限制
  wsSend(ws1, "Msg_BCBM_Bet", { roomId: 4001, region: 0, amount: 5 });
  r = await wsRecv(ws1);
  console.log("下注5(小于minBet=10): ok=", r.data?.ok, "(应为false)");

  ws1.close();
  ws2.close();
  console.log("\n=== BCBM 电玩游戏测试通过 ===");
  process.exit(0);
}

main().catch((err) => {
  console.error("TEST FAILED:", err.message);
  process.exit(1);
});

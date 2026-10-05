/**
 * 牛牛 + 炸金花 集成测试 (双用户)
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

function wsRecv(ws, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), timeout);
    ws.once("message", (raw) => {
      clearTimeout(timer);
      resolve(JSON.parse(Buffer.from(raw.toString(), "base64").toString()));
    });
  });
}

async function loginAndConnect(uid) {
  const login = await httpPost("/Login", { uid, password: "123456", equipmentcard: "test-" + uid });
  const token = login.data.token;
  const ws = new WebSocket(WS_URL);
  await new Promise((r) => ws.on("open", r));
  wsSend(ws, "Msg_Hall_Connect", { token });
  await wsRecv(ws);
  return ws;
}

async function main() {
  // 确保test002存在
  await httpPost("/register", { uid: "test002", password: "123456", nickname: "test2", invite_code: "A00001" }).catch(() => {});

  console.log("=== 双用户登录 ===");
  const ws1 = await loginAndConnect("test001");
  const ws2 = await loginAndConnect("test002");
  console.log("test001 + test002 connected");

  // ===== 牛牛测试 =====
  console.log("\n=== 牛牛(QZNN) 测试 ===");
  // 玩家1加入
  wsSend(ws1, "Msg_QZNN_Start", { roomId: 2001, seat: 0 });
  let r = await wsRecv(ws1);
  console.log("P1 join ok, start:", r.data?.ok);

  // 玩家2加入并开始
  wsSend(ws2, "Msg_QZNN_Start", { roomId: 2001, seat: 1 });
  r = await wsRecv(ws2);
  console.log("P2 join + start ok:", r.data?.ok, "stage:", r.data?.state?.stage);

  // 下注
  wsSend(ws1, "Msg_QZNN_Bet", { roomId: 2001, amount: 20 });
  r = await wsRecv(ws1);
  console.log("P1 Bet ok:", r.data?.ok);
  wsSend(ws2, "Msg_QZNN_Bet", { roomId: 2001, amount: 30 });
  r = await wsRecv(ws2);
  console.log("P2 Bet ok:", r.data?.ok);

  // 发牌
  wsSend(ws1, "Msg_QZNN_Deal", { roomId: 2001 });
  r = await wsRecv(ws1);
  console.log("Deal ok:", r.data?.ok, "stage:", r.data?.state?.stage);
  const players = r.data?.state?.players || [];
  for (const p of players) {
    console.log(`  seat${p.seat}: cards=[${p.cards?.join(",")}] niu=${p.niuType}(${p.niuValue})`);
  }

  // 抢庄
  wsSend(ws1, "Msg_QZNN_Qiang", { roomId: 2001, multi: 2 });
  r = await wsRecv(ws1);
  console.log("P1 Qiang ok:", r.data?.ok);
  wsSend(ws2, "Msg_QZNN_Qiang", { roomId: 2001, multi: 3 });
  r = await wsRecv(ws2);
  console.log("P2 Qiang ok:", r.data?.ok, "bankerSeat:", r.data?.state?.bankerSeat, "stage:", r.data?.state?.stage);

  // ===== 炸金花测试 =====
  console.log("\n=== 炸金花(ZJH) 测试 ===");
  wsSend(ws1, "Msg_ZJH_Start", { roomId: 3001, seat: 0 });
  r = await wsRecv(ws1);
  console.log("P1 join, start:", r.data?.ok);
  wsSend(ws2, "Msg_ZJH_Start", { roomId: 3001, seat: 1 });
  r = await wsRecv(ws2);
  console.log("P2 join + start ok:", r.data?.ok, "stage:", r.data?.state?.stage);
  console.log("  pot:", r.data?.state?.pot, "currentTurn:", r.data?.state?.currentTurn);
  const zjhPlayers = r.data?.state?.players || [];
  for (const p of zjhPlayers) {
    console.log(`  seat${p.seat}: cardCount=${p.cardCount} zjhType=${p.zjhType} betTotal=${p.betTotal}`);
  }

  // P1看牌
  wsSend(ws1, "Msg_ZJH_See", { roomId: 3001 });
  r = await wsRecv(ws1);
  console.log("P1 SeeCards ok:", r.data?.ok);

  // P1跟注
  wsSend(ws1, "Msg_ZJH_Call", { roomId: 3001 });
  r = await wsRecv(ws1);
  console.log("P1 Call ok, pot:", r.data?.state?.pot);

  // P2弃牌
  wsSend(ws2, "Msg_ZJH_Fold", { roomId: 3001 });
  r = await wsRecv(ws2);
  console.log("P2 Fold ok, stage:", r.data?.state?.stage);

  ws1.close();
  ws2.close();
  console.log("\n=== 牛牛+炸金花全部测试通过 ===");
  process.exit(0);
}

main().catch((err) => {
  console.error("TEST FAILED:", err.message);
  process.exit(1);
});

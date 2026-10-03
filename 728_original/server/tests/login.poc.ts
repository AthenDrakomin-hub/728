import WebSocket from "ws";

const HTTP_BASE = "http://localhost:8000";
const WS_BASE = "ws://localhost:10000";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function encodeWs(event: string, data: any, uid = 0) {
  return Buffer.from(JSON.stringify({ event, data, uid })).toString("base64");
}

async function main() {
  console.log("=== 728 Original Server PoC ===\n");

  // 1. 登录
  const loginRes = await fetch(`${HTTP_BASE}/Login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ uid: "test001", password: "123456", equipmentcard: "poc-device" }),
  });
  const loginJson = await loginRes.json();
  console.log("Login response:", JSON.stringify(loginJson, null, 2));

  if ((loginJson.code !== 0 && loginJson.code !== 20000) || !loginJson.data.token) {
    console.error("登录失败");
    process.exit(1);
  }

  const token = loginJson.data.token;
  const uid = loginJson.data.uid;

  // 2. WebSocket 连接大厅
  const ws = new WebSocket(WS_BASE);

  ws.on("open", () => {
    console.log("\nWS connected");
    ws.send(encodeWs("Msg_Hall_Connect", { token }, uid));
  });

  ws.on("message", (raw: any) => {
    const decoded = JSON.parse(Buffer.from(raw.toString(), "base64").toString());
    console.log("WS recv:", JSON.stringify(decoded, null, 2));

    if (decoded.event === "Msg_Hall_Connect" && decoded.data.status === 1) {
      // 发心跳
      setInterval(() => {
        ws.send(encodeWs("Msg_Hall_Heart", {}, uid));
      }, 5000);

      // 创建房间
      setTimeout(() => {
        ws.send(encodeWs("Msg_Hall_CreateRoom", {
          game_type: "ZJH",
          level: 1,
          total_rounds: 10,
          max_seats: 5,
        }, uid));
      }, 500);
    }
  });

  ws.on("error", (err) => console.error("WS error:", err.message));

  await sleep(5000);
  console.log("\nPoC done");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

// 模拟728 Cocos客户端真实协议的端到端测试
const http = require("http");
const WebSocket = require("ws");

const HTTP_URL = "http://localhost:8000";
const WS_URL = "ws://localhost:10000";

function httpPost(path, body) {
  return new Promise((resolve, reject) => {
    const data = typeof body === "string" ? body : JSON.stringify(body);
    const req = http.request(HTTP_URL + path, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded", "Content-Length": Buffer.byteLength(data) }
    }, (res) => {
      let chunks = "";
      res.on("data", c => chunks += c);
      res.on("end", () => { try { resolve(JSON.parse(chunks)); } catch(e) { resolve(chunks); } });
    });
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

function b64encode(obj) {
  return Buffer.from(JSON.stringify(obj)).toString("base64");
}
function b64decode(str) {
  return JSON.parse(Buffer.from(str, "base64").toString());
}

async function main() {
  let pass = 0, fail = 0;
  function check(name, cond, detail="") {
    if (cond) { pass++; console.log(`  [PASS] ${name}`); }
    else { fail++; console.log(`  [FAIL] ${name} ${detail}`); }
  }

  console.log("=== 1. HTTP登录（客户端真实嵌套格式）===");
  // 客户端格式: data={"event":"Msg_User_Login","data":{"uid":数字,"password":...}}
  const loginBody = 'data=' + encodeURIComponent(JSON.stringify({
    event: "Msg_User_Login",
    data: { uid: 10001, password: "123456", equipmentcard: "e2e-test-device", type: 1, code: -1 }
  }));
  const loginResp = await httpPost("/Login", loginBody);
  console.log("  响应code:", loginResp.code, "message:", loginResp.message || "");
  check("HTTP登录返回code=20000", loginResp.code === 20000, JSON.stringify(loginResp));
  check("HTTP登录返回token", !!loginResp.data?.token, "token缺失");
  check("HTTP登录返回uid", loginResp.data?.uid === 3, `uid=${loginResp.data?.uid}`);
  check("HTTP登录返回gold", loginResp.data?.gold === 100000, `gold=${loginResp.data?.gold}`);

  const token = loginResp.data?.token;
  const uid = loginResp.data?.uid;

  console.log("\n=== 2. WS连接（Msg_Hall_Connect）===");
  const ws = new WebSocket(WS_URL);
  const messages = [];
  ws.on("message", (data) => {
    try { messages.push(b64decode(data.toString())); } catch(e) { console.log("  decode error:", e.message); }
  });

  await new Promise(r => ws.on("open", r));
  console.log("  WS已连接");

  // 客户端发送格式: Base64.encode(JSON.stringify({event, area:0, uid, data}))
  const connectMsg = b64encode({ event: "Msg_Hall_Connect", area: 0, uid: uid || 0, data: { token } });
  ws.send(connectMsg);
  console.log("  已发送Msg_Hall_Connect");

  await new Promise(r => setTimeout(r, 1500));
  const connectResp = messages.find(m => m.event === "Msg_Hall_Connect");
  console.log("  收到响应:", connectResp ? JSON.stringify(connectResp).substring(0, 200) : "无");

  check("WS收到Msg_Hall_Connect响应", !!connectResp, "无响应");
  check("WS响应status=1（顶层）", connectResp?.status === 1, `status=${connectResp?.status}`);
  check("WS响应data.rid存在", connectResp?.data?.rid !== undefined, `rid=${connectResp?.data?.rid}`);
  check("WS响应data.gamestatus存在", !!connectResp?.data?.gamestatus, "gamestatus缺失");
  check("WS响应data.uid", connectResp?.data?.uid === 3, `uid=${connectResp?.data?.uid}`);
  check("WS响应data.gold", connectResp?.data?.gold === 100000, `gold=${connectResp?.data?.gold}`);

  console.log("\n=== 3. WS心跳（Msg_Hall_Heart）===");
  const heartMsg = b64encode({ event: "Msg_Hall_Heart", area: 0, uid: uid || 0, data: {} });
  ws.send(heartMsg);
  await new Promise(r => setTimeout(r, 800));
  const heartResp = messages.find(m => m.event === "Msg_Hall_Heart");
  check("WS心跳有响应", !!heartResp || messages.length > 1, `messages=${messages.length}`);

  console.log("\n=== 4. WS进入游戏大厅（Msg_Hall_GetGameList）===");
  const gameListMsg = b64encode({ event: "Msg_Hall_GetGameList", area: 0, uid: uid || 0, data: {} });
  ws.send(gameListMsg);
  await new Promise(r => setTimeout(r, 1000));
  const gameListResp = messages.find(m => m.event === "Msg_Hall_GetGameList");
  check("WS游戏列表有响应", !!gameListResp, "无响应");
  if (gameListResp) {
    console.log("  游戏列表响应:", JSON.stringify(gameListResp).substring(0, 200));
  }

  ws.close();
  console.log(`\n=== 结果: ${pass} PASS, ${fail} FAIL ===`);
  process.exit(fail > 0 ? 1 : 0);
}

main().catch(e => { console.error("测试异常:", e); process.exit(1); });

// Cocos客户端联调测试 - 模拟728客户端登录→WS→游戏全流程
const http = require('http');
const WebSocket = require('ws');

// ========== 工具函数 ==========
function httpPost(url, data) {
  return new Promise((resolve, reject) => {
    const body = 'data=' + encodeURIComponent(JSON.stringify(data));
    const u = new URL(url);
    const req = http.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(body),
      }
    }, (res) => {
      let raw = '';
      res.on('data', c => raw += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); }
        catch { resolve({ status: res.statusCode, body: raw }); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function b64encode(obj) {
  return Buffer.from(JSON.stringify(obj)).toString('base64');
}
function b64decode(str) {
  return JSON.parse(Buffer.from(str, 'base64').toString());
}

// ========== 测试流程 ==========
async function main() {
  console.log('=== 728 Cocos客户端联调测试 ===\n');

  // STEP 1: HTTP登录
  console.log('STEP 1: HTTP登录 /Login');
  const loginData = {
    uid: 'test001',
    password: '123456',
    equipmentcard: 'cocos-test-device-001',
    type: 0,
    code: ''
  };
  const loginRes = await httpPost('http://localhost:8000/Login', loginData);
  console.log('  状态:', loginRes.status);
  console.log('  响应:', JSON.stringify(loginRes.body).substring(0, 300));
  
  if (loginRes.status !== 200) {
    console.log('  登录失败，终止测试');
    return;
  }
  
  // 提取uid和token
  const loginBody = loginRes.body;
  const uid = loginBody.uid || loginBody.userId || loginBody.id || 'test001';
  const token = loginBody.token || loginBody.session || '';
  console.log('  uid:', uid);
  console.log('  token:', token ? '已获取' : '无');

  // STEP 2: WS连接
  console.log('\nSTEP 2: WebSocket连接 ws://localhost:10000');
  const ws = new WebSocket('ws://localhost:10000');
  let wsConnected = false;
  let messages = [];
  
  ws.on('open', () => {
    wsConnected = true;
    console.log('  WS连接成功');
  });
  
  ws.on('message', (data) => {
    try {
      const decoded = b64decode(data.toString());
      messages.push(decoded);
      console.log('  ← 收到:', decoded.event || JSON.stringify(decoded).substring(0, 100));
    } catch {
      console.log('  ← 原始消息:', data.toString().substring(0, 100));
    }
  });
  
  ws.on('error', (err) => {
    console.log('  WS错误:', err.message);
  });
  
  // 等待连接
  await new Promise(r => setTimeout(r, 2000));
  if (!wsConnected) {
    console.log('  WS连接失败，终止测试');
    return;
  }

  // STEP 3: 发送登录/认证消息
  console.log('\nSTEP 3: WS认证 (Msg_Hall_Login)');
  const authMsg = b64encode({
    event: 'Msg_Hall_Login',
    area: 0,
    uid: uid,
    data: { uid: uid, token: token, equipmentcard: 'cocos-test-device-001' }
  });
  ws.send(authMsg);
  console.log('  → 发送 Msg_Hall_Login');
  await new Promise(r => setTimeout(r, 1500));

  // STEP 4: 发送心跳
  console.log('\nSTEP 4: 心跳 (Msg_Hall_Heart)');
  const heartMsg = b64encode({
    event: 'Msg_Hall_Heart',
    area: 0,
    uid: uid,
    data: {}
  });
  ws.send(heartMsg);
  console.log('  → 发送 Msg_Hall_Heart');
  await new Promise(r => setTimeout(r, 1000));

  // STEP 5: 获取游戏列表/大厅信息
  console.log('\nSTEP 5: 获取大厅信息 (Msg_Hall_GetGameList)');
  const gameListMsg = b64encode({
    event: 'Msg_Hall_GetGameList',
    area: 0,
    uid: uid,
    data: {}
  });
  ws.send(gameListMsg);
  console.log('  → 发送 Msg_Hall_GetGameList');
  await new Promise(r => setTimeout(r, 1500));

  // STEP 6: 进入百家乐游戏 (gtype=8)
  console.log('\nSTEP 6: 进入百家乐 (Msg_Game_GetState, gtype=8)');
  const enterMsg = b64encode({
    event: 'Msg_Game_GetState',
    area: 0,
    uid: uid,
    data: { gtype: 8, roomId: 80000001 }
  });
  ws.send(enterMsg);
  console.log('  → 发送 Msg_Game_GetState (gtype=8=BJL)');
  await new Promise(r => setTimeout(r, 1500));

  // STEP 7: 百家乐下注
  console.log('\nSTEP 7: 百家乐下注 (Msg_Game_Bet, gtype=8)');
  const betMsg = b64encode({
    event: 'Msg_Game_Bet',
    area: 0,
    uid: uid,
    data: { gtype: 8, roomId: 80000001, area: 'xian', gold: 100 }
  });
  ws.send(betMsg);
  console.log('  → 发送 Msg_Game_Bet (gtype=8, 闲100)');
  await new Promise(r => setTimeout(r, 2000));

  // STEP 8: 进入龙虎斗 (gtype=6)
  console.log('\nSTEP 8: 进入龙虎斗 (Msg_Game_GetState, gtype=6)');
  const lhdMsg = b64encode({
    event: 'Msg_Game_GetState',
    area: 0,
    uid: uid,
    data: { gtype: 6, roomId: 60000001 }
  });
  ws.send(lhdMsg);
  console.log('  → 发送 Msg_Game_GetState (gtype=6=LHD)');
  await new Promise(r => setTimeout(r, 1500));

  // 总结
  console.log('\n=== 测试总结 ===');
  console.log('总收到消息数:', messages.length);
  const events = messages.map(m => m.event || 'unknown');
  console.log('收到的事件类型:', [...new Set(events)].join(', '));
  
  // 检查关键响应
  const hasLoginResp = messages.some(m => m.event && m.event.includes('Login'));
  const hasGameState = messages.some(m => m.event && (m.event.includes('GetState') || m.event.includes('State')));
  const hasBetResp = messages.some(m => m.event && (m.event.includes('Bet') || m.event.includes('Settle')));
  console.log('\n关键响应检查:');
  console.log('  登录响应:', hasLoginResp ? 'PASS' : 'FAIL');
  console.log('  游戏状态:', hasGameState ? 'PASS' : 'FAIL');
  console.log('  下注响应:', hasBetResp ? 'PASS' : 'FAIL/未触发');

  ws.close();
  console.log('\n测试完成，WS已关闭');
}

main().catch(err => {
  console.error('测试异常:', err);
  process.exit(1);
});

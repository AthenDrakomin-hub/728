// Cocos客户端联调测试 - 正确流程版
const http = require('http');
const WebSocket = require('ws');

function httpPost(url, data) {
  return new Promise((resolve, reject) => {
    const body = 'data=' + encodeURIComponent(JSON.stringify(data));
    const u = new URL(url);
    const req = http.request({
      hostname: u.hostname, port: u.port, path: u.pathname, method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(body) }
    }, (res) => {
      let raw = '';
      res.on('data', c => raw += c);
      res.on('end', () => { try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); } catch { resolve({ status: res.statusCode, body: raw }); } });
    });
    req.on('error', reject);
    req.write(body); req.end();
  });
}

function b64encode(obj) { return Buffer.from(JSON.stringify(obj)).toString('base64'); }
function b64decode(str) { return JSON.parse(Buffer.from(str, 'base64').toString()); }

async function main() {
  const results = [];
  function check(name, pass, detail) {
    results.push({ name, pass, detail });
    console.log(`[${pass ? 'PASS' : 'FAIL'}] ${name}${detail ? ': ' + detail : ''}`);
  }

  console.log('=== 728 Cocos客户端联调测试 ===\n');

  // 1. HTTP登录
  console.log('1. HTTP登录');
  const loginRes = await httpPost('http://localhost:8000/Login', {
    uid: 'test001', password: '123456', equipmentcard: 'cocos-test', type: 0, code: ''
  });
  const loginOk = loginRes.status === 200 && loginRes.body.code === 20000;
  const token = loginRes.body?.data?.token || '';
  const uid = loginRes.body?.data?.uid || 0;
  check('HTTP登录', loginOk, `uid=${uid}, gold=${loginRes.body?.data?.gold}`);

  // 2. WS连接
  console.log('\n2. WS连接');
  const ws = new WebSocket('ws://localhost:10000');
  let connected = false;
  const msgs = [];
  ws.on('open', () => { connected = true; });
  ws.on('message', (d) => { try { msgs.push(b64decode(d.toString())); } catch {} });
  ws.on('error', () => {});
  await new Promise(r => setTimeout(r, 2000));
  check('WS连接', connected);

  // 3. Msg_Hall_Connect (带token)
  console.log('\n3. Msg_Hall_Connect');
  ws.send(b64encode({ event: 'Msg_Hall_Connect', area: 0, uid: uid, data: { token } }));
  await new Promise(r => setTimeout(r, 1500));
  const connectResp = msgs.find(m => m.event === 'Msg_Hall_Connect');
  const connectOk = connectResp && connectResp.status === 1;
  check('Msg_Hall_Connect', connectOk, connectResp ? `uid=${connectResp.uid}, gold=${connectResp.gold}` : '无响应');

  // 4. 心跳
  console.log('\n4. Msg_Hall_Heart');
  const beforeHeart = msgs.length;
  ws.send(b64encode({ event: 'Msg_Hall_Heart', area: 0, uid: uid, data: {} }));
  await new Promise(r => setTimeout(r, 1000));
  const heartResp = msgs.slice(beforeHeart).find(m => m.event && m.event.includes('Heart'));
  check('心跳响应', !!heartResp || msgs.length > beforeHeart, heartResp ? heartResp.event : '收到' + (msgs.length - beforeHeart) + '条消息');

  // 5. 获取游戏列表
  console.log('\n5. Msg_Hall_GetGameList');
  const beforeList = msgs.length;
  ws.send(b64encode({ event: 'Msg_Hall_GetGameList', area: 0, uid: uid, data: {} }));
  await new Promise(r => setTimeout(r, 1500));
  const listResp = msgs.slice(beforeList).find(m => m.event && (m.event.includes('GameList') || m.event.includes('Game')));
  check('游戏列表', !!listResp, listResp ? listResp.event : '无响应');

  // 6. 进入百家乐 (gtype=8, Msg_Game_GetState)
  console.log('\n6. 进入百家乐 (Msg_Game_GetState, gtype=8)');
  const beforeBJL = msgs.length;
  ws.send(b64encode({ event: 'Msg_Game_GetState', area: 0, uid: uid, data: { gtype: 8, roomId: 80000001 } }));
  await new Promise(r => setTimeout(r, 1500));
  const bjlResp = msgs.slice(beforeBJL);
  const bjlOk = bjlResp.some(m => m.event && (m.event.includes('State') || m.event.includes('BJL') || m.event.includes('RoomInfo')));
  check('百家乐游戏状态', bjlOk, bjlResp.length > 0 ? bjlResp.map(m=>m.event).join(',') : '无响应');

  // 7. 百家乐下注
  console.log('\n7. 百家乐下注 (Msg_Game_Bet, gtype=8)');
  const beforeBet = msgs.length;
  ws.send(b64encode({ event: 'Msg_Game_Bet', area: 0, uid: uid, data: { gtype: 8, roomId: 80000001, area: 'xian', gold: 100 } }));
  await new Promise(r => setTimeout(r, 2000));
  const betResp = msgs.slice(beforeBet);
  const betOk = betResp.some(m => m.event && (m.event.includes('Bet') || m.event.includes('Settle') || m.status === 1));
  check('百家乐下注', betOk, betResp.length > 0 ? betResp.map(m=>m.event).join(',') : '无响应');

  // 8. 进入龙虎斗 (gtype=6)
  console.log('\n8. 进入龙虎斗 (Msg_Game_GetState, gtype=6)');
  const beforeLHD = msgs.length;
  ws.send(b64encode({ event: 'Msg_Game_GetState', area: 0, uid: uid, data: { gtype: 6, roomId: 60000001 } }));
  await new Promise(r => setTimeout(r, 1500));
  const lhdResp = msgs.slice(beforeLHD);
  const lhdOk = lhdResp.some(m => m.event && (m.event.includes('State') || m.event.includes('LHD') || m.event.includes('RoomInfo')));
  check('龙虎斗游戏状态', lhdOk, lhdResp.length > 0 ? lhdResp.map(m=>m.event).join(',') : '无响应');

  // 总结
  console.log('\n=== 测试总结 ===');
  const passed = results.filter(r => r.pass).length;
  const total = results.length;
  console.log(`通过: ${passed}/${total}`);
  results.forEach(r => console.log(`  [${r.pass ? '✓' : '✗'}] ${r.name}`));

  ws.close();
  process.exit(passed === total ? 0 : 1);
}

main().catch(e => { console.error('异常:', e.message); process.exit(1); });

// Cocos客户端联调测试 - 详细错误诊断版
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
  console.log('=== 详细诊断 ===\n');

  // 1. HTTP登录 - 完整响应
  console.log('1. HTTP登录:');
  const loginRes = await httpPost('http://localhost:8000/Login', {
    uid: 'test001', password: '123456', equipmentcard: 'test-dev', type: 0, code: ''
  });
  console.log('  状态:', loginRes.status);
  console.log('  完整响应:', JSON.stringify(loginRes.body, null, 2));

  // 2. WS连接
  console.log('\n2. WS连接:');
  const ws = new WebSocket('ws://localhost:10000');
  let msgs = [];
  ws.on('open', () => console.log('  连接成功'));
  ws.on('message', (data) => {
    try {
      const d = b64decode(data.toString());
      msgs.push(d);
      console.log('  ← 完整消息:', JSON.stringify(d));
    } catch { console.log('  ← 原始:', data.toString().substring(0, 200)); }
  });
  ws.on('error', e => console.log('  错误:', e.message));

  await new Promise(r => setTimeout(r, 2000));

  // 3. 发送多种可能的登录消息格式
  console.log('\n3. 尝试登录消息格式:');
  
  // 格式A: Msg_Hall_Login with data
  const msgA = b64encode({ event: 'Msg_Hall_Login', area: 0, uid: 'test001', data: { uid: 'test001', password: '123456' } });
  ws.send(msgA);
  console.log('  → 格式A: Msg_Hall_Login');
  await new Promise(r => setTimeout(r, 1000));

  // 格式B: 直接data在顶层
  const msgB = b64encode({ event: 'Msg_Hall_Login', area: 0, uid: 'test001', password: '123456' });
  ws.send(msgB);
  console.log('  → 格式B: 顶层password');
  await new Promise(r => setTimeout(r, 1000));

  // 格式C: Msg_Login
  const msgC = b64encode({ event: 'Msg_Login', area: 0, uid: 'test001', data: { uid: 'test001', token: '' } });
  ws.send(msgC);
  console.log('  → 格式C: Msg_Login');
  await new Promise(r => setTimeout(r, 1000));

  // 4. 心跳
  console.log('\n4. 心跳:');
  ws.send(b64encode({ event: 'Msg_Hall_Heart', area: 0, uid: 'test001', data: {} }));
  console.log('  → Msg_Hall_Heart');
  await new Promise(r => setTimeout(r, 1000));

  console.log('\n=== 总结 ===');
  console.log('总消息:', msgs.length);
  ws.close();
}

main().catch(e => { console.error(e); process.exit(1); });

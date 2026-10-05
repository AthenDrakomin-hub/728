// 全量21款游戏联调测试 - Cocos客户端协议 Msg_Game_GetState
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

// 客户端游戏ID映射 (gtype -> 游戏名)
const GAMES = [
  { gtype: 1, name: 'FQZS', label: '飞禽走兽' },
  { gtype: 2, name: 'BRNN', label: '百人牛牛' },
  { gtype: 3, name: 'HBSL', label: '红包扫雷' },
  { gtype: 6, name: 'LHD', label: '龙虎斗' },
  { gtype: 7, name: 'BCBM', label: '奔驰宝马' },
  { gtype: 8, name: 'BJL', label: '百家乐' },
  { gtype: 9, name: 'SDB', label: '十点半' },
  { gtype: 13, name: 'DNTG', label: '大闹天宫' },
  { gtype: 14, name: 'QZNN', label: '抢庄牛牛' },
  { gtype: 15, name: 'ERNN', label: '二人牛牛' },
  { gtype: 16, name: 'HLWZ', label: '欢乐五子' },
  { gtype: 17, name: 'ERQS', label: '二人抢庄' },
  { gtype: 18, name: 'TBNN', label: '通比牛牛' },
  { gtype: 19, name: 'DZPK', label: '德州扑克' },
  { gtype: 20, name: 'ZJH', label: '炸金花' },
  { gtype: 21, name: 'SRNN', label: '百人牛牛2' },
  { gtype: 22, name: 'JXLW', label: '金龙揽月' },
  { gtype: 23, name: 'SHZ', label: '三张' },
  { gtype: 26, name: 'DFDC', label: '东方明珠' },
  { gtype: 28, name: 'WZMJ', label: '温州麻将' },
  { gtype: 1000, name: 'MJHJ', label: '麻将胡了' },
];

async function main() {
  console.log('=== 全量21款游戏联调测试 (Msg_Game_GetState) ===\n');

  // 1. HTTP登录
  const loginRes = await httpPost('http://localhost:8000/Login', {
    uid: 'test001', password: '123456', equipmentcard: 'full-test', type: 0, code: ''
  });
  const token = loginRes.body?.data?.token || '';
  const uid = loginRes.body?.data?.uid || 0;
  console.log(`登录: uid=${uid}, gold=${loginRes.body?.data?.gold}`);

  // 2. WS连接 + Connect
  const ws = new WebSocket('ws://localhost:10000');
  await new Promise((r, j) => { ws.on('open', r); ws.on('error', j); setTimeout(() => j(new Error('timeout')), 5000); });
  ws.send(b64encode({ event: 'Msg_Hall_Connect', area: 0, uid, data: { token } }));
  await new Promise(r => setTimeout(r, 1000));
  console.log('WS连接+认证完成\n');

  // 3. 测试Msg_Hall_GetGameList
  console.log('--- Msg_Hall_GetGameList ---');
  let gameListResp = null;
  ws.on('message', (d) => { try { const m = b64decode(d.toString()); if (m.event === 'Msg_Hall_GetGameList') gameListResp = m; } catch {} });
  ws.send(b64encode({ event: 'Msg_Hall_GetGameList', area: 0, uid, data: {} }));
  await new Promise(r => setTimeout(r, 1000));
  if (gameListResp && gameListResp.status === 1) {
    console.log(`PASS: 返回${gameListResp.data?.list?.length || 0}款游戏`);
  } else {
    console.log('FAIL: 无响应或status!=1', gameListResp ? JSON.stringify(gameListResp).substring(0, 200) : '');
  }

  // 4. 逐款测试Msg_Game_GetState
  console.log('\n--- 21款游戏 Msg_Game_GetState ---');
  const results = [];
  for (const game of GAMES) {
    let resp = null;
    const handler = (d) => {
      try {
        const m = b64decode(d.toString());
        if (m.event && m.event.includes(game.name) && m.event.includes('State')) resp = m;
        if (m.event === 'Msg_Hall_ERROR' && m.data?.message?.includes(game.gtype)) resp = m;
      } catch {}
    };
    ws.on('message', handler);
    const roomId = game.gtype * 10000000 + 1;
    ws.send(b64encode({ event: 'Msg_Game_GetState', area: 0, uid, data: { gtype: game.gtype, roomId } }));
    await new Promise(r => setTimeout(r, 800));
    ws.removeListener('message', handler);

    const ok = resp && resp.event && resp.event.includes(game.name);
    const isError = resp && resp.event === 'Msg_Hall_ERROR';
    results.push({ ...game, ok, isError, event: resp?.event });
    const status = ok ? 'PASS' : (isError ? 'FAIL(不支持)' : 'FAIL(无响应)');
    console.log(`  [${status}] gtype=${game.gtype} ${game.name}(${game.label}) -> ${resp?.event || '无响应'}`);
  }

  // 5. 测试Msg_Hall_FinishLoad
  console.log('\n--- Msg_Hall_FinishLoad ---');
  let finishResp = null;
  const h2 = (d) => { try { const m = b64decode(d.toString()); if (m.event === 'Msg_Hall_FinishLoad') finishResp = m; } catch {} };
  ws.on('message', h2);
  ws.send(b64encode({ event: 'Msg_Hall_FinishLoad', area: 0, uid, data: { rid: 80000001 } }));
  await new Promise(r => setTimeout(r, 800));
  ws.removeListener('message', h2);
  console.log(finishResp?.status === 1 ? 'PASS' : 'FAIL', finishResp ? JSON.stringify(finishResp).substring(0, 150) : '无响应');

  // 总结
  console.log('\n=== 总结 ===');
  const passed = results.filter(r => r.ok).length;
  const failed = results.filter(r => !r.ok).length;
  console.log(`游戏状态: ${passed}/${results.length} PASS, ${failed} FAIL`);
  if (failed > 0) {
    console.log('失败列表:');
    results.filter(r => !r.ok).forEach(r => console.log(`  gtype=${r.gtype} ${r.name}(${r.label})`));
  }

  ws.close();
  process.exit(passed === results.length ? 0 : 1);
}

main().catch(e => { console.error('异常:', e.message); process.exit(1); });

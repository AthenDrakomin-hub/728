/**
 * 728平台 压力测试脚本
 * 用法: node stress_test.js [并发数] [持续秒数]
 * 默认: 50并发, 30秒
 */
const http = require("http");
const WebSocket = require("ws");

const CONCURRENCY = Number(process.argv[2]) || 50;
const DURATION = Number(process.argv[3]) || 30;
const HOST = "localhost";
const HTTP_PORT = 8000;
const WS_PORT = 10000;

let httpSuccess = 0;
let httpFail = 0;
let wsSuccess = 0;
let wsFail = 0;
let startTime = Date.now();

function httpGet(path) {
  return new Promise((resolve) => {
    const start = Date.now();
    http.get(`http://${HOST}:${HTTP_PORT}${path}`, (res) => {
      const latency = Date.now() - start;
      if (res.statusCode === 200) httpSuccess++;
      else httpFail++;
      res.resume();
      resolve(latency);
    }).on("error", () => { httpFail++; resolve(0); });
  });
}

async function wsTest(id) {
  return new Promise((resolve) => {
    const ws = new WebSocket(`ws://${HOST}:${WS_PORT}`);
    const timer = setTimeout(() => { ws.close(); wsFail++; resolve(); }, 5000);
    ws.on("open", () => {
      ws.send(Buffer.from(JSON.stringify({ event: "Msg_Hall_Heart", area: 0, uid: 0, data: {} })).toString("base64"));
    });
    ws.on("message", () => {
      clearTimeout(timer);
      wsSuccess++;
      ws.close();
      resolve();
    });
    ws.on("error", () => { clearTimeout(timer); wsFail++; resolve(); });
  });
}

async function runHttpLoad() {
  const endTime = Date.now() + DURATION * 1000;
  while (Date.now() < endTime) {
    const promises = [];
    for (let i = 0; i < CONCURRENCY; i++) {
      promises.push(httpGet("/health"));
      promises.push(httpGet("/api/games"));
    }
    await Promise.all(promises);
  }
}

async function runWsLoad() {
  const endTime = Date.now() + DURATION * 1000;
  while (Date.now() < endTime) {
    const promises = [];
    for (let i = 0; i < Math.floor(CONCURRENCY / 2); i++) {
      promises.push(wsTest(i));
    }
    await Promise.all(promises);
  }
}

async function main() {
  console.log(`=== 728 压力测试 ===`);
  console.log(`并发: ${CONCURRENCY}, 持续: ${DURATION}秒`);
  console.log(`目标: http://${HOST}:${HTTP_PORT}, ws://${HOST}:${WS_PORT}`);
  console.log();

  // 先检查服务是否可用
  try {
    await httpGet("/health");
  } catch (e) {
    console.log("错误: 服务不可用，请先启动服务端");
    process.exit(1);
  }

  console.log("运行中...");
  await Promise.all([runHttpLoad(), runWsLoad()]);

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const httpTotal = httpSuccess + httpFail;
  const wsTotal = wsSuccess + wsFail;

  console.log();
  console.log("=== 测试结果 ===");
  console.log(`持续时间: ${elapsed}秒`);
  console.log();
  console.log("HTTP:");
  console.log(`  总请求: ${httpTotal}`);
  console.log(`  成功: ${httpSuccess} (${httpTotal > 0 ? ((httpSuccess / httpTotal) * 100).toFixed(1) : 0}%)`);
  console.log(`  失败: ${httpFail}`);
  console.log(`  QPS: ${(httpTotal / elapsed).toFixed(1)}`);
  console.log();
  console.log("WebSocket:");
  console.log(`  总连接: ${wsTotal}`);
  console.log(`  成功: ${wsSuccess} (${wsTotal > 0 ? ((wsSuccess / wsTotal) * 100).toFixed(1) : 0}%)`);
  console.log(`  失败: ${wsFail}`);
  console.log(`  连接/秒: ${(wsTotal / elapsed).toFixed(1)}`);
  console.log();

  if (httpFail === 0 && wsFail === 0) {
    console.log("全部通过!");
    process.exit(0);
  } else {
    console.log("存在失败，建议检查服务端日志");
    process.exit(1);
  }
}

main().catch(console.error);

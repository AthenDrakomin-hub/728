// Cocos客户端静态文件服务器 - 端口8081
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8081;
const ROOT = path.join(__dirname, '..', '728_original', 'client', 'cocos-project', 'build', 'web-mobile');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.plist': 'application/xml',
  '.xml': 'application/xml',
};

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';
  
  const filePath = path.join(ROOT, urlPath);
  
  // 安全检查：防止目录遍历
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // 尝试返回index.html（SPA支持）
      const indexPath = path.join(ROOT, 'index.html');
      if (fs.existsSync(indexPath)) {
        fs.readFile(indexPath, (e, data) => {
          if (e) { res.writeHead(404); res.end('Not Found'); return; }
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(data);
        });
      } else {
        res.writeHead(404);
        res.end('Not Found');
      }
      return;
    }
    
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME[ext] || 'application/octet-stream';
    
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
    });
    
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Cocos客户端服务器启动: http://localhost:${PORT}`);
  console.log(`根目录: ${ROOT}`);
  console.log(`index.html存在: ${fs.existsSync(path.join(ROOT, 'index.html'))}`);
});

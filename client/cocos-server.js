// Cocos客户端静态文件服务器 - 端口8081
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8081;
const ROOT = path.join(__dirname, '..', '728_original', 'client', 'cocos-project', 'build', 'web-mobile');
const ASSETS_728 = path.join(__dirname, '..', 'assets-728');

// 19款游戏代码（用于/assets/XXX路径映射到assets-728/games/XXX）
const GAME_CODES = ['BCBM','BRNN','DFDC','DNTG','DZPK','ERNN','ERQS','FQZS','HBSL','HLWZ','JXLW','MJHJ','QZNN','SDB','SHZ','SRNN','TBNN','WZMJ','ZJH'];

/**
 * 将URL路径映射到assets-728目录的实际路径
 * 返回null表示不匹配
 */
function mapToAssets728(urlPath) {
  // /bjl-assets/xxx -> assets-728/bjl/xxx
  if (urlPath.startsWith('/bjl-assets/')) {
    return path.join(ASSETS_728, 'bjl', urlPath.replace('/bjl-assets/', ''));
  }
  // /lhd-assets/xxx -> assets-728/lhd/xxx
  if (urlPath.startsWith('/lhd-assets/')) {
    return path.join(ASSETS_728, 'lhd', urlPath.replace('/lhd-assets/', ''));
  }
  // /assets/_shared/xxx -> assets-728/_shared/xxx
  if (urlPath.startsWith('/assets/_shared/')) {
    return path.join(ASSETS_728, '_shared', urlPath.replace('/assets/_shared/', ''));
  }
  // /assets/hall/xxx -> assets-728/hall/xxx
  if (urlPath.startsWith('/assets/hall/')) {
    return path.join(ASSETS_728, 'hall', urlPath.replace('/assets/hall/', ''));
  }
  // /assets/{GAMECODE}/xxx -> assets-728/games/{GAMECODE}/xxx
  for (const code of GAME_CODES) {
    if (urlPath.startsWith('/assets/' + code + '/')) {
      return path.join(ASSETS_728, 'games', code, urlPath.replace('/assets/' + code + '/', ''));
    }
  }
  return null;
}

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
      // Fallback 1: 尝试从assets-728独立素材目录查找
      const assetsPath = mapToAssets728(urlPath);
      if (assetsPath && fs.existsSync(assetsPath)) {
        const ext = path.extname(assetsPath).toLowerCase();
        const contentType = MIME[ext] || 'application/octet-stream';
        res.writeHead(200, {
          'Content-Type': contentType,
          'Cache-Control': 'no-cache',
          'Access-Control-Allow-Origin': '*',
        });
        fs.createReadStream(assetsPath).pipe(res);
        return;
      }
      // Fallback 2: 尝试返回index.html（SPA支持）
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

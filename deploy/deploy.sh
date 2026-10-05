#!/bin/bash
# ============================================================
# 728棋牌平台 一键生产部署脚本
# 用法: bash deploy.sh [环境]  环境: prod(默认) / test
# ============================================================
set -e

ENV=${1:-prod}
APP_DIR="/opt/728"
BACKUP_DIR="/root/728-backup-$(date +%Y%m%d%H%M%S)"
REPO_URL="https://github.com/AthenDrakomin-hub/728.git"
BRANCH="main"
NODE_VERSION="22"

echo "=========================================="
echo " 728 平台部署 - 环境: $ENV"
echo " 时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo "=========================================="

# 1. 检查Node版本
echo "[1/6] 检查环境..."
if ! command -v node &> /dev/null; then
    echo "错误: Node.js 未安装，请先安装 Node $NODE_VERSION"
    exit 1
fi
echo "  Node版本: $(node -v)"
echo "  npm版本: $(npm -v)"

# 2. 备份当前版本
echo "[2/6] 备份当前版本..."
if [ -d "$APP_DIR" ]; then
    mkdir -p "$BACKUP_DIR"
    cp -r "$APP_DIR"/* "$BACKUP_DIR/" 2>/dev/null || true
    echo "  备份完成: $BACKUP_DIR"
else
    echo "  无旧版本，跳过备份"
    mkdir -p "$APP_DIR"
fi

# 3. 拉取最新代码
echo "[3/6] 拉取最新代码..."
TMP_DIR="/tmp/728-deploy-$$"
rm -rf "$TMP_DIR"
git clone --depth 1 -b "$BRANCH" "$REPO_URL" "$TMP_DIR"
echo "  代码拉取完成: $(cd $TMP_DIR && git log --oneline -1)"

# 4. 构建服务端
echo "[4/6] 构建服务端..."
cd "$TMP_DIR/728_original/server"
npm ci --production 2>&1 | tail -3
node scripts/build.js
echo "  服务端构建完成"

# 5. 部署
echo "[5/6] 部署文件..."
# 停止服务
pm2 stop 728-server 2>/dev/null || true

# 复制服务端文件
mkdir -p "$APP_DIR/server"
cp -r dist/ "$APP_DIR/server/"
cp package.json "$APP_DIR/server/"
cp -r node_modules/ "$APP_DIR/server/" 2>/dev/null || true
mkdir -p "$APP_DIR/server/config"
cp config/games.json "$APP_DIR/server/config/" 2>/dev/null || true
mkdir -p "$APP_DIR/server/data"

# 复制前端构建产物(如果有)
if [ -d "$TMP_DIR/728_original/client/cocos-project/build/web-mobile" ]; then
    mkdir -p "$APP_DIR/web-ui"
    cp -r "$TMP_DIR/728_original/client/cocos-project/build/web-mobile/"* "$APP_DIR/web-ui/"
    echo "  前端文件已部署"
fi

# 6. 启动服务
echo "[6/6] 启动服务..."
cd "$APP_DIR/server"
export PORT=8000
export WS_PORT=10000
export NODE_ENV=production
export LOG_LEVEL=info

pm2 start dist/index.js --name 728-server --time 2>/dev/null || pm2 restart 728-server
pm2 save 2>/dev/null || true

# 健康检查
echo ""
echo "等待服务启动..."
sleep 3
HEALTH=$(curl -s http://localhost:8000/health 2>/dev/null || echo "FAIL")
if echo "$HEALTH" | grep -q "ok"; then
    echo "  健康检查: PASS"
else
    echo "  健康检查: FAIL ($HEALTH)"
    echo "  查看日志: pm2 logs 728-server"
fi

# 清理
rm -rf "$TMP_DIR"

echo ""
echo "=========================================="
echo " 部署完成!"
echo "  HTTP: http://localhost:8000"
echo "  WS:   ws://localhost:10000"
echo "  管理: pm2 logs 728-server"
echo "  备份: $BACKUP_DIR"
echo "=========================================="

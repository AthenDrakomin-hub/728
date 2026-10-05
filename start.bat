@echo off
chcp 65001 >nul
echo ==========================================
echo   728棋牌平台 - 一键启动
echo ==========================================
echo.

cd /d "%~dp0728_original\server"

echo [1/3] 构建服务端...
call node scripts/build.js
if errorlevel 1 (
    echo 构建失败!
    pause
    exit /b 1
)

echo [2/3] 停止旧进程...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8000 :10000" ^| findstr LISTENING') do (
    taskkill /f /pid %%a >nul 2>&1
)
timeout /t 1 /nobreak >nul

echo [3/3] 启动服务端...
set PORT=8000
set WS_PORT=10000
set NODE_ENV=development
start "728-Server" node dist/index.js

timeout /t 3 /nobreak >nul

echo.
echo ==========================================
echo   启动完成!
echo   HTTP API:  http://localhost:8000
echo   WebSocket: ws://localhost:10000
echo   后台管理:  http://localhost:8000/admin/
echo   健康检查:  http://localhost:8000/health
echo.
echo   测试账号: test001 / 123456
echo   管理员:   admin / 123456
echo ==========================================
echo.
pause

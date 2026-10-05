/**
 * PM2 进程管理配置
 * 用法: pm2 start ecosystem.config.js
 */
module.exports = {
  apps: [
    {
      name: "728-server",
      script: "./dist/index.js",
      cwd: "/opt/728/server",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 8000,
        WS_PORT: 10000,
        LOG_LEVEL: "info",
      },
      error_file: "/var/log/728/error.log",
      out_file: "/var/log/728/out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      merge_logs: true,
    },
  ],

  deploy: {
    production: {
      user: "root",
      host: "45.77.31.155",
      ref: "origin/main",
      repo: "https://github.com/AthenDrakomin-hub/728.git",
      path: "/opt/728",
      "post-deploy": "cd 728_original/server && npm ci && node scripts/build.js && pm2 reload ecosystem.config.js --env production",
    },
  },
};

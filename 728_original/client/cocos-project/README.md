# 728 棋牌客户端 (Cocos Creator 2.4.3)

基于 QuickFramework 搭建的 728 原版客户端还原项目。

## 目录结构

\\\
assets/
├── bundles/
│   └── hall/              # 大厅 bundle (参考QuickFramework)
├── resources/
│   ├── 728-games/         # 728 游戏资源 (由 rebuild_assets.py 生成)
│   ├── common/            # 公共资源
│   └── login/             # 登录资源
└── script/
    ├── framework/         # QuickFramework 框架
    ├── common/            # 公共脚本
    ├── login/             # 登录脚本
    └── 728-decrypted/     # 728 解密源码
        ├── engine/         #   cocos2d-jsb.js, physics.js, internal.js, settings.js
        ├── games/          #   25款游戏解密 JS (BCBM, BJL, ZJH...)
        └── main.js         #   大厅主 bundle (434KB)
\\\

## 技术栈
- Cocos Creator 2.4.3
- JavaScript (解密源码 ES5 bundle)
- Asset Bundle 大厅+子游戏架构

## 下一步
1. 运行 tools/rebuild_assets.py 重建资源 .meta
2. 用 Cocos Creator 2.4.3 打开项目
3. 修改 main.js 中 wNetWork 服务器地址指向本地

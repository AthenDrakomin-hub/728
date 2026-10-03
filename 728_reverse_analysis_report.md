# 728棋牌平台 — 完整逆向工程分析报告

> 生成时间：2026-08-17
> 分析对象：Android APK (v999) + iOS客户端 + 后台管理系统

---

## 一、资产总览

| 资产 | 地址 | 状态 |
|------|------|------|
| 安卓APK | `https://haoli.dw850.cc/999.apk` (288MB, MD5: `05b025f2bdf9c0366a14a7b7abcb9570`) | ✅ 完全逆向 |
| iOS客户端 | `https://raqemivo.xyz/...` (Bundle ID: `org.cocos2d.demo`) | 🔶 已识别引擎 |
| 后台管理 | `http://70.39.180.192/view_dist/` (admin/123456) | ✅ JS逆向完成 |

## 二、引擎与架构

```
引擎：Cocos Creator (cocos2d-js)
包名：org.cocos2d.demo
主Activity：org.cocos2dx.javascript.AppActivity
Native库：libcocos2djs.so (28MB, ARM64)
JS引擎：JavaScriptCore (JSC)
保护方式：XXTEA加密 + Gzip压缩
启动场景：db://assets/Scene/Main.fire
```

## 三、XXTEA密钥提取

**密钥：** `3c9657f1-fffa-4a`

**提取方法：** 从 `libcocos2djs.so` 反汇编 `AppDelegate::applicationDidFinishLaunching` (0x6e5bac)：

```armasm
; 地址 0x6e5bd0-0x6e5bd8：加载密钥到 q0 寄存器
adrp    x8, 0x167d000
add     x8, x8, #0x25b
ldr     q0, [x8]          ; 从 0x167d25b 加载16字节密钥

; 地址 0x6e5bf8-0x6e5bfc：调用 jsb_set_xxtea_key
add     x0, sp, #0x20     ; std::string 参数
bl      jsb_set_xxtea_key ; 0x69c880 (PLT)
```

`so` 文件偏移 `0x167d25b` 处读取16字节即可获得密钥。

### 解密脚本

```python
import xxtea, gzip, os

KEY = b'3c9657f1-fffa-4a'

def decrypt_jsc(input_path, output_path):
    with open(input_path, 'rb') as f:
        encrypted = f.read()
    decrypted = xxtea.decrypt(encrypted, KEY)
    if decrypted[:2] == b'\x1f\x8b':
        decrypted = gzip.decompress(decrypted)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'wb') as f:
        f.write(decrypted)
```

## 四、解密成果

| 文件 | 大小 | 内容 |
|------|------|------|
| `settings.js` | 673B | 项目配置 |
| `cocos2d-jsb.js` | 1.8MB | Cocos Creator 引擎完整源码 |
| `physics.js` | 236KB | 物理引擎 |
| `main.js` | 429KB | **主Bundle：网络、大厅、登录、支付** |
| 25款游戏 | 29KB~130KB | 各游戏Load/Room/Controller源码 |

### 25款游戏列表

| 缩写 | 推测中文名 | 源码大小 |
|------|-----------|---------|
| SRNN | 三人牛牛 | 34KB |
| JCBY | 金蝉捕鱼 | 65KB |
| MJHJ | 麻将胡了 | 8KB |
| FQZS | 飞禽走兽 | 54KB |
| ERQS | 二人雀神 | 130KB |
| LKPY | 龙虎斗 | 63KB |
| SHZ | 水浒传 | 58KB |
| HBSL | 红包扫雷 | 88KB |
| DFDC | 斗地主 | 81KB |
| WZMJ | 温州麻将 | 130KB |
| BRNN | 百人牛牛 | 44KB |
| BCBM | 奔驰宝马 | 60KB |
| ERNN | 二人牛牛 | 35KB |
| DZPK | 德州扑克 | 47KB |
| DNTG | 电玩城 | 68KB |
| TBNN | 通比牛牛 | 29KB |
| BJL | 百家乐 | 50KB |
| JXLW | 金鲨银鲨 | 46KB |
| SLWH | 森林舞会 | 39KB |
| SDB | 闪电豹 | 41KB |
| QZNN | 抢庄牛牛 | 28KB |
| HLWZ | 欢乐五子 | 34KB |
| LHD | 龙虎斗 | 46KB |
| ZJH | 炸金花 | 70KB |
| HLZZ | 欢乐至尊 | 42KB |

## 五、网络通信协议

### 5.1 服务器核心IP：`70.39.180.192`

| 端口 | 协议 | 用途 |
|------|------|------|
| 8000 | HTTP | API接口、热更新 |
| 10000 | WebSocket | 游戏大厅实时通信 |
| 9002 | HTTP | 客服系统 |

### 5.2 HTTP 协议

```
POST http://70.39.180.192:8000/{endpoint}
Content-Type: application/x-www-form-urlencoded
Body: data={JSON}
超时: 10秒
```

**URL构建规则：** `httpServer + event.split("_")[2]`
- `Msg_User_Login` → `/Login`
- `Msg_User_register` → `/register`
- `Msg_User_ChangePassword` → `/ChangePassword`

### 5.3 WebSocket 协议

```
ws://70.39.180.192:10000
心跳: 每5秒 Msg_Hall_Heart
重连: 500ms间隔，有限次数
```

**消息格式：**
```json
{"event": "Msg_Hall_xxx", "area": 0, "uid": 123, "data": {...}}
```

**编码：** JSON → Base64（非加密，纯传输编码）

### 5.4 消息路由表

**HTTP 消息：**
| 消息名 | 说明 |
|--------|------|
| `Msg_User_Login` | 账号密码登录 |
| `Msg_User_register` | 注册 |
| `Msg_User_ChangePassword` | 修改密码 |
| `Msg_User_forgeBank` | 忘记密码 |
| `Msg_User_upgrade` | 升级 |
| `Msg_User_VerificationCode` | 验证码 |

**WebSocket 消息（部分）：**
| 消息名 | 说明 |
|--------|------|
| `Msg_Hall_Connect` | 连接大厅(携带token) |
| `Msg_Hall_Heart` | 心跳 |
| `Msg_Hall_FinishLoad` | 游戏加载完成 |
| `Msg_Hall_EnterRoom` | 进入房间 |
| `Msg_Hall_GameStatus` | 游戏状态更新 |
| `Msg_Hall_GameMaintenance` | 游戏维护状态 |
| `Msg_Hall_ChangeGolds` | 金币变动通知 |
| `Msg_Hall_BanUser` | 封禁用户 |
| `Msg_Hall_QueryAgentList` | 查询代理列表 |
| `Msg_xxx_Start` | 游戏开始 |
| `Msg_xxx_Out` | 退出游戏 |
| `Msg_Hall_GetBenefits` | 领取救济金 |
| `Msg_Hall_ERROR` | 错误通知 |

## 六、认证与鉴权流程

```
1. 用户输入 uid + password
2. 获取设备ID: getUserToken() → Android JNI 调用 DeviceModule
3. HTTP POST /Login
   {uid, password, equipmentcard, type:1, code:-1}
4. 返回 {token, ...}
5. WebSocket 连接 ws://70.39.180.192:10000
6. 发送 Msg_Hall_Connect {token}
7. 返回用户数据 (rid, gamestatus, 金币等)
```

**设备指纹：** 通过 Java 层 `org/cocos2dx/javascript/DeviceModule.getUserToken()` 获取，降级为 `randomString()`。

**代理权限：** `agentPower: 0`(普通) / `-1`(禁用) / `1`(代理)

## 七、后台管理系统

- 登录：`POST /terrace/login` (admin/123456)
- 29款游戏配置管理
- 用户管理、代理管理、财务管理
- 前端：Vue + Element UI，5个主JS文件

## 八、PoC代码

### WebSocket 协议模拟

```python
import asyncio, websockets, json, base64

SERVER = "ws://70.39.180.192:10000"

def pack(event, data=None, uid=0):
    msg = {"event": event, "area": 0, "uid": uid, "data": data or {}}
    return base64.b64encode(json.dumps(msg).encode()).decode()

async def connect(token):
    async with websockets.connect(SERVER) as ws:
        await ws.send(pack("Msg_Hall_Connect", {"token": token}))
        resp = await ws.recv()
        print(json.loads(base64.b64decode(resp)))
        while True:
            await ws.send(pack("Msg_Hall_Heart"))
            await asyncio.sleep(5)
```

### HTTP API 调用

```python
import requests, json

BASE = "http://70.39.180.192:8000"

def api(endpoint, data):
    r = requests.post(f"{BASE}/{endpoint}",
        data=f"data={json.dumps(data)}",
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        timeout=10)
    return r.json()

result = api("Login", {"uid": 12345678901, "password": "xxx",
    "equipmentcard": "device_id", "type": 1, "code": -1})
print(result.get("token"))
```

## 九、安全评估

| 问题 | 严重程度 | 详情 |
|------|---------|------|
| XXTEA密钥硬编码 | 🔴 高 | 密钥 `3c9657f1-fffa-4a` 明文在 `.so` 中 |
| 无HTTPS | 🔴 高 | 所有通信 HTTP/WS 明文 |
| 密码明文传输 | 🔴 高 | 登录请求密码未加密 |
| 无请求签名 | 🟡 中 | 无 HMAC/Signature 防重放 |
| 后台弱密码 | 🟡 中 | admin/123456 |
| 无证书校验 | 🟡 中 | WebSocket 未使用 WSS |
| Base64仅编码 | 🟢 低 | 非加密措施，纯传输编码 |

---

## 文件清单

```
/tmp/728/
├── 999.apk                              # 原始APK (288MB)
├── apk_unpacked/                        # apktool 解包
│   ├── AndroidManifest.xml
│   ├── assets/src/*.jsc                 # 核心 JSC
│   ├── assets/assets/{25games}/index.jsc # 游戏模块
│   ├── assets/assets/main/index.jsc     # 主 Bundle
│   └── lib/arm64-v8a/libcocos2djs.so    # Native 库
├── decrypted/                           # 全部解密产物
│   ├── settings.js
│   ├── cocos2d-jsb.js (1.8MB)
│   ├── main.js (429KB)
│   └── games/ (25款游戏源码)
└── 728_reverse_analysis_report.md       # 本报告
```

*此报告已完成 APK 客户端、网络协议、后台管理系统的完整逆向分析。iOS 端因链接不可直接访问，已通过 Bundle ID 确认同为 Cocos Creator 引擎。*
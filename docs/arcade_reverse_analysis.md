# 728电玩类游戏逆向分析报告

## 概述

从 `728_decrypted/games/` 目录中逆向分析8款电玩类游戏的客户端逻辑，提取网络协议、状态机、赔率配置和结算算法，为服务端实现提供依据。

## 通用架构模式

所有电玩类游戏遵循相同的Cocos Creator模块化架构：

```
{GAME}_Controller  - 游戏控制器，网络消息监听和分发
{GAME}_DataMgr     - 数据管理器，游戏状态、下注记录、赔率配置
{GAME}_View        - 视图层，UI更新和动画播放
{GAME}_GameOver    - 结算界面
MultiBase           - 游戏基类，通用逻辑
Config              - 游戏配置
```

## 通用网络协议

### 服务端 → 客户端消息

| 消息名 | 说明 | 数据字段 |
|--------|------|----------|
| Msg_{GAME}_RoomInfo | 房间信息 | 玩家列表、金币、庄家信息、游戏阶段 |
| Msg_{GAME}_StageBet | 进入下注阶段 | 下注倒计时 |
| Msg_{GAME}_StageEnd | 进入结算阶段 | 开奖结果、各区域中奖情况 |
| Msg_{GAME}_ActBet | 玩家下注广播 | uid, region, gold |
| Msg_{GAME}_SysActBet | 系统同步下注 | 各区域总下注额 |
| Msg_{GAME}_Out | 开奖结果 | CurWheelDiscIndex, 中奖区域 |
| Msg_{GAME}_ToBanker | 上庄通知 | 庄家信息 |
| Msg_{GAME}_BankerInfo | 庄家信息 | 庄家金币、下注限制 |
| Msg_{GAME}_PlayerAct | 玩家操作 | 操作类型、参数 |

### 客户端 → 服务端消息

| 消息名 | 说明 | 数据字段 |
|--------|------|----------|
| Msg_{GAME}_Bet | 下注 | region(区域ID), gold(下注金额) |
| Msg_{GAME}_ApplyBanker | 申请上庄 | - |
| Msg_{GAME}_LeaveBanker | 下庄 | - |

## 通用状态机

```
┌─────────┐    ┌──────────┐    ┌──────────┐    ┌─────────┐
│ Waiting │───→│ StageBet │───→│ StageEnd │───→│  Out    │
│ (等待)  │    │ (下注中) │    │ (结算中) │    │ (开奖)  │
└─────────┘    └──────────┘    └──────────┘    └─────────┘
                     ↑                                │
                     └────────────────────────────────┘
                          (循环下一局)
```

- **Waiting**: 等待玩家加入，显示历史开奖记录
- **StageBet**: 下注阶段，倒计时通常15-30秒，玩家可下注
- **StageEnd**: 停止下注，播放开奖动画
- **Out**: 显示开奖结果和结算，3-5秒后进入下一局

## 各游戏详细分析

### 1. BCBM (奔驰宝马) - 60.2KB / 1692行

**游戏类型**: 轮盘类，8个下注区域

**下注区域与赔率**:
| 区域 | 名称 | ServerRegion | 赔率 |
|------|------|-------------|------|
| 0 | 大保时捷 | 21 | 40 |
| 1 | 大奔驰 | 22 | 30 |
| 2 | 大宝马 | 23 | 20 |
| 3 | 大大众 | 24 | 10 |
| 4 | 小保时捷 | 11 | 5 |
| 5 | 小奔驰 | 12 | 5 |
| 6 | 小宝马 | 13 | 5 |
| 7 | 小大众 | 14 | 5 |

**轮盘**: 32个位置，每个区域4个位置，随机停在某个位置
**开奖字段**: `CurWheelDiscIndex` (0-31)
**特殊**: 支持上庄，庄家与闲家对赌

### 2. FQZS (飞禽走兽) - 54.7KB / 1593行

**游戏类型**: 轮盘类，飞禽/走兽两大类别
**特点**: 类似奔驰宝马，区域分为飞禽（金鲨、银鲨、燕子、鸽子、孔雀、老鹰）和走兽（狮子、熊猫、猴子、兔子）
**赔率范围**: 2-24倍

### 3. SLWH (森林舞会) - 39.5KB / 1326行

**游戏类型**: 3D动物轮盘
**特点**: 包含3D模型资源（cc.Model, cc.Material, cc.BufferAsset），是唯一使用3D的游戏
**动物**: 狮子、熊猫、猴子、兔子、燕子、鸽子、孔雀、老鹰
**特殊**: 有彩金系统、大灯小灯

### 4. JXLW (金龙揽月) - 47KB / 1636行

**游戏类型**: 轮盘类，龙主题
**特点**: 类似奔驰宝马，区域以龙/月/星等命名
**Spine动画**: 35个sp.SkeletonData资源

### 5. DNTG (大闹天宫) - 68.7KB / 2466行

**游戏类型**: 转轮槽机 (Slot)，5轮3行
**特点**: 西游记主题，孙悟空/猪八戒/沙僧等角色
**特殊功能**: 免费旋转、百搭牌、奖励游戏
**音频**: 44个cc.AudioClip

### 6. DFDC (东方饭店) - 82.2KB / 2939行

**游戏类型**: 转轮槽机 (Slot)，5轮
**特点**: 最大的电玩游戏，美食主题
**特殊功能**: 免费旋转、百搭、分散符号、奖励关卡
**动画**: 9个cc.AnimationClip

### 7. JCBY (金蟾捕鱼) - 65.8KB / 2311行

**游戏类型**: 捕鱼类
**特点**: 实时射击，子弹碰撞检测，鱼群AI
**网络**: 高频同步（位置、角度、子弹）
**Spine**: 66个sp.SkeletonData（最多）
**特殊**: 炮台升级、技能、BOSS鱼

### 8. HBSL (红包扫雷) - 88.1KB / 2310行

**游戏类型**: 红包扫雷（红包接龙变体）
**特点**: 玩家发红包，其他人抢，踩雷赔钱
**逻辑**: 随机生成雷数，按比例分配金额
**特殊**: 不需要实时动画，纯数值计算

## 服务端实现优先级

### 已实现 (STEP 5-6)
- ✅ 麻将类: WZMJ (温州麻将)
- ✅ 牛牛类: BRNN, ERNN, QZNN, SRNN, TBNN
- ✅ 扑克类: ZJH, SHZ

### 电玩类实现建议 (STEP 8)
1. **高优先级** (轮盘类，框架通用):
   - BCBM (奔驰宝马) - 已完成逆向分析，可直接实现
   - FQZS (飞禽走兽) - 同框架
   - JXLW (金龙揽月) - 同框架

2. **中优先级** (槽机类):
   - DNTG (大闹天宫) - 需要转轮算法
   - DFDC (东方饭店) - 需要转轮算法

3. **低优先级** (特殊类型):
   - JCBY (金蟾捕鱼) - 需要实时物理同步
   - SLWH (森林舞会) - 需要3D渲染
   - HBSL (红包扫雷) - 独立玩法

## 通用电玩服务端框架设计

```typescript
interface ArcadeRegion {
  id: number;           // 区域ID
  name: string;         // 区域名称
  serverRegion: number; // 服务端区域ID
  odds: number;         // 赔率
  wheelPositions: number[]; // 轮盘位置
}

interface ArcadeConfig {
  gameType: string;
  regions: ArcadeRegion[];
  betDuration: number;  // 下注时长(秒)
  settleDuration: number; // 结算时长(秒)
  minBet: number;
  maxBet: number;
  supportBanker: boolean;
}

class ArcadeGame {
  stage: "waiting" | "betting" | "settling" | "result";
  bets: Map<uid, Map<regionId, amount>>;  // 玩家下注
  regionTotals: Map<regionId, amount>;     // 区域总下注
  resultRegion: number;                      // 中奖区域
  resultIndex: number;                       // 轮盘位置
  
  start() → 进入下注阶段，倒计时
  bet(uid, region, amount) → 下注
  settle() → 随机开奖，计算赔付
  getState() → 返回游戏状态
}
```

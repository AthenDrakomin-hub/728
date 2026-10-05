/**
 * 客户端数字游戏ID → 服务端字符串代码 映射表
 * 来源: 客户端 main.js L3279-3557 Config.GamePrefab
 * 客户端通过 wGameData.gameID = floor(roomID / 1e7) 计算数字ID
 * 服务端使用字符串代码(WZMJ/BCBM/BJL等)路由游戏实例
 */

export const GAME_ID_MAP: Record<number, string> = {
  1: "FQZS",    // 飞禽走兽
  2: "BRNN",    // 百人牛牛
  3: "HBSL",    // 红包扫雷
  4: "SLWH",    // 森林舞会 (服务端暂未实现)
  6: "LHD",     // 龙虎斗
  7: "BCBM",    // 奔驰宝马
  8: "BJL",     // 欢乐30秒/百家乐
  9: "SDB",     // 十点半/三公
  10: "XLDB",   // 寻龙夺宝 (捕鱼, 服务端暂未实现)
  11: "LKPY",   // 捕鱼大亨 (捕鱼, 服务端暂未实现)
  12: "JCBY",   // 大闹天宫2 (捕鱼, 服务端暂未实现)
  13: "DNTG",   // 大闹天宫 (电玩)
  14: "QZNN",   // 抢庄牛牛
  15: "ERNN",   // 二人牛牛
  16: "HLWZ",   // 欢乐五张/红中五子
  17: "ERQS",   // 二人雀神/二人抢庄
  18: "TBNN",   // 通比牛牛
  19: "DZPK",   // 德州扑克
  20: "ZJH",    // 炸金花
  21: "SRNN",   // 四人牛牛
  22: "JXLW",   // 九线拉王
  23: "SHZ",    // 水浒传/三张牌
  26: "DFDC",   // 多福多财
  28: "WZMJ",   // 温州麻将
  29: "HLZZ",   // 欢乐至尊 (服务端暂未实现)
  1000: "MJHJ", // 麻将合集
};

/** 反向映射: 游戏代码 → 数字ID */
export const GAME_CODE_TO_ID: Record<string, number> = Object.entries(
  GAME_ID_MAP
).reduce((acc, [id, code]) => {
  acc[code] = Number(id);
  return acc;
}, {} as Record<string, number>);

/**
 * 根据客户端数字ID获取服务端游戏代码
 * @param numericId 客户端游戏ID (gtype字段)
 * @returns 服务端游戏代码, 未映射返回null
 */
export function mapGameId(numericId: number): string | null {
  return GAME_ID_MAP[numericId] ?? null;
}

/**
 * 根据服务端游戏代码获取客户端数字ID
 * @param gameCode 服务端游戏代码
 * @returns 客户端数字ID, 未映射返回null
 */
export function mapGameCode(gameCode: string): number | null {
  return GAME_CODE_TO_ID[gameCode] ?? null;
}

// 728平台 - 系统配置
module.exports = {
  // 服务器
  HTTP_PORT: 8000,
  WS_PORT: 10000,

  // 数据库
  DB_PATH: "./data/728.db",

  // JWT
  JWT_SECRET: "728-platform-jwt-secret-2024",
  JWT_EXPIRES: "7d",

  // 平台抽水与返佣（百分比）
  PLATFORM_RAKE_RATE: 3,       // 平台抽水 3%
  AGENT_DEDUCT_RATE: 2,        // 代理信用分扣除 2%
  AGENT_COMMISSION_RATE: 1,    // 代理返佣 1%
  TOP_AGENT_COMMISSION_RATE: 1,// 总代理返佣 1%

  // 游戏配置
  GAME_LIST: [
    { id: "SRNN", name: "三人牛牛", min_players: 2, max_players: 3 },
    { id: "JCBY", name: "金蝉捕鱼", min_players: 1, max_players: 4 },
    { id: "MJHJ", name: "麻将胡了", min_players: 1, max_players: 1 },
    { id: "FQZS", name: "飞禽走兽", min_players: 1, max_players: 6 },
    { id: "ERQS", name: "二人雀神", min_players: 2, max_players: 2 },
    { id: "LKPY", name: "龙虎斗", min_players: 1, max_players: 6 },
    { id: "SHZ",  name: "水浒传", min_players: 1, max_players: 1 },
    { id: "HBSL", name: "红包扫雷", min_players: 2, max_players: 6 },
    { id: "DFDC", name: "斗地主", min_players: 3, max_players: 3 },
    { id: "WZMJ", name: "温州麻将", min_players: 2, max_players: 4 },
    { id: "BRNN", name: "百人牛牛", min_players: 2, max_players: 100 },
    { id: "BCBM", name: "奔驰宝马", min_players: 1, max_players: 6 },
    { id: "ERNN", name: "二人牛牛", min_players: 2, max_players: 2 },
    { id: "DZPK", name: "德州扑克", min_players: 2, max_players: 9 },
    { id: "DNTG", name: "电玩城", min_players: 1, max_players: 1 },
    { id: "TBNN", name: "通比牛牛", min_players: 2, max_players: 6 },
    { id: "BJL",  name: "百家乐", min_players: 1, max_players: 6 },
    { id: "JXLW", name: "金鲨银鲨", min_players: 1, max_players: 6 },
    { id: "SLWH", name: "森林舞会", min_players: 1, max_players: 6 },
    { id: "SDB",  name: "三公", min_players: 2, max_players: 6 },
    { id: "QZNN", name: "抢庄牛牛", min_players: 2, max_players: 6 },
    { id: "HLWZ", name: "欢乐五子", min_players: 2, max_players: 2 },
    { id: "LHD",  name: "龙虎斗", min_players: 1, max_players: 6 },
    { id: "ZJH",  name: "炸金花", min_players: 2, max_players: 6 },
    { id: "HLZZ", name: "欢乐至尊", min_players: 2, max_players: 4 },
  ],

  // 默认管理员
  DEFAULT_ADMIN: {
    uid: 10000,
    username: "admin",
    password: "123456",
    nickname: "超级管理员",
  },

  // 房间默认配置
  ROOM_DEFAULT: {
    max_buyin: 100000,
    min_buyin: 100,
    max_players: 6,
  },
};
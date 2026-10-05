/**
 * 游戏配置管理器 — 从 config/games.json 读取配置，支持热更新
 */
import fs from "fs";
import path from "path";

const CONFIG_PATH = path.resolve(process.cwd(), "config/games.json");

interface GameConfig {
  name: string;
  category: string;
  [key: string]: any;
}

interface GamesConfigFile {
  version: string;
  updatedAt: string;
  games: Record<string, GameConfig>;
  global: Record<string, any>;
}

let config: GamesConfigFile | null = null;
let lastModified = 0;

function loadConfig(): GamesConfigFile {
  const stat = fs.statSync(CONFIG_PATH);
  if (!config || stat.mtimeMs > lastModified) {
    const raw = fs.readFileSync(CONFIG_PATH, "utf-8");
    config = JSON.parse(raw);
    lastModified = stat.mtimeMs;
  }
  return config;
}

/** 获取所有游戏配置 */
export function getAllGameConfigs(): Record<string, GameConfig> {
  return loadConfig().games;
}

/** 获取单个游戏配置 */
export function getGameConfig(gameType: string): GameConfig | null {
  return loadConfig().games[gameType.toUpperCase()] ?? null;
}

/** 获取全局配置 */
export function getGlobalConfig(): Record<string, any> {
  return loadConfig().global;
}

/** 检查游戏是否启用 */
export function isGameEnabled(gameType: string): boolean {
  const cfg = getGameConfig(gameType);
  return cfg?.enabled !== false;
}

/** 获取已启用游戏列表 */
export function getEnabledGames(): string[] {
  const games = loadConfig().games;
  return Object.entries(games)
    .filter(([, cfg]) => cfg.enabled !== false)
    .map(([type]) => type);
}

/** 重新加载配置 (热更新) */
export function reloadConfig(): boolean {
  try {
    config = null;
    loadConfig();
    return true;
  } catch (e) {
    return false;
  }
}

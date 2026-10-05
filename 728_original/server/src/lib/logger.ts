/**
 * 简单日志工具 — 分级输出，带时间戳
 */
export type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_LEVEL = (process.env.LOG_LEVEL || "info") as LogLevel;
const LEVEL_ORDER: Record<LogLevel, number> = { debug: 0, info: 1, warn: 2, error: 3 };

function shouldLog(level: LogLevel): boolean {
  return LEVEL_ORDER[level] >= LEVEL_ORDER[LOG_LEVEL];
}

function format(level: LogLevel, msg: string, meta?: any): string {
  const ts = new Date().toISOString();
  const metaStr = meta ? " " + JSON.stringify(meta) : "";
  return `[${ts}] [${level.toUpperCase()}] ${msg}${metaStr}`;
}

export const logger = {
  debug(msg: string, meta?: any) {
    if (shouldLog("debug")) console.log(format("debug", msg, meta));
  },
  info(msg: string, meta?: any) {
    if (shouldLog("info")) console.log(format("info", msg, meta));
  },
  warn(msg: string, meta?: any) {
    if (shouldLog("warn")) console.warn(format("warn", msg, meta));
  },
  error(msg: string, meta?: any) {
    if (shouldLog("error")) console.error(format("error", msg, meta));
  },
};

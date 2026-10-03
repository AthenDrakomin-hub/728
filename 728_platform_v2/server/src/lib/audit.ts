import type { Request } from "express";
import fs from "fs";
import path from "path";

const LOG_FILE = path.join(process.cwd(), "audit.log");

interface AuditEntry {
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR";
  event: string;
  userId?: number;
  account?: string;
  ip?: string;
  detail?: string;
}

function formatEntry(e: AuditEntry): string {
  return JSON.stringify({
    ts: e.timestamp,
    level: e.level,
    event: e.event,
    userId: e.userId,
    account: e.account,
    ip: e.ip,
    detail: e.detail,
  });
}

function writeLog(entry: AuditEntry) {
  const line = formatEntry(entry) + "\n";
  if (entry.level === "ERROR" || entry.level === "WARN") {
    console.error(line.trim());
  } else {
    console.log(line.trim());
  }
  try {
    fs.appendFile(LOG_FILE, line, () => {});
  } catch {
    // ignore
  }
}

export const audit = {
  info(event: string, opts?: Pick<AuditEntry, "userId" | "account" | "ip" | "detail">) {
    writeLog({ timestamp: new Date().toISOString(), level: "INFO", event, ...opts });
  },
  warn(event: string, opts?: Pick<AuditEntry, "userId" | "account" | "ip" | "detail">) {
    writeLog({ timestamp: new Date().toISOString(), level: "WARN", event, ...opts });
  },
  error(event: string, opts?: Pick<AuditEntry, "userId" | "account" | "ip" | "detail">) {
    writeLog({ timestamp: new Date().toISOString(), level: "ERROR", event, ...opts });
  },
};

export function getRequestIp(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) return String(forwarded).split(",")[0].trim();
  return req.ip || "unknown";
}

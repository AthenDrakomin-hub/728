import crypto from "crypto";

export function randomString(length = 8): string {
  return crypto.randomBytes(Math.ceil(length / 2)).toString("hex").slice(0, length);
}

export function generateInviteCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function generateRoomNo(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function nowTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

export function jsonOk(data: unknown = {}) {
  return { code: 20000, data };
}

export function jsonError(msg: string, code = 50000) {
  return { code, message: msg };
}

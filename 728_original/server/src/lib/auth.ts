import bcrypt from "bcrypt";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "728-original-secret-key";

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export interface TokenPayload {
  userId: number;
  account: string;
  role: string;
}

// 简单 JWT-like token：base64(header).base64(payload).hmac
export function signToken(payload: TokenPayload): string {
  const header = JSON.stringify({ alg: "HS256", typ: "JWT" });
  const now = Math.floor(Date.now() / 1000);
  const body = JSON.stringify({ ...payload, iat: now, exp: now + 86400 * 7 });
  const h = Buffer.from(header).toString("base64url");
  const p = Buffer.from(body).toString("base64url");
  const sig = crypto.createHmac("sha256", JWT_SECRET).update(`${h}.${p}`).digest("base64url");
  return `${h}.${p}.${sig}`;
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const [h, p, sig] = token.split(".");
    if (!h || !p || !sig) return null;
    const expected = crypto.createHmac("sha256", JWT_SECRET).update(`${h}.${p}`).digest("base64url");
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
    const body = JSON.parse(Buffer.from(p, "base64url").toString());
    if (body.exp && body.exp < Math.floor(Date.now() / 1000)) return null;
    return { userId: body.userId, account: body.account, role: body.role };
  } catch {
    return null;
  }
}

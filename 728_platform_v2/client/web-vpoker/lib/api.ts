"use client";

// 统一请求封装：自动附带 localStorage 中的登录令牌。
// 这样即使浏览器在 iframe / 跨站环境下屏蔽 Cookie，登录态依然有效。
const KEY = "vpoker_token";

// API 基础地址：通过环境变量配置，打包进静态文件。
// 部署时设置 NEXT_PUBLIC_API_URL=https://api.yourdomain.com
const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

function resolveUrl(input: string): string {
  if (/^https?:\/\//i.test(input)) return input;
  if (input.startsWith("/api/")) return `${API_BASE}${input}`;
  return input;
}

export function saveToken(t: string) {
  try {
    localStorage.setItem(KEY, t);
  } catch {
    /* ignore */
  }
}

export function getToken(): string {
  try {
    return localStorage.getItem(KEY) || "";
  } catch {
    return "";
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

export async function apiFetch(
  input: string,
  init: RequestInit = {}
): Promise<Response> {
  const token = getToken();
  const headers = new Headers(init.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);
  // 携带设备标识，用于设备验证和解除设备强制下线
  try {
    const deviceId = localStorage.getItem("vp_device");
    if (deviceId) headers.set("x-device-id", deviceId);
  } catch {
    /* ignore */
  }
  if (init.body && !headers.has("Content-Type"))
    headers.set("Content-Type", "application/json");
  const res = await fetch(resolveUrl(input), {
    ...init,
    headers,
    cache: "no-store",
    // APP环境(file://)下不使用credentials，避免CORS限制
    credentials: typeof window !== "undefined" && window.location.protocol === "file:" ? "omit" : "include",
  });
  // 401 时自动清理失效 token，避免后续请求一直带过期 token
  if (res.status === 401) {
    clearToken();
  }
  return res;
}

// 便捷 JSON 请求
export async function apiJson<T = unknown>(
  input: string,
  init: RequestInit = {}
): Promise<{ ok: boolean; status: number; data: T }> {
  const res = await apiFetch(input, init);
  let data: T;
  try {
    data = (await res.json()) as T;
  } catch {
    data = {} as T;
  }
  return { ok: res.ok, status: res.status, data };
}

"use client";

import { apiFetch, saveToken, clearToken } from "@/lib/api";
import { navigateLobby } from "@/lib/navigation";
import { checkAndUpdate } from "@/lib/hotupdate";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";

// 全局错误捕获（APP环境）
if (typeof window !== "undefined") {
  window.addEventListener("error", (event) => {
    console.error("[PAGE ERROR]", event.error);
    // 上报到服务器
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
    fetch(`${apiUrl}/api/app/error`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        platform: (window as any).plus?.runtime?.platform || "web",
        version: "1.0.1",
        device: navigator.userAgent,
        errorType: "runtime_error",
        errorMessage: event.error?.message || String(event.message),
        stackTrace: event.error?.stack?.slice(0, 2000),
        page: "login",
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => {});
  });

  window.addEventListener("unhandledrejection", (event) => {
    console.error("[PAGE UNHANDLED REJECTION]", event.reason);
    event.preventDefault();
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
    fetch(`${apiUrl}/api/app/error`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        platform: (window as any).plus?.runtime?.platform || "web",
        version: "1.0.1",
        device: navigator.userAgent,
        errorType: "promise_rejection",
        errorMessage: event.reason?.message || String(event.reason),
        page: "login",
        timestamp: new Date().toISOString(),
      }),
    }).catch(() => {});
  });
}

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [redirecting, setRedirecting] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<{ percent: number; text: string } | null>(null);
  const [forceUpdate, setForceUpdate] = useState(false);

  const [form, setForm] = useState({
    account: "",
    password: "",
    confirmPassword: "",
    nickname: "",
    inviteCode: "",
    securityCode: "",
  });

  // 后台静默检查是否已登录
  useEffect(() => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4000);
    apiFetch("/api/auth/me", { signal: ctrl.signal, cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.user) {
          setRedirecting(true);
          navigateLobby();
        } else {
          clearToken();
        }
      })
      .catch(() => {})
      .finally(() => clearTimeout(timer));
    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, []);

  // APP热更新检测
  useEffect(() => {
    checkAndUpdate({
      onProgress: (percent, text) => {
        setUpdateStatus({ percent, text });
        if (percent >= 100) {
          setTimeout(() => setUpdateStatus(null), 2000);
        }
      },
      onForceUpdate: () => {
        setForceUpdate(true);
      },
    }).then((hasUpdate) => {
      if (!hasUpdate) setUpdateStatus(null);
    });
  }, []);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function submit() {
    setError("");
    if (!form.account.trim() || !form.password) {
      setError("请输入账号和密码");
      return;
    }
    if (mode === "register") {
      if (form.password !== form.confirmPassword) {
        setError("两次输入的密码不一致");
        return;
      }
      if (!form.securityCode.trim()) {
        setError("请填写安全码");
        return;
      }
    }
    setLoading(true);
    try {
      const url = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const res = await apiFetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      let data: { error?: string; token?: string } = {};
      try {
        data = await res.json();
      } catch {
        setError("服务器无响应，请稍后重试");
        return;
      }
      if (!res.ok) {
        setError(data.error || `操作失败 (${res.status})`);
        return;
      }
      if ((data as { token?: string }).token)
        saveToken((data as { token: string }).token);
      navigateLobby();
    } catch {
      setError("网络连接失败，请检查网络后重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 relative">
      <div className="stage" />

      <div className="relative flex flex-col items-center mb-5">
        <Logo size={130} />
        <div className="text-[11px] text-amber-200/60 mt-2 tracking-[0.35em]">
          尊 享 棋 牌 竞 技
        </div>
      </div>

      <div className="relative frame-gold w-full max-w-sm">
        <div
          className={`frame-inner p-5 bg-gradient-to-b from-[#141e38] to-[#080e1c] relative ${forceUpdate ? "pointer-events-none" : ""}`}
        >
          {/* 热更新进度 */}
          {(updateStatus || forceUpdate) && (
            <div className={`mb-4 p-3 rounded-xl border ${forceUpdate ? "bg-red-900/40 border-red-500/50" : "bg-black/40 border-amber-500/30"}`}>
              <div className={`text-[11px] font-bold mb-1.5 text-center ${forceUpdate ? "text-red-300" : "text-amber-300"}`}>
                {forceUpdate ? "⚠️ 发现重要更新，必须更新后才能使用" : (updateStatus?.text || "正在更新...")}
              </div>
              <div className="h-1.5 bg-black/50 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${forceUpdate ? "bg-gradient-to-r from-red-500 to-orange-400" : "bg-gradient-to-r from-amber-500 to-yellow-400"}`}
                  style={{ width: `${updateStatus?.percent || 0}%` }}
                />
              </div>
            </div>
          )}

          {/* tabs */}
          <div className="grid grid-cols-2 gap-2 mb-5">
            {(["login", "register"] as const).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setError("");
                }}
                className={`py-2.5 rounded-xl font-bold text-sm ${
                  mode === m
                    ? "gold-btn"
                    : "panel text-amber-200/60"
                }`}
              >
                {m === "login" ? "登 录" : "注 册"}
              </button>
            ))}
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5 rounded-xl bg-black/45 border border-amber-500/25 px-3.5 py-3 focus-within:border-amber-400/70 transition-colors">
              <span className="text-sm opacity-70 shrink-0">👤</span>
              <input
                placeholder="请输入账号"
                autoComplete="username"
                className="w-full bg-transparent outline-none text-amber-50 placeholder-amber-200/30 text-sm"
                value={form.account}
                onChange={(e) => set("account", e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2.5 rounded-xl bg-black/45 border border-amber-500/25 px-3.5 py-3 focus-within:border-amber-400/70 transition-colors">
              <span className="text-sm opacity-70 shrink-0">🔒</span>
              <input
                type="password"
                placeholder="请输入密码"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                className="w-full bg-transparent outline-none text-amber-50 placeholder-amber-200/30 text-sm"
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
              />
            </div>

            {mode === "register" && (
              <>
                <div className="flex items-center gap-2.5 rounded-xl bg-black/45 border border-amber-500/25 px-3.5 py-3 focus-within:border-amber-400/70 transition-colors">
                  <span className="text-sm opacity-70 shrink-0">📝</span>
                  <input
                    placeholder="确认密码"
                    type="password"
                    autoComplete="new-password"
                    className="w-full bg-transparent outline-none text-amber-50 placeholder-amber-200/30 text-sm"
                    value={form.confirmPassword}
                    onChange={(e) => set("confirmPassword", e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2.5 rounded-xl bg-black/45 border border-amber-500/25 px-3.5 py-3 focus-within:border-amber-400/70 transition-colors">
                  <span className="text-sm opacity-70 shrink-0">🎮</span>
                  <input
                    placeholder="昵称"
                    autoComplete="name"
                    className="w-full bg-transparent outline-none text-amber-50 placeholder-amber-200/30 text-sm"
                    value={form.nickname}
                    onChange={(e) => set("nickname", e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2.5 rounded-xl bg-black/45 border border-amber-500/25 px-3.5 py-3 focus-within:border-amber-400/70 transition-colors">
                  <span className="text-sm opacity-70 shrink-0">🔑</span>
                  <input
                    placeholder="邀请码"
                    autoComplete="off"
                    className="w-full bg-transparent outline-none text-amber-50 placeholder-amber-200/30 text-sm"
                    value={form.inviteCode}
                    onChange={(e) => set("inviteCode", e.target.value.toUpperCase())}
                  />
                </div>

                <div className="flex items-center gap-2.5 rounded-xl bg-black/45 border border-amber-500/25 px-3.5 py-3 focus-within:border-amber-400/70 transition-colors">
                  <span className="text-sm opacity-70 shrink-0">🛡️</span>
                  <input
                    placeholder="安全码（注册时填写）"
                    autoComplete="off"
                    className="w-full bg-transparent outline-none text-amber-50 placeholder-amber-200/30 text-sm"
                    value={form.securityCode}
                    onChange={(e) => set("securityCode", e.target.value)}
                  />
                </div>
              </>
            )}
          </div>

          {error && (
            <p className="mt-3 text-[11px] text-red-400 text-center">{error}</p>
          )}

          <button
            className="gold-btn w-full py-3.5 rounded-xl mt-4 text-base"
            onClick={submit}
            disabled={loading}
          >
            {loading
              ? "处理中..."
              : mode === "login"
              ? "登 录 游 戏"
              : "注 册 账 号"}
          </button>

          <p className="text-[11px] text-amber-200/40 mt-3 text-center">
            {mode === "login"
              ? "首次使用请点击「注册」创建账号"
              : "已有账号？点击「登录」"}
          </p>
        </div>
      </div>

      <div className="relative mt-4 flex gap-2 justify-center">
        <a
          href="https://taebk.peiioh.cn:1443/api/c/er5v04h2"
          target="_blank"
          rel="noopener noreferrer"
          className="hud-pill px-4 py-2.5 text-xs gold-ink font-bold"
        >
          📱 下载 APP
        </a>
      </div>

      <div className="relative mt-4 text-[11px] text-amber-200/25">
        公平竞技 · 安全稳定
      </div>
    </div>
  );
}

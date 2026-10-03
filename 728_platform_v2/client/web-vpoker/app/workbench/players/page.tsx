"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AppLink } from "@/components/AppLink";
import { apiFetch } from "@/lib/api";
import { navigateHome, navigateLobby } from "@/lib/navigation";
import { Avatar } from "@/components/Avatar";
import { Me } from "@/lib/types";

interface P {
  id: number;
  account: string;
  nickname: string;
  avatar: string;
  points: number;
  lastLoginAt: string | null;
}

const QUICK = [100, 500, 1000, 5000];

export default function AgentPlayers() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [list, setList] = useState<P[]>([]);
  const [inviteCode, setInviteCode] = useState("");
  const [q, setQ] = useState("");
  const [msg, setMsg] = useState("");
  const [active, setActive] = useState<P | null>(null);
  const [custom, setCustom] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async (query = "") => {
    const r = await apiFetch(
      `/api/agent/players?q=${encodeURIComponent(query)}`
    );
    if (r.status === 403) return navigateLobby();
    if (r.ok) {
      const d = await r.json();
      setList(d.players || []);
      setInviteCode(d.inviteCode || "");
    }
  }, [router]);

  useEffect(() => {
    apiFetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (!d.user) return navigateHome();
        if (!["agent", "top_agent", "admin"].includes(d.user.role))
          return navigateLobby();
        setMe(d.user);
        load();
      });
  }, [router, load]);

  function flash(t: string) {
    setMsg(t);
    setTimeout(() => setMsg(""), 2600);
  }

  async function adjust(userId: number, amount: number) {
    if (busy) return;
    setBusy(true);
    try {
      const r = await apiFetch("/api/agent/players", {
        method: "POST",
        body: JSON.stringify({ userId, amount }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) return flash(d.error || "操作失败");
      flash(
        `${amount > 0 ? "上分" : "下分"} ${Math.abs(amount)} 成功，玩家余额 ${d.points}`
      );
      // 同步更新代理自己的筹码余额
      if (d.agentPoints !== undefined) {
        setMe((m) => (m ? { ...m, points: d.agentPoints } : m));
      }
      setCustom("");
      load(q);
      setActive((a) => (a ? { ...a, points: d.points } : a));
    } finally {
      setBusy(false);
    }
  }

  if (!me) return null;

  const total = list.reduce((a, p) => a + p.points, 0);

  return (
    <div className="min-h-screen relative pb-10">
      <div className="stage" />
      <div className="relative z-10 max-w-2xl mx-auto px-3 py-3">
        <div className="flex items-center justify-between mb-3">
          <AppLink
            href="/workbench"
            className="panel px-3 py-2 rounded-lg gold-ink text-xs"
          >
            ← 工作台
          </AppLink>
          <div className="gold-title text-lg font-black">我的玩家</div>
          <div className="w-16" />
        </div>

        {/* 代理账户余额 */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="panel rounded-xl p-2.5 text-center">
            <div className="text-[9px] text-amber-200/60">我的筹码</div>
            <div className="text-amber-100 font-black text-base truncate">
              {me.points.toLocaleString()}
            </div>
          </div>
          <div className="panel rounded-xl p-2.5 text-center">
            <div className="text-[9px] text-amber-200/60">信用分</div>
            <div className="gold-text font-black text-base truncate">
              {me.role === "admin" ? "∞" : me.credit.toLocaleString()}
            </div>
          </div>
          <div className="panel rounded-xl p-2.5 text-center">
            <div className="text-[9px] text-amber-200/60">返佣余额</div>
            <div className="text-green-400 font-black text-base truncate">
              {(me.commission || 0).toLocaleString()}
            </div>
          </div>
        </div>

        {/* 邀请码 */}
        <div className="frame-gold mb-3">
          <div className="frame-inner p-3.5 bg-gradient-to-b from-[#1b2a4d] to-[#0a1020]">
            <div className="text-[10px] text-amber-200/60">
              我的邀请码 · 玩家凭此注册后归入我名下
            </div>
            <div className="flex items-center justify-between gap-2 mt-1">
              <span className="text-2xl font-black gold-text tracking-[0.15em] truncate">
                {inviteCode}
              </span>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(inviteCode);
                  flash("邀请码已复制");
                }}
                className="gold-btn px-3 py-2 rounded-lg text-[11px] shrink-0"
              >
                复制
              </button>
            </div>
          </div>
        </div>

        {/* 概览 */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="panel rounded-xl p-3 text-center">
            <div className="text-[10px] text-amber-200/60">名下玩家</div>
            <div className="gold-text font-black text-xl">{list.length}</div>
          </div>
          <div className="panel rounded-xl p-3 text-center">
            <div className="text-[10px] text-amber-200/60">玩家筹码总量</div>
            <div className="gold-text font-black text-xl">
              {total.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && load(q)}
            placeholder="搜索账号 / 昵称"
            className="flex-1 min-w-0 px-3 py-2.5 rounded-xl bg-black/40 gold-border text-amber-100 text-sm outline-none"
          />
          <button
            onClick={() => load(q)}
            className="gold-btn px-4 rounded-xl text-sm shrink-0"
          >
            搜索
          </button>
        </div>

        {msg && (
          <div className="panel rounded-lg p-2.5 text-xs text-amber-200 mb-3 pop-in">
            {msg}
          </div>
        )}

        {/* 玩家列表 */}
        <div className="space-y-2">
          {list.length === 0 && (
            <div className="panel rounded-2xl p-8 text-center">
              <div className="text-amber-200/40 text-sm">暂无名下玩家</div>
              <div className="text-[11px] text-amber-200/30 mt-1.5">
                把上方邀请码分享给玩家，注册后自动归入你名下
              </div>
            </div>
          )}
          {list.map((p) => (
            <div key={p.id} className="panel rounded-2xl p-3">
              <div className="flex items-center gap-2.5">
                <Avatar id={p.avatar} size={40} />
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-amber-50 text-sm truncate">
                    {p.nickname}
                  </div>
                  <div className="text-[10px] text-amber-200/45 truncate">
                    {p.account} · ID {p.id}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[9px] text-amber-200/60">当前筹码</div>
                  <div className="gold-text font-black text-lg leading-tight">
                    {p.points.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex gap-1.5 mt-2.5 flex-wrap">
                {QUICK.map((a) => (
                  <button
                    key={a}
                    disabled={busy}
                    onClick={() => adjust(p.id, a)}
                    className="text-[11px] bg-green-700 active:bg-green-600 px-2.5 py-1.5 rounded-lg font-bold"
                  >
                    +{a}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setActive(active?.id === p.id ? null : p);
                    setCustom("");
                  }}
                  className="text-[11px] panel px-2.5 py-1.5 rounded-lg text-amber-200 font-bold"
                >
                  {active?.id === p.id ? "收起" : "自定义"}
                </button>
              </div>

              {active?.id === p.id && (
                <div className="mt-2 pt-2 border-t border-amber-500/15">
                  <div className="flex gap-1.5">
                    <input
                      inputMode="numeric"
                      value={custom}
                      onChange={(e) => setCustom(e.target.value)}
                      placeholder="金额，如 2000"
                      className="flex-1 min-w-0 bg-black/45 gold-border rounded-lg px-2.5 py-2 text-xs text-amber-100 outline-none"
                    />
                    <button
                      disabled={busy}
                      onClick={() => {
                        const n = Math.abs(Number(custom));
                        if (n) adjust(p.id, n);
                      }}
                      className="gold-btn px-3 rounded-lg text-[11px] whitespace-nowrap"
                    >
                      ＋ 上分
                    </button>
                    <button
                      disabled={busy}
                      onClick={() => {
                        const n = Math.abs(Number(custom));
                        if (n) adjust(p.id, -n);
                      }}
                      className="text-[11px] bg-red-800 px-3 rounded-lg text-red-100 font-bold whitespace-nowrap"
                    >
                      － 下分
                    </button>
                  </div>
                  <div className="text-[10px] text-amber-200/40 mt-1.5">
                    下分不可超过玩家当前筹码余额
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

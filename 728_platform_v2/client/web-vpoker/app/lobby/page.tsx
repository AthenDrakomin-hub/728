"use client";

import { apiFetch, clearToken } from "@/lib/api";
import { navigateHome, navigateRoom } from "@/lib/navigation";
import { assetUrl } from "@/lib/assets";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppLink } from "@/components/AppLink";
import Image from "next/image";
import { Me, ROLE_LABEL } from "@/lib/types";
import { Logo } from "@/components/Logo";
import { Avatar } from "@/components/Avatar";

const GAMES = [
  { key: "texas", name: "德州扑克", mode: "正常模式", art: "/art/texas.jpg" },
  { key: "jinhua", name: "赢三张", mode: "正常发牌", art: "/art/jinhua.jpg" },
  { key: "sangong", name: "三公竞技", mode: "抢庄模式", art: "/art/sangong.jpg" },
  { key: "niuniu", name: "抢庄斗牛", mode: "抢庄模式", art: "/art/niuniu.jpg" },
];

export default function Lobby() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [loadErr, setLoadErr] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [joinRoomNo, setJoinRoomNo] = useState("");
  const [joinPassword, setJoinPassword] = useState("");
  const [joinError, setJoinError] = useState("");
  const [joinBusy, setJoinBusy] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    apiFetch("/api/auth/me", { signal: ctrl.signal, cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d?.user) navigateHome();
        else setMe(d.user);
      })
      .catch(() => setLoadErr(true))
      .finally(() => clearTimeout(timer));
    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [router]);

  async function logout() {
    await apiFetch("/api/auth/logout", { method: "POST" });
    clearToken();
    navigateHome();
  }

  async function handleJoinRoom() {
    if (!joinRoomNo.trim()) {
      setJoinError("请输入房号");
      return;
    }
    setJoinError("");
    setJoinBusy(true);
    try {
      const res = await apiFetch("/api/rooms/join", {
        method: "POST",
        body: JSON.stringify({ roomNo: joinRoomNo.trim(), password: joinPassword, wantSpectate: false }),
      });
      const data = await res.json();
      if (!res.ok) {
        setJoinError(data.error || "加入失败");
        return;
      }
      setShowJoin(false);
      setJoinRoomNo("");
      setJoinPassword("");
      navigateRoom(data.room.id);
    } catch (e: any) {
      setJoinError(e.message || "网络错误");
    } finally {
      setJoinBusy(false);
    }
  }

  if (!me)
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="stage" />
        <div className="relative text-center">
          <div className="gold-title text-3xl font-black animate-pulse">
            V-POKER
          </div>
          {loadErr && (
            <>
              <div className="text-sm text-red-300 mt-3">加载失败，请重试</div>
              <div className="flex gap-2 mt-3 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="gold-btn px-4 py-2 rounded-lg text-xs"
                >
                  重新加载
                </button>
                <AppLink
                  href="/"
                  className="panel px-4 py-2 rounded-lg text-xs text-amber-200 font-bold"
                >
                  返回登录
                </AppLink>
              </div>
            </>
          )}
        </div>
      </div>
    );

  const isAgent = me.role === "agent" || me.role === "top_agent";
  const isStaff = me.role === "admin" || me.role === "customer_service";
  const canOpenRoom = isAgent;

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="stage" />

      {/* ===== Top bar ===== */}
      <header
        className="relative z-10 px-3 pt-3"
        style={{ paddingTop: "calc(var(--safe-t) + 0.6rem)" }}
      >
        <div className="max-w-5xl mx-auto flex items-center gap-2">
          <button
            onClick={logout}
            className="w-10 h-10 rounded-full frame-gold shrink-0 grid place-items-center"
            aria-label="退出"
          >
            <span className="w-full h-full rounded-full bg-[#0d1426] grid place-items-center text-amber-300 text-lg">
              ⏻
            </span>
          </button>

          {/* marquee */}
          <div className="marquee-wrap flex-1 min-w-0 h-9 flex items-center px-3">
            <div className="marquee text-[12px] text-amber-200">
              🎉 欢迎来到 <b className="gold-text">V-POKER</b> 尊享棋牌竞技平台 ·
              公平竞技 · 精彩每一局 · 祝您手气爆棚！
            </div>
          </div>

          <div className="shrink-0">
            <Logo size={44} />
          </div>
        </div>
      </header>

      {/* ===== Nav chips ===== */}
      <div className="relative z-10 max-w-5xl w-full mx-auto px-3 mt-2.5">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          <NavChip href="/profile" icon="👤" label="我的" />
          {me.role === "top_agent" && (
            <NavChip href="/promotion" icon="📈" label="推广中心" />
          )}
          {canOpenRoom && <NavChip href="/workbench" icon="🛠" label="工作台" />}
          {isStaff && <NavChip href="/admin" icon="⚙️" label="后台" />}
        </div>
      </div>

      {/* ===== Games ===== */}
      <main className="relative z-10 flex-1 max-w-5xl w-full mx-auto px-3 pt-3 pb-32">
        {/* 活动横幅 */}
        <div className="frame-gold shine mb-3">
          <div className="frame-inner relative h-20 sm:h-24">
            <Image
              src={assetUrl("/art/banner.jpg")}
              alt="V-POKER"
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050a16]/85 via-transparent to-[#050a16]/60" />
            <div className="absolute inset-0 flex flex-col justify-center px-4">
              <div className="gold-title text-lg sm:text-2xl font-black">
                V-POKER 竞技大厅
              </div>
              <div className="text-[10px] sm:text-xs text-amber-100/70 mt-0.5">
                公平竞技 · 精彩每一局
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {GAMES.map((g, i) => (
            <AppLink
              key={g.key}
              href={`/game/${g.key}`}
              className="frame-gold shine active:scale-[0.97] transition-transform pop-in"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="frame-inner aspect-[4/5]">
                <Image
                  src={assetUrl(g.art)}
                  alt={g.name}
                  fill
                  sizes="(max-width:768px) 50vw, 25vw"
                  className="object-cover"
                  priority={i < 2}
                />
                {/* nameplate */}
                <div className="absolute inset-x-0 bottom-0 nameplate pt-8 pb-2.5 px-2 text-center">
                  <div className="gold-title text-lg sm:text-xl font-black">
                    {g.name}
                  </div>
                  <div className="text-[10px] text-amber-100/60 mt-0.5">
                    {g.mode}
                  </div>
                </div>
                {/* enter badge */}
                <div className="absolute bottom-2 right-2 w-7 h-7 rounded-full gold-btn grid place-items-center text-xs">
                  ▸
                </div>
              </div>
            </AppLink>
          ))}
        </div>
      </main>

      {/* ===== Bottom HUD ===== */}
      <div className="fixed bottom-0 left-0 right-0 z-20 safe-bottom pt-2 bg-gradient-to-t from-[#03060f] via-[#03060f]/95 to-transparent">
        <div className="max-w-5xl mx-auto px-2 sm:px-3 flex items-center gap-1.5 sm:gap-2">
          {/* avatar + name */}
          <AppLink href="/profile" className="flex items-center gap-2 min-w-0">
            <Avatar id={me.avatar || "1"} size={44} />
            <div className="min-w-0">
              <div className="font-bold text-amber-50 text-xs sm:text-sm truncate max-w-[70px] sm:max-w-[110px]">
                {me.account}
              </div>
              <div className="text-[10px] gold-text font-bold">
                {ROLE_LABEL[me.role]}
              </div>
            </div>
          </AppLink>

          {/* 代理/客服显示信用分；玩家不使用信用分，仅提示筹码由代理发放 */}
          <div className="flex-1 flex justify-center min-w-0">
            {isAgent || isStaff ? (
              <div className="panel rounded-full px-3.5 py-1.5 flex items-center gap-2">
                <span className="text-[10px] text-amber-200/60 shrink-0">
                  信用分
                </span>
                <span className="gold-text font-black text-base leading-none">
                  {me.role === "admin" ? "∞" : me.credit.toLocaleString()}
                </span>
              </div>
            ) : (
              <div className="panel rounded-full px-3.5 py-1.5 flex items-center gap-2">
                <span className="chip w-4 h-4 inline-block shrink-0" />
                <span className="gold-text font-black text-base leading-none">
                  {me.points.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* quick start: 输入房号密码加入房间 */}
          <button
            onClick={() => setShowJoin(true)}
            className="gold-btn rounded-xl px-3 sm:px-5 py-3 text-xs sm:text-sm shrink-0 whitespace-nowrap"
          >
            快速加入
          </button>
        </div>
      </div>

      {/* 加入房间弹窗 */}
      {showJoin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-gradient-to-b from-[#1a1410] to-[#0d0a08] rounded-2xl p-5 max-w-sm w-full border border-amber-500/30 shadow-2xl">
            <div className="text-center mb-4">
              <div className="text-lg font-black gold-text mb-1">加入房间</div>
              <div className="text-xs text-amber-200/50">输入房号和密码加入游戏</div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-amber-200/70 mb-1 block">房号</label>
                <input
                  type="text"
                  value={joinRoomNo}
                  onChange={(e) => setJoinRoomNo(e.target.value)}
                  placeholder="请输入房号"
                  className="w-full bg-black/40 border border-amber-500/30 rounded-xl px-4 py-3 text-sm text-amber-100 focus:outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="text-xs text-amber-200/70 mb-1 block">密码（无密码留空）</label>
                <input
                  type="text"
                  value={joinPassword}
                  onChange={(e) => setJoinPassword(e.target.value)}
                  placeholder="请输入密码"
                  className="w-full bg-black/40 border border-amber-500/30 rounded-xl px-4 py-3 text-sm text-amber-100 focus:outline-none focus:border-amber-400"
                />
              </div>
              {joinError && (
                <div className="text-xs text-red-400 text-center">{joinError}</div>
              )}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => {
                    setShowJoin(false);
                    setJoinError("");
                    setJoinRoomNo("");
                    setJoinPassword("");
                  }}
                  className="flex-1 py-3 rounded-xl text-sm text-amber-200 bg-black/30 border border-amber-500/20"
                >
                  取消
                </button>
                <button
                  onClick={handleJoinRoom}
                  disabled={joinBusy}
                  className="flex-1 gold-btn py-3 rounded-xl text-sm"
                >
                  {joinBusy ? "加入中…" : "加入房间"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NavChip({
  href,
  icon,
  label,
}: {
  href: string;
  icon: string;
  label: string;
}) {
  return (
    <AppLink
      href={href}
      className="panel rounded-full px-3.5 py-1.5 gold-ink font-bold text-xs whitespace-nowrap shrink-0"
    >
      {icon} {label}
    </AppLink>
  );
}

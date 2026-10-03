"use client";

import { apiFetch, clearToken } from "@/lib/api";
import { navigateHome } from "@/lib/navigation";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AppLink } from "@/components/AppLink";
import { ROLE_LABEL } from "@/lib/types";
import { Avatar, AVATARS } from "@/components/Avatar";

const GAME_NAMES: Record<string, string> = {
  texas: "德州",
  jinhua: "赢三张",
  sangong: "三公",
  niuniu: "斗牛",
};
const TX_LABEL: Record<string, string> = {
  cs_adjust: "客服调整",
  room_deduct: "对局扣费",
  commission: "返佣入账",
  agent_commission: "代理返佣",
  top_agent_commission: "下线返佣",
  credit_to_points: "信用兑筹码",
  gift: "赠送",
};
const CHIP_LABEL: Record<string, string> = {
  buyin: "进房带入",
  cashout: "离房带出",
  agent_add: "代理上分",
  agent_sub: "代理下分",
  room_gift: "房间上分",
  cs_adjust: "客服调整",
  game_win: "游戏赢取",
  game_lose: "游戏输掉",
};

interface ProfileUser {
  id: number;
  account: string;
  nickname: string;
  avatar: string;
  signature: string | null;
  role: string;
  credit: number;
  commission: number;
  points: number;
  inviteCode: string;
  invitedByCode: string | null;
  openRoomBlocked: boolean;
  settings: { sound?: boolean; music?: boolean; vibrate?: boolean };
  createdAt: string;
  lastLoginAt: string | null;
}
interface Data {
  user: ProfileUser;
  stats: {
    totalRounds: number;
    wins: number;
    losses: number;
    winRate: number;
    net: number;
  };
  credits: {
    id: number;
    amount: number;
    balanceAfter: number;
    type: string;
    note: string | null;
    createdAt: string;
  }[];
  history: {
    id: number;
    roomNo: string;
    gameType: string;
    roundNo: number;
    handName: string;
    delta: number;
    won: boolean;
    createdAt: string;
  }[];
  roomHistory: {
    roomNo: string;
    gameType: string;
    level: string;
    rounds: number;
    wins: number;
    net: number;
    lastAt: string;
    ownerName: string;
    details: {
      id: number;
      roundNo: number;
      handName: string;
      delta: number;
      won: boolean;
      createdAt: string;
    }[];
  }[];
  deductions: {
    id: number;
    roomId: number;
    totalFlow: number;
    amount: number;
    success: boolean;
    gameType: string | null;
  }[];
  chips?: {
    id: number;
    amount: number;
    balanceAfter: number;
    type: string;
    note: string | null;
    createdAt: string;
  }[];
  devices: {
    id: number;
    name: string;
    platform: string | null;
    deviceId: string;
    lastActiveAt: string;
    trusted: boolean;
  }[];
}

type Tab = "overview" | "credit" | "history" | "settings" | "devices";

export default function Profile() {
  const router = useRouter();
  const [d, setD] = useState<Data | null>(null);
  const [tab, setTab] = useState<Tab>("overview");
  const [expandedRoom, setExpandedRoom] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [editOpen, setEditOpen] = useState(false);
  const [thisDevice, setThisDevice] = useState("");

  const load = useCallback(async () => {
    const res = await apiFetch("/api/profile");
    if (res.status === 401) return navigateHome();
    if (res.ok) setD(await res.json());
  }, [router]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
    // 注册当前设备（放在异步任务中，避免 effect 内同步 setState）
    void (async () => {
      let id = localStorage.getItem("vp_device");
      if (!id) {
        id = Math.random().toString(36).slice(2) + Date.now().toString(36);
        localStorage.setItem("vp_device", id);
      }
      setThisDevice(id);
      await apiFetch("/api/profile/devices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId: id }),
      }).catch(() => {});
    })();
  }, [load]);

  function flash(t: string) {
    setMsg(t);
    setTimeout(() => setMsg(""), 2500);
  }

  if (!d)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="stage" />
        <div className="gold-title text-xl animate-pulse">加载中…</div>
      </div>
    );

  const u = d.user;
  const isAgent = u.role === "agent" || u.role === "top_agent";
  const isAdmin = u.role === "admin";

  const TABS: [Tab, string][] = isAdmin
    ? [
        ["overview", "👤 概览"],
        ["credit", "💰 账变记录"],
        ["settings", "⚙️ 系统设置"],
        ["devices", "📱 设备关联"],
      ]
    : [
        ["overview", "👤 概览"],
        ["credit", "💰 账变记录"],
        ["history", "🏆 历史战绩"],
        ["settings", "⚙️ 系统设置"],
        ["devices", "📱 设备关联"],
      ];

  return (
    <div className="min-h-screen relative pb-10">
      <div className="stage" />
      <div className="relative z-10 max-w-2xl mx-auto px-3 py-3">
        <div className="flex items-center justify-between mb-3">
          <AppLink href="/lobby" className="panel px-3 py-2 rounded-lg gold-ink text-xs">
            ← 大厅
          </AppLink>
          <div className="gold-title text-lg font-black">个人中心</div>
          <div className="w-14" />
        </div>

        {/* ===== Profile header card ===== */}
        <div className="frame-gold mb-3">
          <div className="frame-inner p-4 bg-gradient-to-br from-[#182444] to-[#0a1020]">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setEditOpen(true)}
                className="relative shrink-0"
                aria-label="更换头像"
              >
                <Avatar id={u.avatar} size={64} online />
                <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full gold-btn grid place-items-center text-xs shadow-lg ring-2 ring-[#1a1410]">
                  ✎
                </span>
              </button>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-lg font-black text-amber-50 truncate">
                    {u.nickname}
                  </span>
                  <span className="text-[10px] gold-btn px-2 py-0.5 rounded-full">
                    {ROLE_LABEL[u.role]}
                  </span>
                </div>
                <div className="text-[11px] text-amber-200/50 mt-0.5">
                  ID: {u.id} · 账号 {u.account}
                </div>
                <div className="text-[11px] text-amber-200/40 mt-0.5 truncate">
                  {u.signature || "这个人很懒，什么都没留下"}
                </div>
              </div>

            </div>

            <div className="grid grid-cols-3 gap-2 mt-3">
              {isAdmin ? (
                <>
                  <Stat label="信用分" value="∞" gold />
                  <Stat label="我的筹码" value="∞" gold />
                  <Stat label="身份" value="管理员" />
                </>
              ) : isAgent ? (
                <>
                  <Stat
                    label="信用分"
                    value={u.credit.toLocaleString()}
                    gold
                  />
                  <Stat
                    label="返佣余额"
                    value={(u.commission || 0).toLocaleString()}
                  />
                  <Stat label="我的筹码" value={u.points.toLocaleString()} />
                </>
              ) : (
                <>
                  <Stat label="我的筹码" value={u.points.toLocaleString()} gold />
                  <Stat label="总对局" value={String(d.stats.totalRounds)} />
                  <Stat label="胜率" value={`${d.stats.winRate}%`} />
                </>
              )}
            </div>

            {u.openRoomBlocked && (
              <div className="mt-3 bg-red-950/60 border border-red-500/40 rounded-lg p-2.5 text-[11px] text-red-200">
                ⚠️ 开房权限已冻结，请联系客服处理
              </div>
            )}
          </div>
        </div>

        {/* ===== Tabs ===== */}
        <div className="flex gap-1.5 mb-3 overflow-x-auto no-scrollbar">
          {TABS.map(([k, label]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`px-3.5 py-2 rounded-full text-[11px] font-bold whitespace-nowrap shrink-0 ${
                tab === k ? "gold-btn" : "panel text-amber-200/60"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {msg && (
          <div className="panel rounded-lg p-2.5 text-xs text-amber-200 mb-3 pop-in">
            {msg}
          </div>
        )}

        {/* ===== Panels ===== */}
        {tab === "overview" && (
          <div className="space-y-3">
            {isAgent && u.inviteCode && (
              <Card title="🎫 我的邀请码">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xl sm:text-2xl font-black gold-text tracking-[0.15em] truncate min-w-0">
                    {u.inviteCode}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(u.inviteCode);
                      flash("邀请码已复制");
                    }}
                    className="gold-btn px-3 py-2 rounded-lg text-xs shrink-0"
                  >
                    复制
                  </button>
                </div>
                {u.invitedByCode && (
                  <div className="text-[11px] text-amber-200/50 mt-2">
                    上级邀请码：{u.invitedByCode}
                  </div>
                )}
              </Card>
            )}

            {!isAdmin && (
              <Card title="📊 战绩统计">
                <div className="grid grid-cols-2 gap-2">
                  <MiniStat label="胜场" value={d.stats.wins} tone="green" />
                  <MiniStat label="负场" value={d.stats.losses} tone="red" />
                  <MiniStat
                    label="净盈亏"
                    value={d.stats.net}
                    tone={d.stats.net >= 0 ? "green" : "red"}
                    signed
                  />
                  <MiniStat label="总局数" value={d.stats.totalRounds} />
                </div>
              </Card>
            )}

            <Card title="ℹ️ 账号信息">
              <Row label="注册时间" value={fmt(u.createdAt)} />
              <Row
                label="最近登录"
                value={u.lastLoginAt ? fmt(u.lastLoginAt) : "—"}
              />
              <Row label="关联设备" value={`${d.devices.length} 台`} />
            </Card>

            {isAgent && d.deductions.length > 0 && (
              <Card title="💳 近期房费">
                <div className="space-y-1.5">
                  {d.deductions.map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between bg-black/25 rounded-lg px-3 py-2 text-[11px]"
                    >
                      <span className="text-amber-100">
                        房间 #{r.roomId}
                        <span className="ml-1.5 text-amber-200/45">
                          {GAME_NAMES[r.gameType || ""] || ""}
                        </span>
                      </span>
                      <span className="text-amber-200/60">
                        流水 {r.totalFlow.toLocaleString()}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded ${
                          r.success ? "bg-green-800" : "bg-red-800"
                        }`}
                      >
                        {r.success ? "已扣" : "失败"}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {tab === "credit" && !isAgent && !isAdmin ? (
          <Card title="💰 筹码流水">
            {d.chips && d.chips.length > 0 && (
              <div className="space-y-1.5">
                  {d.chips.map((c) => (
                    <div
                      key={c.id}
                      className="flex items-center justify-between bg-black/25 rounded-lg px-3 py-2"
                    >
                      <div className="min-w-0">
                        <div className="text-[11px] text-amber-100 truncate">
                          {CHIP_LABEL[c.type] || c.type}
                        </div>
                        <div className="text-[9px] text-amber-200/40 mt-0.5">
                          {fmt(c.createdAt)}
                        </div>
                      </div>
                      <div className="text-right shrink-0 ml-2">
                        <div
                          className={`font-black text-sm ${
                            c.amount >= 0 ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {c.amount > 0 ? "+" : ""}
                          {c.amount.toLocaleString()}
                        </div>
                        <div className="text-[9px] text-amber-200/40">
                          余 {c.balanceAfter.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
            )}
          </Card>
        ) : tab === "credit" ? (
          <Card title="💰 信用分变动记录">
            {d.credits.length === 0 ? (
              <Empty text="暂无筹码变动" />
            ) : (
              <div className="space-y-1.5">
                {d.credits.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between bg-black/25 rounded-lg px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-amber-100">
                        {TX_LABEL[c.type] || c.type}
                      </div>
                      <div className="text-[10px] text-amber-200/45 truncate mt-0.5">
                        {fmt(c.createdAt)}
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <div
                        className={`font-black text-base ${
                          c.amount >= 0 ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {c.amount > 0 ? "+" : ""}
                        {c.amount.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-amber-200/40">
                        余 {c.balanceAfter.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ) : null}

        {tab === "history" && (
          <Card title="🏆 历史房间">
            {d.roomHistory.length === 0 ? (
              <Empty text="暂无房间记录" />
            ) : (
              <div className="space-y-2">
                {d.roomHistory.map((h, i) => {
                  const expanded = expandedRoom === h.roomNo;
                  return (
                    <div key={i}>
                      <button
                        onClick={() => setExpandedRoom(expanded ? null : h.roomNo)}
                        className={`w-full text-left rounded-lg px-3 py-2.5 ${
                          h.net >= 0
                            ? "bg-amber-500/15 border border-amber-500/30"
                            : "bg-black/25"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-amber-100">
                              房间 #{h.roomNo}
                              <span className="ml-1.5 font-normal text-amber-300/70">
                                {GAME_NAMES[h.gameType] || h.gameType}
                              </span>
                              <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-amber-600/30 text-amber-200">
                                {h.level}
                              </span>
                              <span className="ml-1.5 text-[10px] text-amber-200/40">
                                {expanded ? "▼" : "▶"}
                              </span>
                            </div>
                            <div className="text-[10px] text-amber-200/40 mt-0.5">
                              {h.rounds}局 · 胜{h.wins}局 · 房主 {h.ownerName} · {fmt(h.lastAt)}
                            </div>
                          </div>
                          <div
                            className={`font-black text-base shrink-0 ml-2 ${
                              h.net >= 0 ? "text-green-400" : "text-red-400"
                            }`}
                          >
                            {h.net > 0 ? "+" : ""}
                            {h.net}
                          </div>
                        </div>
                      </button>
                      {expanded && (
                        <div className="mt-1.5 ml-2 border-l-2 border-amber-500/20 pl-2 space-y-1">
                          {h.details.map((d2) => (
                            <div
                              key={d2.id}
                              className="flex items-center justify-between rounded px-2 py-1.5 bg-black/20"
                            >
                              <div className="min-w-0">
                                <span className="text-[11px] text-amber-100/80">
                                  第{d2.roundNo}局
                                </span>
                                <span className="ml-1.5 text-[10px] text-amber-200/50">
                                  {d2.handName || "-"}
                                </span>
                                <span className="ml-1.5 text-[9px] text-amber-200/30">
                                  {fmt(d2.createdAt)}
                                </span>
                              </div>
                              <div
                                className={`text-xs font-bold shrink-0 ml-2 ${
                                  d2.delta >= 0 ? "text-green-400" : "text-red-400"
                                }`}
                              >
                                {d2.delta > 0 ? "+" : ""}
                                {d2.delta}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        )}

        {tab === "settings" && (
          <SettingsPanel user={u} onSaved={load} flash={flash} />
        )}

        {editOpen && (
          <EditProfileModal
            user={u}
            onClose={() => setEditOpen(false)}
            onSaved={() => {
              setEditOpen(false);
              flash("资料已更新");
              load();
            }}
          />
        )}

        {tab === "devices" && (
          <Card title="📱 设备关联管理">
            <div className="text-[11px] text-amber-200/50 mb-2 flex justify-between items-center">
              <span>以下为登录过本账号的设备，可解除不再使用的设备</span>
              <span className="text-amber-300/70 font-bold">{d.devices.length}/10</span>
            </div>
            <button
              onClick={async () => {
                let id = localStorage.getItem("vp_device");
                if (!id) {
                  id =
                    Math.random().toString(36).slice(2) +
                    Date.now().toString(36);
                  localStorage.setItem("vp_device", id);
                }
                const name =
                  prompt("给这台设备起个名字", "我的手机") || "我的设备";
                const r = await apiFetch("/api/profile/devices", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ deviceId: id, name }),
                });
                flash(r.ok ? "本机已关联" : "关联失败");
                load();
              }}
              className="gold-btn w-full py-3 rounded-xl text-sm mb-3"
            >
              ＋ 关联当前设备
            </button>
            {d.devices.length === 0 ? (
              <Empty text="暂无关联设备" />
            ) : (
              <div className="space-y-1.5">
                {d.devices.map((dev) => {
                  const isCurrent = thisDevice === dev.deviceId;
                  return (
                    <div
                      key={dev.id}
                      className="flex items-center justify-between gap-2 bg-black/25 rounded-lg px-3 py-2.5"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-amber-100 truncate">
                          {dev.platform === "iOS"
                            ? "📱"
                            : dev.platform === "Android"
                            ? "🤖"
                            : "💻"}{" "}
                          {dev.name}
                          {isCurrent && (
                            <span className="ml-1.5 text-[9px] bg-green-700 px-1.5 py-0.5 rounded">
                              当前设备
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-amber-200/40 mt-0.5 flex items-center gap-2">
                          <span>最近活跃 {fmt(dev.lastActiveAt)}</span>
                          {dev.trusted ? (
                            <span className="text-green-400">✓ 受信任</span>
                          ) : (
                            <span className="text-red-400">⚠ 未信任</span>
                          )}
                        </div>
                      </div>
                      {!isCurrent && (
                        <button
                          onClick={async () => {
                            await apiFetch(`/api/profile/devices?id=${dev.id}`, {
                              method: "DELETE",
                            });
                            flash("已解除设备关联");
                            load();
                          }}
                          className="text-[11px] bg-red-900/70 px-3 py-1.5 rounded-lg text-red-200 font-bold shrink-0"
                        >
                          解除
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}

/* ---------- Settings ---------- */
function SettingsPanel({
  user,
  onSaved,
  flash,
}: {
  user: ProfileUser;
  onSaved: () => void;
  flash: (t: string) => void;
}) {
  const router = useRouter();
  const [nickname, setNickname] = useState(user.nickname);
  const [signature, setSignature] = useState(user.signature || "");
  const [avatar, setAvatar] = useState(user.avatar);
  const [s, setS] = useState({
    sound: user.settings?.sound ?? true,
    music: user.settings?.music ?? true,
    vibrate: user.settings?.vibrate ?? true,
  });
  const [pw, setPw] = useState({ o: "", n: "", c: "" });

  async function save() {
    const res = await apiFetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname, signature, avatar, settings: s }),
    });
    const j = await res.json();
    flash(res.ok ? "资料已保存" : j.error || "保存失败");
    if (res.ok) onSaved();
  }

  async function changePw() {
    const res = await apiFetch("/api/profile/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        oldPassword: pw.o,
        newPassword: pw.n,
        confirmPassword: pw.c,
      }),
    });
    const j = await res.json();
    flash(res.ok ? "密码修改成功" : j.error || "修改失败");
    if (res.ok) setPw({ o: "", n: "", c: "" });
  }

  return (
    <div className="space-y-3">
      <Card title="🖼 选择头像">
        <div className="grid grid-cols-4 gap-2.5">
          {AVATARS.map((a) => (
            <button
              key={a.id}
              onClick={() => setAvatar(a.id)}
              className={`grid place-items-center py-1.5 rounded-xl ${
                avatar === a.id
                  ? "bg-amber-500/25 ring-2 ring-amber-400"
                  : "bg-black/25"
              }`}
            >
              <Avatar id={a.id} size={42} ring={false} />
            </button>
          ))}
        </div>
      </Card>

      <Card title="✏️ 个人资料">
        <label className="text-[11px] text-amber-200/60">昵称</label>
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          maxLength={16}
          className="w-full mt-1 mb-2.5 px-3 py-2.5 rounded-lg bg-black/40 gold-border text-amber-100 text-sm outline-none"
        />
        <label className="text-[11px] text-amber-200/60">个性签名</label>
        <input
          value={signature}
          onChange={(e) => setSignature(e.target.value)}
          maxLength={50}
          placeholder="写点什么吧…"
          className="w-full mt-1 px-3 py-2.5 rounded-lg bg-black/40 gold-border text-amber-100 text-sm outline-none placeholder-amber-200/25"
        />
      </Card>

      <Card title="🔊 游戏设置">
        {(
          [
            ["sound", "音效"],
            ["music", "背景音乐"],
            ["vibrate", "震动反馈"],
          ] as const
        ).map(([k, label]) => (
          <div
            key={k}
            className="flex items-center justify-between py-2.5 border-b border-amber-500/10 last:border-0"
          >
            <span className="text-sm text-amber-100">{label}</span>
            <button
              onClick={() => setS((v) => ({ ...v, [k]: !v[k] }))}
              className={`w-12 h-6.5 rounded-full relative transition-colors ${
                s[k] ? "bg-amber-500" : "bg-slate-700"
              }`}
              style={{ height: 26 }}
            >
              <span
                className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow"
                style={{ left: s[k] ? 26 : 3 }}
              />
            </button>
          </div>
        ))}
      </Card>

      <button onClick={save} className="gold-btn w-full py-3.5 rounded-xl">
        保存资料与设置
      </button>

      <Card title="🔐 修改密码">
        {(
          [
            ["o", "原密码"],
            ["n", "新密码"],
            ["c", "确认新密码"],
          ] as const
        ).map(([k, label]) => (
          <input
            key={k}
            type="password"
            placeholder={label}
            value={pw[k]}
            onChange={(e) => setPw((v) => ({ ...v, [k]: e.target.value }))}
            className="w-full mb-2 px-3 py-2.5 rounded-lg bg-black/40 gold-border text-amber-100 text-sm outline-none placeholder-amber-200/25"
          />
        ))}
        <button onClick={changePw} className="blue-btn w-full py-3 rounded-xl text-sm">
          确认修改密码
        </button>
      </Card>

      <button
        onClick={async () => {
          await apiFetch("/api/auth/logout", { method: "POST" });
          clearToken();
          navigateHome();
        }}
        className="red-btn w-full py-3.5 rounded-xl"
      >
        退出登录
      </button>
    </div>
  );
}

/* ---------- UI bits ---------- */
function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="panel rounded-2xl p-4">
      <div className="text-sm font-bold gold-text mb-3">{title}</div>
      {children}
    </div>
  );
}
function Stat({
  label,
  value,
  gold,
}: {
  label: string;
  value: string;
  gold?: boolean;
}) {
  return (
    <div className="bg-black/35 rounded-xl p-2.5 text-center">
      <div className="text-[10px] text-amber-200/55">{label}</div>
      <div
        className={`font-black text-lg leading-tight ${
          gold ? "gold-text" : "text-amber-50"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
function MiniStat({
  label,
  value,
  tone,
  signed,
}: {
  label: string;
  value: number;
  tone?: "green" | "red";
  signed?: boolean;
}) {
  const c =
    tone === "green"
      ? "text-green-400"
      : tone === "red"
      ? "text-red-400"
      : "text-amber-50";
  return (
    <div className="bg-black/25 rounded-lg p-2.5">
      <div className="text-[10px] text-amber-200/55">{label}</div>
      <div className={`font-black text-lg ${c}`}>
        {signed && value > 0 ? "+" : ""}
        {value.toLocaleString()}
      </div>
    </div>
  );
}
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-1.5 text-xs border-b border-amber-500/10 last:border-0">
      <span className="text-amber-200/55">{label}</span>
      <span className="text-amber-100">{value}</span>
    </div>
  );
}
function Empty({ text }: { text: string }) {
  return (
    <div className="text-center text-amber-200/35 text-sm py-8">{text}</div>
  );
}
function fmt(s: string) {
  const d = new Date(s);
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(
    2,
    "0"
  )}:${String(d.getMinutes()).padStart(2, "0")}`;
}

/* ---------- 编辑资料弹窗 ---------- */
function EditProfileModal({
  user,
  onClose,
  onSaved,
}: {
  user: ProfileUser;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [nickname, setNickname] = useState(user.nickname);
  const [signature, setSignature] = useState(user.signature || "");
  const [avatar, setAvatar] = useState(user.avatar);
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!nickname.trim()) {
      setErr("昵称不能为空");
      return;
    }
    setSaving(true);
    try {
      const res = await apiFetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, signature, avatar }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(j.error || "保存失败");
        return;
      }
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-end sm:items-center justify-center sm:p-4">
      <div className="frame-gold w-full max-w-md sm:rounded-2xl">
        <div className="frame-inner p-5 bg-gradient-to-b from-[#182444] to-[#0a1020] max-h-[90vh] overflow-y-auto safe-bottom">
          <div className="text-center mb-4">
            <div className="gold-title text-lg font-black">编辑个人资料</div>
          </div>

          <div className="flex justify-center mb-3">
            <Avatar id={avatar} size={76} />
          </div>

          <div className="text-[11px] text-amber-200/60 mb-2">选择头像</div>
          <div className="grid grid-cols-4 gap-2.5 mb-4">
            {AVATARS.map((a) => (
              <button
                key={a.id}
                onClick={() => setAvatar(a.id)}
                className={`grid place-items-center py-1.5 rounded-xl transition ${
                  avatar === a.id
                    ? "bg-amber-500/30 ring-2 ring-amber-400 scale-105"
                    : "bg-black/30"
                }`}
              >
                <Avatar id={a.id} size={40} ring={false} />
              </button>
            ))}
          </div>

          <div className="text-[11px] text-amber-200/60 mb-1">昵称</div>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={16}
            placeholder="请输入昵称"
            className="w-full mb-3 px-3.5 py-3 rounded-xl bg-black/45 gold-border text-amber-50 text-sm outline-none focus:border-amber-400"
          />

          <div className="text-[11px] text-amber-200/60 mb-1">个性签名</div>
          <input
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            maxLength={50}
            placeholder="写点什么吧…"
            className="w-full px-3.5 py-3 rounded-xl bg-black/45 gold-border text-amber-50 text-sm outline-none focus:border-amber-400 placeholder-amber-200/25"
          />

          {err && (
            <div className="mt-3 text-xs text-red-300 text-center">{err}</div>
          )}

          <div className="flex gap-2 mt-5">
            <button
              onClick={onClose}
              className="flex-1 panel py-3 rounded-xl text-amber-200 text-sm font-bold"
            >
              取消
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="flex-[1.6] gold-btn py-3 rounded-xl text-sm"
            >
              {saving ? "保存中…" : "保存资料"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

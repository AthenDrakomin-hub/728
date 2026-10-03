"use client";

import { apiFetch } from "@/lib/api";
import { navigateHome, navigateLobby } from "@/lib/navigation";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { AppLink } from "@/components/AppLink";
import { Me, ROLE_LABEL } from "@/lib/types";
import { Logo } from "@/components/Logo";

interface UserRow {
  id: number;
  account: string;
  role: string;
  credit: number;
  commission: number;
  points: number;
  inviteCode: string;
  invitedByCode: string | null;
  securityCode: string;
  openRoomBlocked: boolean;
}
interface LedgerItem {
  id: number;
  account: string;
  amount: number;
  balanceAfter: number;
  type: string;
  note: string | null;
  operator: string;
  createdAt: string;
}

const ROLES = ["player", "agent", "top_agent", "customer_service", "admin"];
const TYPE_LABEL: Record<string, string> = {
  cs_adjust: "客服调整",
  room_deduct: "对局扣费",
  commission: "下线记账",
  gift: "赠送",
};

export default function Admin() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [tab, setTab] = useState<"users" | "ledger" | "maint" | "config">("users");
  const [cleanStat, setCleanStat] = useState<Record<string, number> | null>(null);
  const [cleaning, setCleaning] = useState(false);
  const [stats, setStats] = useState<Record<string, any> | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "tree">("list");
  const [msg, setMsg] = useState("");
  const [editing, setEditing] = useState<UserRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [ledger, setLedger] = useState<LedgerItem[]>([]);
  const [ledgerUser, setLedgerUser] = useState<UserRow | null>(null);
  const [summary, setSummary] = useState({
    csIn: 0,
    csOut: 0,
    deduct: 0,
    commission: 0,
  });
  const [config, setConfig] = useState<Record<string, string>>({});
  const [configSaving, setConfigSaving] = useState(false);

  const loadUsers = useCallback(async (query = "", role = "") => {
    const res = await apiFetch(
      `/api/admin/users?q=${encodeURIComponent(query)}&role=${role}`
    );
    if (res.ok) setUsers((await res.json()).users || []);
  }, []);

  const loadLedger = useCallback(async (userId?: number) => {
    const res = await apiFetch(
      `/api/admin/ledger${userId ? `?userId=${userId}` : ""}`
    );
    if (res.ok) {
      const d = await res.json();
      setLedger(d.items || []);
      setSummary(d.summary);
    }
  }, []);

  useEffect(() => {
    apiFetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (!d.user) return navigateHome();
        if (d.user.role !== "admin" && d.user.role !== "customer_service")
          return navigateLobby();
        setMe(d.user);
        loadUsers();
        apiFetch("/api/admin/stats").then((r) => r.json()).then(setStats).catch(() => {});
      });
  }, [router, loadUsers]);

  function flash(t: string) {
    setMsg(t);
    setTimeout(() => setMsg(""), 3500);
  }

  async function adjust(userId: number, amount: number) {
    const res = await apiFetch("/api/admin/adjust-credit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, amount }),
    });
    const d = await res.json();
    if (!res.ok) return flash(d.error || "操作失败");
    flash(
      d.resolvedCount > 0
        ? `调整成功，补扣 ${d.resolvedCount} 笔，开房权限${
            d.openRoomBlocked ? "仍冻结" : "已恢复"
          }`
        : "信用分调整成功"
    );
    loadUsers(q, roleFilter);
  }

  async function saveUser(payload: Record<string, unknown>, isNew: boolean) {
    const res = await apiFetch("/api/admin/users", {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const d = await res.json();
    if (!res.ok) return flash(d.error || "保存失败");
    flash(isNew ? "用户创建成功" : "用户已更新");
    setEditing(null);
    setCreating(false);
    loadUsers(q, roleFilter);
  }

  async function removeUser(u: UserRow) {
    if (!confirm(`确定删除用户「${u.account}」？此操作不可恢复`)) return;
    const res = await apiFetch(`/api/admin/users?id=${u.id}`, {
      method: "DELETE",
    });
    const d = await res.json();
    if (!res.ok) return flash(d.error || "删除失败");
    flash("用户已删除");
    loadUsers(q, roleFilter);
  }

  if (!me) return null;
  const isAdmin = me.role === "admin";

  return (
    <div className="min-h-screen px-3 py-3 pb-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <AppLink href="/lobby" className="panel px-3 py-2 rounded-lg gold-ink text-xs">
            ← 大厅
          </AppLink>
          <div className="flex items-center gap-2">
            <Logo size={28} />
            <span className="text-sm font-black gold-text">
              {isAdmin ? "管理工作台" : "客服工作台"}
            </span>
          </div>
          <div className="w-14" />
        </div>

        <div className="flex gap-1 mb-3 panel rounded-xl p-1">
          {(
            ([
              ["users", "👥 用户管理"],
              ["ledger", "📒 对账明细"],
              ...(isAdmin ? [["maint", "🧹 数据维护"], ["config", "⚙️ 系统配置"]] : []),
            ] as [string, string][])
          ).map(([k, label]) => (
            <button
              key={k}
              onClick={() => {
                setTab(k as "users" | "ledger" | "maint" | "config");
                if (k === "ledger") {
                  setLedgerUser(null);
                  loadLedger();
                }
                if (k === "maint") {
                  fetch("/api/history/cleanup").then((r) => r.json()).then(setCleanStat);
                  apiFetch("/api/admin/stats").then((r) => r.json()).then(setStats);
                }
                if (k === "config") {
                  apiFetch("/api/admin/config").then((r) => r.json()).then((d) => setConfig(d.config || {}));
                }
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold ${
                tab === k ? "gold-btn" : "text-amber-200/60"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 数据概览 */}
        {stats && (
          <div className="grid grid-cols-4 gap-1.5 mb-3">
            <div className="panel rounded-xl p-2 text-center">
              <div className="text-[9px] text-amber-200/60">总用户</div>
              <div className="gold-text font-black text-sm">{stats.totalUsers || 0}</div>
            </div>
            <div className="panel rounded-xl p-2 text-center">
              <div className="text-[9px] text-amber-200/60">进行中</div>
              <div className="text-green-400 font-black text-sm">{stats.activeRooms || 0}</div>
            </div>
            <div className="panel rounded-xl p-2 text-center">
              <div className="text-[9px] text-amber-200/60">代理数</div>
              <div className="text-blue-400 font-black text-sm">{stats.users?.agent || 0}</div>
            </div>
            <div className="panel rounded-xl p-2 text-center">
              <div className="text-[9px] text-amber-200/60">总代理</div>
              <div className="text-purple-400 font-black text-sm">{stats.users?.top_agent || 0}</div>
            </div>
          </div>
        )}

        {msg && (
          <div className="panel rounded-lg p-2.5 text-xs text-amber-200 mb-3">
            {msg}
          </div>
        )}

        {tab === "users" && (
          <>
            <div className="flex gap-1.5 mb-3">
              <button
                onClick={() => setViewMode("list")}
                className={`flex-1 py-2 rounded-xl text-xs font-bold ${viewMode === "list" ? "gold-btn" : "panel text-amber-200/60"}`}
              >
                📋 列表视图
              </button>
              <button
                onClick={() => setViewMode("tree")}
                className={`flex-1 py-2 rounded-xl text-xs font-bold ${viewMode === "tree" ? "gold-btn" : "panel text-amber-200/60"}`}
              >
                🌳 结构树
              </button>
            </div>

            {viewMode === "list" && (
            <>
            <div className="flex gap-2 mb-2">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && loadUsers(q, roleFilter)}
                placeholder="搜索账号 / 邀请码"
                className="flex-1 min-w-0 px-3 py-2.5 rounded-xl bg-black/35 gold-border text-amber-100 text-sm outline-none"
              />
              <button
                onClick={() => loadUsers(q, roleFilter)}
                className="gold-btn px-4 rounded-xl text-sm shrink-0"
              >
                搜索
              </button>
            </div>

            <div className="flex gap-1.5 mb-3 overflow-x-auto no-scrollbar">
              {[["", "全部"], ...ROLES.map((r) => [r, ROLE_LABEL[r]])].map(
                ([v, label]) => (
                  <button
                    key={v}
                    onClick={() => {
                      setRoleFilter(v);
                      loadUsers(q, v);
                    }}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap shrink-0 ${
                      roleFilter === v
                        ? "gold-btn"
                        : "panel text-amber-200/60"
                    }`}
                  >
                    {label}
                  </button>
                )
              )}
            </div>

            {isAdmin && (
              <button
                onClick={() => {
                  setCreating(true);
                  setEditing(null);
                }}
                className="gold-btn w-full py-3 rounded-xl mb-3 text-sm"
              >
                ＋ 新建用户
              </button>
            )}

            {creating && (
              <UserForm
                isNew
                onCancel={() => setCreating(false)}
                onSave={(p) => saveUser(p, true)}
              />
            )}
            {editing && (
              <UserForm
                isNew={false}
                isAdmin={isAdmin}
                initial={editing}
                onCancel={() => setEditing(null)}
                onSave={(p) => saveUser({ ...p, id: editing.id }, false)}
              />
            )}

            <div className="space-y-2">
              {users.length === 0 && (
                <div className="panel rounded-2xl p-6 text-center text-amber-200/40 text-sm">
                  无用户数据
                </div>
              )}
              {users.map((u) => {
                const unlimited = u.role === "admin";
                // 只有代理/总代理使用信用分（水费账户），玩家与客服不需要
                const useCredit =
                  u.role === "agent" || u.role === "top_agent" || unlimited;
                return (
                  <div key={u.id} className="panel rounded-2xl p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="font-bold text-amber-100 text-sm truncate flex items-center gap-1.5 flex-wrap">
                          {u.account}
                          <span className="text-[10px] bg-black/40 gold-border px-1.5 py-0.5 rounded font-normal">
                            {ROLE_LABEL[u.role]}
                          </span>
                          {u.openRoomBlocked && (
                            <span className="text-[10px] bg-red-700 px-1.5 py-0.5 rounded">
                              冻结
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-amber-200/50 mt-0.5 truncate">
                          邀请码 {u.inviteCode}
                          {u.invitedByCode && ` · 上级 ${u.invitedByCode}`}
                        </div>
                      </div>
                      {useCredit ? (
                        <div className="text-right shrink-0">
                          <div className="text-[9px] text-amber-200/60">
                            信用分
                          </div>
                          <div className="gold-text font-black text-base sm:text-lg leading-tight whitespace-nowrap">
                            {unlimited ? "∞" : u.credit.toLocaleString()}
                          </div>
                        </div>
                      ) : (
                        <div className="text-right shrink-0">
                          <div className="text-[9px] text-amber-200/40">
                            无需信用分
                          </div>
                        </div>
                      )}
                    </div>

                    {useCredit && !unlimited && (
                      <>
                        <div className="flex gap-1.5 mt-2.5 flex-wrap">
                          {[100, 500, 1000, 5000].map((a) => (
                            <button
                              key={a}
                              onClick={() => adjust(u.id, a)}
                              className="text-[11px] bg-green-700 active:bg-green-600 px-2.5 py-1.5 rounded-lg font-bold"
                            >
                              +{a}
                            </button>
                          ))}
                          {[-100, -500, -1000].map((a) => (
                            <button
                              key={a}
                              onClick={() => adjust(u.id, a)}
                              className="text-[11px] bg-red-700 active:bg-red-600 px-2.5 py-1.5 rounded-lg font-bold"
                            >
                              {a}
                            </button>
                          ))}
                        </div>
                        <CustomAdjust onSubmit={(v) => adjust(u.id, v)} />
                      </>
                    )}

                    <div className="flex gap-1.5 mt-2 pt-2 border-t border-amber-500/15">
                      {isAdmin && (
                      <button
                        onClick={() => {
                          setEditing(u);
                          setCreating(false);
                        }}
                        className="flex-1 text-[11px] panel py-2 rounded-lg text-amber-200 font-bold"
                      >
                        ✏️ 编辑
                      </button>
                      )}
                      <button
                        onClick={() => {
                          setTab("ledger");
                          setLedgerUser(u);
                          loadLedger(u.id);
                        }}
                        className="flex-1 text-[11px] panel py-2 rounded-lg text-amber-200 font-bold"
                      >
                        📒 对账
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => removeUser(u)}
                          className="flex-1 text-[11px] bg-red-900/60 py-2 rounded-lg text-red-200 font-bold"
                        >
                          🗑 删除
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            </>
            )}

            {viewMode === "tree" && (
              <div className="space-y-3">
                {(() => {
                  const byInvite = new Map<string, UserRow>();
                  users.forEach((u) => byInvite.set(u.inviteCode, u));
                  const topAgents = users.filter((u) => u.role === "top_agent");
                  const orphanAgents = users.filter((u) => u.role === "agent" && (!u.invitedByCode || !byInvite.has(u.invitedByCode)));
                  const orphanPlayers = users.filter((u) => u.role === "player" && (!u.invitedByCode || !byInvite.has(u.invitedByCode)));

                  const renderUser = (u: UserRow) => (
                    <div key={u.id} className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-black/20">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold shrink-0">
                        {ROLE_LABEL[u.role]}
                      </span>
                      <span className="text-sm text-amber-100 font-bold flex-1 truncate">{u.account}</span>
                      <span className="text-[10px] text-amber-200/50">筹码 {u.points}</span>
                      <button onClick={() => setEditing(u)} className="text-[10px] px-2 py-1 rounded panel text-amber-200">编辑</button>
                    </div>
                  );

                  const renderAgent = (agent: UserRow) => {
                    const players = users.filter((u) => u.invitedByCode === agent.inviteCode && u.role === "player");
                    return (
                      <div key={agent.id} className="border-l-2 border-amber-500/30 pl-2 ml-2">
                        {renderUser(agent)}
                        {players.length > 0 && (
                          <div className="ml-2 border-l border-amber-500/15 pl-2">
                            {players.map(renderUser)}
                          </div>
                        )}
                      </div>
                    );
                  };

                  return (
                    <>
                      {topAgents.map((ta) => {
                        const agents = users.filter((u) => u.invitedByCode === ta.inviteCode && u.role === "agent");
                        const directPlayers = users.filter((u) => u.invitedByCode === ta.inviteCode && u.role === "player");
                        return (
                          <div key={ta.id} className="panel rounded-xl p-3">
                            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-amber-500/20">
                              <span className="text-lg">👑</span>
                              <span className="text-sm gold-text font-black">{ta.account}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/30 text-amber-200 font-bold">总代理</span>
                              <span className="text-[10px] text-amber-200/50 ml-auto">邀请码 {ta.inviteCode}</span>
                            </div>
                            {agents.map(renderAgent)}
                            {directPlayers.length > 0 && (
                              <div className="ml-2 border-l border-amber-500/15 pl-2 mt-1">
                                <div className="text-[10px] text-amber-200/40 mb-1">直邀玩家</div>
                                {directPlayers.map(renderUser)}
                              </div>
                            )}
                          </div>
                        );
                      })}
                      {orphanAgents.length > 0 && (
                        <div className="panel rounded-xl p-3">
                          <div className="text-xs text-amber-200/60 mb-2">📌 无上级代理</div>
                          {orphanAgents.map(renderAgent)}
                        </div>
                      )}
                      {orphanPlayers.length > 0 && (
                        <div className="panel rounded-xl p-3">
                          <div className="text-xs text-amber-200/60 mb-2">📌 无上级玩家（{orphanPlayers.length}人）</div>
                          <div className="grid grid-cols-2 gap-1">
                            {orphanPlayers.map((p) => (
                              <div key={p.id} className="text-[11px] text-amber-100/70 py-1 px-2 rounded hover:bg-black/20 flex items-center gap-1">
                                <span>{p.account}</span>
                                <button onClick={() => setEditing(p)} className="text-[9px] text-amber-300/60 ml-auto">编辑</button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            )}
          </>
        )}

        {tab === "ledger" && (
          /* ---------- Ledger ---------- */
          <>
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm gold-text font-bold">
                {ledgerUser ? `${ledgerUser.account} 的流水` : "全平台流水"}
              </div>
              {ledgerUser && (
                <button
                  onClick={() => {
                    setLedgerUser(null);
                    loadLedger();
                  }}
                  className="panel px-3 py-1.5 rounded-lg text-[11px] text-amber-200"
                >
                  查看全部
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <Sum label="客服加分" value={summary.csIn} tone="green" />
              <Sum label="客服减分" value={summary.csOut} tone="red" />
              <Sum label="对局扣费" value={summary.deduct} tone="amber" />
              <Sum label="下线记账" value={summary.commission} tone="green" />
            </div>

            <div className="space-y-1.5">
              {ledger.length === 0 && (
                <div className="panel rounded-2xl p-6 text-center text-amber-200/40 text-sm">
                  暂无流水
                </div>
              )}
              {ledger.map((it) => (
                <div key={it.id} className="panel rounded-xl p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-amber-100 truncate">
                        {it.account}
                        <span className="ml-1.5 text-[10px] font-normal text-amber-200/50">
                          {TYPE_LABEL[it.type] || it.type}
                        </span>
                      </div>
                      <div className="text-[10px] text-amber-200/45 mt-0.5 truncate">
                        {it.note} · 操作 {it.operator}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div
                        className={`font-black text-base ${
                          it.amount >= 0 ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {it.amount > 0 ? "+" : ""}
                        {it.amount.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-amber-200/45">
                        余 {it.balanceAfter.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-[9px] text-amber-200/30 mt-1">
                    {new Date(it.createdAt).toLocaleString("zh-CN")}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "maint" && (
          <div className="space-y-3">
            {/* 平台运营概览 */}
            <div className="panel rounded-2xl p-4">
              <div className="text-sm font-bold gold-text mb-3">📊 平台运营概览</div>
              {stats ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <Sum label="总用户" value={stats.totalUsers} tone="amber" />
                    <Sum label="进行中房间" value={stats.activeRooms} tone="green" />
                    <Sum label="已结束房间" value={stats.finishedRooms} tone="amber" />
                    <Sum label="总房间数" value={stats.totalRooms} tone="amber" />
                  </div>
                  <div className="border-t border-amber-500/20 pt-3">
                    <div className="text-[11px] text-amber-200/60 mb-2">用户角色分布</div>
                    <div className="grid grid-cols-3 gap-1.5 text-center">
                      <div className="bg-black/30 rounded-lg py-1.5">
                        <div className="text-sm font-bold text-amber-100">{stats.users?.player || 0}</div>
                        <div className="text-[9px] text-amber-200/50">玩家</div>
                      </div>
                      <div className="bg-black/30 rounded-lg py-1.5">
                        <div className="text-sm font-bold text-amber-100">{stats.users?.agent || 0}</div>
                        <div className="text-[9px] text-amber-200/50">代理</div>
                      </div>
                      <div className="bg-black/30 rounded-lg py-1.5">
                        <div className="text-sm font-bold text-amber-100">{stats.users?.top_agent || 0}</div>
                        <div className="text-[9px] text-amber-200/50">总代理</div>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-amber-500/20 pt-3">
                    <div className="text-[11px] text-amber-200/60 mb-2">资金流水</div>
                    <div className="grid grid-cols-2 gap-2">
                      <Sum label="总流水" value={stats.totalFlow} tone="amber" />
                      <Sum label="总房费" value={stats.totalRake} tone="green" />
                      <Sum label="信用分扣除" value={stats.totalDeduct} tone="red" />
                      <Sum label="总返佣" value={stats.totalCommission} tone="amber" />
                    </div>
                  </div>
                  <div className="text-[10px] text-amber-200/40 bg-black/30 rounded-lg p-2">
                    💡 平台净收入 = 总房费 + 信用分扣除 - 总返佣
                  </div>
                </div>
              ) : (
                <div className="text-amber-200/40 text-sm">加载中…</div>
              )}
            </div>

            <div className="panel rounded-2xl p-4">
              <div className="text-sm font-bold gold-text mb-3">
                🗄️ 数据概况
              </div>
              {cleanStat ? (
                <div className="grid grid-cols-2 gap-2">
                  <Sum label="房间总数" value={cleanStat.rooms} tone="amber" />
                  <Sum
                    label="已归档房间"
                    value={cleanStat.archivedRooms}
                    tone="green"
                  />
                  <Sum label="对局记录" value={cleanStat.rounds} tone="amber" />
                  <Sum label="聊天消息" value={cleanStat.messages} tone="amber" />
                </div>
              ) : (
                <div className="text-amber-200/40 text-sm">加载中…</div>
              )}
            </div>

            <div className="panel rounded-2xl p-4">
              <div className="text-sm font-bold gold-text mb-2">🧹 一键清理</div>
              <ul className="text-[11px] text-amber-200/60 space-y-1 mb-3 leading-relaxed">
                <li>• 归档已结束的房间并清除其临时手牌状态</li>
                <li>• 每个房间仅保留最近 25 局对局记录</li>
                <li>• 删除 3 天前的房间聊天消息</li>
              </ul>
              <button
                disabled={cleaning}
                onClick={async () => {
                  if (!confirm("确认执行历史数据清理？该操作不可撤销")) return;
                  setCleaning(true);
                  try {
                    const r = await fetch("/api/history/cleanup", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({}),
                    });
                    const d = await r.json();
                    if (!r.ok) return flash(d.error || "清理失败");
                    flash(
                      `清理完成：归档 ${d.archivedRooms} 房 · 清手牌 ${d.clearedHandStates} · 删消息 ${d.deletedMessages} · 精简对局 ${d.trimmedRounds}`
                    );
                    const s2 = await fetch("/api/history/cleanup").then((x) =>
                      x.json()
                    );
                    setCleanStat(s2);
                  } finally {
                    setCleaning(false);
                  }
                }}
                className="gold-btn w-full py-3 rounded-xl text-sm"
              >
                {cleaning ? "清理中…" : "执行清理"}
              </button>
            </div>
          </div>
        )}

        {tab === "config" && (
          <div className="space-y-3">
            <div className="panel rounded-2xl p-4">
              <div className="text-sm font-bold gold-text mb-3">⚙️ 全局比例配置</div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-amber-200/70 block mb-1">
                    游戏内房费比例（%）— 从赢家赢得的筹码中扣除
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={config.platform_rake_rate ?? "3"}
                    onChange={(e) => setConfig({ ...config, platform_rake_rate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-amber-500/40 text-amber-100 text-center text-lg font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs text-amber-200/70 block mb-1">
                    代理信用分扣除比例（%）— 按房间总流水从房主信用分扣除
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={config.agent_deduct_rate ?? "2"}
                    onChange={(e) => setConfig({ ...config, agent_deduct_rate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-amber-500/40 text-amber-100 text-center text-lg font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs text-amber-200/70 block mb-1">
                    代理返佣比例（%）— 代理自己开房产生的流水返佣
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={config.agent_commission_rate ?? "1"}
                    onChange={(e) => setConfig({ ...config, agent_commission_rate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-amber-500/40 text-amber-100 text-center text-lg font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs text-amber-200/70 block mb-1">
                    总代理返佣比例（%）— 总代理下线代理开房产生的流水返佣
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={config.top_agent_commission_rate ?? "1"}
                    onChange={(e) => setConfig({ ...config, top_agent_commission_rate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-amber-500/40 text-amber-100 text-center text-lg font-bold"
                  />
                </div>

                {/* APP热更新配置 */}
                <div className="mt-6 pt-4 border-t border-amber-500/20">
                  <div className="text-sm font-bold text-amber-300 mb-3">📱 APP热更新配置</div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-amber-200/70 block mb-1">当前版本号</label>
                      <input
                        type="text"
                        placeholder="1.0.0"
                        value={config.app_version ?? "1.0.0"}
                        onChange={(e) => setConfig({ ...config, app_version: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-amber-500/40 text-amber-100 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-amber-200/70 block mb-1">WGT更新包地址（留空=无更新）</label>
                      <input
                        type="text"
                        placeholder="https://goodspage.cn/wgt/vpoker-1.0.1.wgt"
                        value={config.app_wgt_url ?? ""}
                        onChange={(e) => setConfig({ ...config, app_wgt_url: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-amber-500/40 text-amber-100 text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="forceUpdate"
                        checked={config.app_wgt_force === "1"}
                        onChange={(e) => setConfig({ ...config, app_wgt_force: e.target.checked ? "1" : "0" })}
                        className="w-4 h-4"
                      />
                      <label htmlFor="forceUpdate" className="text-xs text-amber-200/70">强制更新（用户必须更新才能使用）</label>
                    </div>
                    <div>
                      <label className="text-xs text-amber-200/70 block mb-1">更新日志</label>
                      <textarea
                        placeholder="1. 新增炸金花游戏\n2. 优化牌桌动画\n3. 修复已知问题"
                        value={config.app_changelog ?? ""}
                        onChange={(e) => setConfig({ ...config, app_changelog: e.target.value })}
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-amber-500/40 text-amber-100 text-sm resize-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-amber-200/70 block mb-1">APP完整包下载地址</label>
                      <input
                        type="text"
                        placeholder="https://..."
                        value={config.app_download_url ?? ""}
                        onChange={(e) => setConfig({ ...config, app_download_url: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-amber-500/40 text-amber-100 text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div className="text-[11px] text-amber-200/50 bg-black/30 rounded-lg p-3 leading-relaxed">
                  <div>💡 平台收入 = 房费% + 代理信用分扣除%</div>
                  <div>💡 平台支出 = 代理返佣% + 总代理返佣%</div>
                  <div>💡 所有比例全局生效，所有代理/总代理统一使用</div>
                  <div>💡 修改后新开局立即生效，进行中的牌局不受影响</div>
                </div>
                <button
                  disabled={configSaving}
                  onClick={async () => {
                    setConfigSaving(true);
                    try {
                      const res = await apiFetch("/api/admin/config", {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          platform_rake_rate: Number(config.platform_rake_rate),
                          agent_deduct_rate: Number(config.agent_deduct_rate),
                          agent_commission_rate: Number(config.agent_commission_rate),
                          top_agent_commission_rate: Number(config.top_agent_commission_rate),
                          app_version: config.app_version,
                          app_wgt_url: config.app_wgt_url,
                          app_wgt_force: config.app_wgt_force,
                          app_changelog: config.app_changelog,
                          app_download_url: config.app_download_url,
                        }),
                      });
                      const d = await res.json();
                      if (!res.ok) return flash(d.error || "保存失败");
                      setConfig(d.config);
                      flash("配置已保存");
                    } finally {
                      setConfigSaving(false);
                    }
                  }}
                  className="gold-btn w-full py-3 rounded-xl text-sm font-bold"
                >
                  {configSaving ? "保存中…" : "💾 保存配置"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Sum({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "green" | "red" | "amber";
}) {
  const c =
    tone === "green"
      ? "text-green-400"
      : tone === "red"
      ? "text-red-400"
      : "text-amber-300";
  return (
    <div className="panel rounded-xl p-2.5">
      <div className="text-[10px] text-amber-200/60">{label}</div>
      <div className={`font-black text-base sm:text-lg ${c} truncate`}>{value.toLocaleString()}</div>
    </div>
  );
}

function CustomAdjust({ onSubmit }: { onSubmit: (v: number) => void }) {
  const [v, setV] = useState("");
  return (
    <div className="flex gap-1.5 mt-2">
      <input
        inputMode="numeric"
        placeholder="自定义增减，如 2000 或 -300"
        value={v}
        onChange={(e) => setV(e.target.value)}
        className="w-full min-w-0 bg-black/40 gold-border rounded-lg px-2.5 py-2 text-xs text-amber-100 outline-none"
      />
      <button
        onClick={() => {
          const n = Number(v);
          if (n) {
            onSubmit(n);
            setV("");
          }
        }}
        className="gold-btn px-4 rounded-lg text-xs shrink-0"
      >
        确认
      </button>
    </div>
  );
}

function UserForm({
  isNew,
  isAdmin = true,
  initial,
  onCancel,
  onSave,
}: {
  isNew: boolean;
  isAdmin?: boolean;
  initial?: UserRow;
  onCancel: () => void;
  onSave: (p: Record<string, unknown>) => void;
}) {
  const [f, setF] = useState({
    account: initial?.account || "",
    password: "",
    role: initial?.role || "player",
    securityCode: initial?.securityCode || "",
    points: initial ? String((initial as any).points || 0) : "0",
    credit: initial ? String(initial.credit) : "0",
    commission: initial ? String((initial as any).commission || 0) : "0",
    invitedByCode: initial?.invitedByCode || "",
  });
  const set = (k: string, v: string) => setF((s) => ({ ...s, [k]: v }));

  return (
    <div className="panel rounded-2xl p-4 mb-3">
      <div className="text-sm font-bold gold-text mb-3">
        {isNew ? "＋ 新建用户" : `✏️ 编辑 ${initial?.account}`}
      </div>
      <div className="space-y-2">
        <Field label="账号">
          <input
            value={f.account}
            onChange={(e) => set("account", e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg bg-black/40 gold-border text-amber-100 text-sm outline-none"
          />
        </Field>
        <Field label={isNew ? "密码" : "新密码（留空不改）"}>
          <input
            value={f.password}
            onChange={(e) => set("password", e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg bg-black/40 gold-border text-amber-100 text-sm outline-none"
          />
        </Field>
        <Field label="安全码">
          <input
            value={f.securityCode}
            onChange={(e) => set("securityCode", e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg bg-black/40 gold-border text-amber-100 text-sm outline-none"
          />
        </Field>
        {isAdmin && (
          <Field label="身份">
            <select
              value={f.role}
              onChange={(e) => set("role", e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg bg-black/40 gold-border text-amber-100 text-sm outline-none"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABEL[r]}
                </option>
              ))}
            </select>
          </Field>
        )}
        {isNew && (
          <>
            <Field label="上级邀请码（可空）">
              <input
                value={f.invitedByCode}
                onChange={(e) => set("invitedByCode", e.target.value.toUpperCase())}
                className="w-full px-3 py-2.5 rounded-lg bg-black/40 gold-border text-amber-100 text-sm outline-none"
              />
            </Field>
            <Field label="初始信用分">
              <input
                inputMode="numeric"
                value={f.credit}
                onChange={(e) => set("credit", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-black/40 gold-border text-amber-100 text-sm outline-none"
              />
            </Field>
          </>
        )}
        {!isNew && isAdmin && (
          <>
            <Field label="筹码（可调整）">
              <input
                inputMode="numeric"
                value={f.points}
                onChange={(e) => set("points", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-black/40 gold-border text-amber-100 text-sm outline-none"
              />
            </Field>
            <Field label="信用分">
              <input
                inputMode="numeric"
                value={f.credit}
                onChange={(e) => set("credit", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-black/40 gold-border text-amber-100 text-sm outline-none"
              />
            </Field>
            <Field label="返佣余额">
              <input
                inputMode="numeric"
                value={f.commission}
                onChange={(e) => set("commission", e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-black/40 gold-border text-amber-100 text-sm outline-none"
              />
            </Field>
          </>
        )}
      </div>
      <div className="flex gap-2 mt-3">
        <button
          onClick={onCancel}
          className="flex-1 panel py-2.5 rounded-xl text-amber-200 text-sm font-bold"
        >
          取消
        </button>
        <button
          onClick={() => {
            const p: Record<string, unknown> = {
              account: f.account,
              securityCode: f.securityCode,
            };
            if (f.password) p.password = f.password;
            if (isAdmin) p.role = f.role;
            if (isNew) {
              p.credit = Number(f.credit) || 0;
              if (f.invitedByCode) p.invitedByCode = f.invitedByCode;
            } else if (isAdmin) {
              p.points = Math.max(0, Number(f.points) || 0);
              p.credit = Number(f.credit) || 0;
              p.commission = Number(f.commission) || 0;
            }
            onSave(p);
          }}
          className="flex-[1.5] gold-btn py-2.5 rounded-xl text-sm"
        >
          保存
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[11px] text-amber-200/60 mb-1">{label}</div>
      {children}
    </div>
  );
}

"use client";

import { apiFetch } from "@/lib/api";
import { navigateHome } from "@/lib/navigation";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppLink } from "@/components/AppLink";
import { ROLE_LABEL } from "@/lib/types";

interface Downline {
  id: number;
  account: string;
  role: string;
  credit: number;
  totalFlow: number;
  commission: number;
}
interface Daily {
  date: string;
  flow: number;
  commission: number;
}
interface Data {
  isTopAgent: boolean;
  inviteCode: string;
  credit: number;
  commission: number;
  topAgentCommissionRate: number;
  downlines: Downline[];
  daily: Daily[];
  todayFlow: number;
  todayCommission: number;
  totalFlow: number;
  totalCommission: number;
}

export default function Promotion() {
  const router = useRouter();
  const [data, setData] = useState<Data | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    apiFetch("/api/agent/promotion")
      .then((r) => {
        if (r.status === 401) {
          navigateHome();
          return null;
        }
        return r.json();
      })
      .then((d) => d && setData(d));
  }, [router]);

  if (!data) return null;

  const maxFlow = Math.max(1, ...data.daily.map((d) => d.flow));

  return (
    <div className="min-h-screen px-3 py-3 pb-24">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <AppLink href="/lobby" className="panel px-3 py-2 rounded-lg gold-ink text-sm">
            ← 大厅
          </AppLink>
          <div className="text-lg font-black gold-text">推广中心</div>
          <div className="w-14" />
        </div>

        {/* Invite code */}
        <div className="panel rounded-2xl p-4 mb-3">
          <div className="text-xs text-amber-200/60">
            我的邀请码 · 分享给下级代理
          </div>
          <div className="flex items-center justify-between gap-3 mt-1">
            <div className="text-xl sm:text-3xl font-black gold-text tracking-[0.12em] truncate min-w-0">
              {data.inviteCode}
            </div>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(data.inviteCode);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
              className="gold-btn px-3 py-2 rounded-lg text-xs shrink-0"
            >
              {copied ? "已复制" : "复制"}
            </button>
          </div>
        </div>

        {!data.isTopAgent ? (
          <div className="panel rounded-2xl p-6 text-center text-amber-200/60 text-sm">
            推广中心为总代理专属功能
          </div>
        ) : (
          <>
            {/* Today */}
            <div className="panel rounded-2xl p-4 mb-3 bg-gradient-to-br from-amber-900/40 to-transparent">
              <div className="text-xs text-amber-200/70 mb-2">
                📅 今日下线流水返佣（自动入账返佣账户，比例 {data.topAgentCommissionRate}%）
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[11px] text-amber-200/60">今日流水</div>
                  <div className="text-xl sm:text-2xl font-black text-amber-100 truncate">
                    {data.todayFlow.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-amber-200/60">
                    今日返佣
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-green-400 truncate">
                    +{data.todayCommission.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              <Stat label="信用分" value={data.credit.toLocaleString()} />
              <Stat label="返佣余额" value={(data.commission || 0).toLocaleString()} />
              <Stat
                label="累计返佣"
                value={data.totalCommission.toLocaleString()}
              />
            </div>

            {/* Daily chart */}
            <div className="panel rounded-2xl p-4 mb-3">
              <div className="text-sm font-bold gold-text mb-3">
                每日水费分成（近 14 天）
              </div>
              {data.daily.length === 0 ? (
                <div className="text-amber-200/40 text-sm">暂无流水记录</div>
              ) : (
                <div className="space-y-2">
                  {data.daily.map((d) => (
                    <div key={d.date}>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-amber-200/70">{d.date}</span>
                        <span className="text-amber-100">
                          流水 {d.flow.toLocaleString()}{" "}
                          <span className="gold-text font-bold">
                            → 分成 +{d.commission.toLocaleString()}
                          </span>
                        </span>
                      </div>
                      <div className="h-2 bg-black/40 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300"
                          style={{ width: `${(d.flow / maxFlow) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Downlines */}
            <div className="panel rounded-2xl p-4">
              <div className="text-sm font-bold gold-text mb-3">
                下线（{data.downlines.length}）— 代理+玩家
              </div>
              {data.downlines.length === 0 ? (
                <div className="text-amber-200/40 text-sm">
                  暂无下线，分享邀请码发展代理和玩家
                </div>
              ) : (
                <div className="space-y-2">
                  {data.downlines.map((d) => (
                    <div
                      key={d.id}
                      className="bg-black/25 rounded-xl px-3 py-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-bold text-amber-100 text-sm">
                          {d.account}
                        </div>
                        <div className="text-[11px] text-amber-200/50">
                          {ROLE_LABEL[d.role]}
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-1 mt-1.5 text-[10px] sm:text-[11px] flex-wrap">
                        <span className="text-amber-200/60">
                          信用 {d.credit.toLocaleString()}
                        </span>
                        <span className="text-amber-200/60">
                          流水{" "}
                          <b className="text-amber-100">
                            {d.totalFlow.toLocaleString()}
                          </b>
                        </span>
                        {d.role === "agent" && (
                          <span className="gold-text font-bold">
                            我得 +{d.commission.toLocaleString()}
                          </span>
                        )}
                      </div>
                      {d.role === "player" && (
                        <button
                          onClick={async () => {
                            if (!confirm(`确定将 ${d.account} 提升为代理？`)) return;
                            const res = await apiFetch("/api/agent/promote", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ userId: d.id }),
                            });
                            const data = await res.json().catch(() => ({}));
                            if (!res.ok) {
                              alert(data.error || "提升失败");
                              return;
                            }
                            alert("提升成功");
                            window.location.reload();
                          }}
                          className="mt-2 w-full py-1.5 rounded-lg text-[11px] bg-amber-900/40 border border-amber-500/40 text-amber-100 font-bold hover:bg-amber-800/50"
                        >
                          ⬆️ 提升为代理
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="panel rounded-xl p-3 text-center">
      <div className="text-[10px] text-amber-200/60 leading-tight">{label}</div>
      <div className="gold-text font-black text-base mt-0.5">{value}</div>
    </div>
  );
}

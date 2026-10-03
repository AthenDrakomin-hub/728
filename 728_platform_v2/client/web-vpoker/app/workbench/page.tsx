"use client";

import { apiFetch } from "@/lib/api";
import { navigateRoom, navigateHome, navigateLobby } from "@/lib/navigation";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppLink } from "@/components/AppLink";
import { Me } from "@/lib/types";
import { LEVELS, Level, levelForCredit } from "@/lib/rooms";

interface Room {
  id: number;
  roomNo: string;
  gameType: string;
  level: string;
  initialPoints: number;
  status: string;
  currentRound: number;
  totalRounds: number;
  totalFlow: number;
  totalRake: number;
}

const GAME_NAMES: Record<string, string> = {
  texas: "德州",
  jinhua: "金花",
  sangong: "三公",
  niuniu: "斗牛",
};

export default function Workbench() {
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    apiFetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (!d.user) return navigateHome();
        if (
          d.user.role !== "agent" &&
          d.user.role !== "top_agent"
        )
          return navigateLobby();
        setMe(d.user);
        apiFetch("/api/rooms/mine")
          .then((r) => r.json())
          .then((x) => setRooms(x.rooms || []));
      });
  }, [router]);

  if (!me) return null;
  const available = levelForCredit(
    me.role === "admin" ? 1_000_000 : me.credit
  );

  return (
    <div className="min-h-screen px-3 py-3 pb-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <AppLink href="/lobby" className="panel px-3 py-2 rounded-lg gold-ink text-xs">
            ← 大厅
          </AppLink>
          <div className="text-lg font-black gold-text">{me.role === "top_agent" ? "总代理工作台" : "代理工作台"}</div>
          <div className="w-14" />
        </div>

        <div className="grid grid-cols-4 gap-1.5 mb-4">
          <div className="panel rounded-2xl p-2.5 text-center">
            <div className="text-[9px] text-amber-200/60">信用分</div>
            <div className="gold-text font-black text-base sm:text-lg truncate">
              {me.role === "admin" ? "∞" : me.credit.toLocaleString()}
            </div>
          </div>
          <div className="panel rounded-2xl p-2.5 text-center">
            <div className="text-[9px] text-amber-200/60">返佣余额</div>
            <div className="text-green-400 font-black text-base sm:text-lg truncate">
              {(me.commission || 0).toLocaleString()}
            </div>
          </div>
          <div className="panel rounded-2xl p-2.5 text-center">
            <div className="text-[9px] text-amber-200/60">我的筹码</div>
            <div className="text-amber-100 font-black text-base sm:text-lg truncate">
              {me.points.toLocaleString()}
            </div>
          </div>
          <div className="panel rounded-2xl p-2.5 text-center">
            <div className="text-[9px] text-amber-200/60">开房权限</div>
            <div
              className={`font-black text-base sm:text-lg ${
                me.openRoomBlocked || me.credit < 100
                  ? "text-red-400"
                  : "text-green-400"
              }`}
            >
              {me.openRoomBlocked || me.credit < 100 ? "冻结" : "正常"}
            </div>
          </div>
        </div>

        {/* 汇总统计 */}
        <div className="grid grid-cols-3 gap-1.5 mb-4">
          <div className="panel rounded-2xl p-2.5 text-center">
            <div className="text-[9px] text-amber-200/60">总流水</div>
            <div className="text-amber-100 font-black text-sm truncate">{rooms.reduce((s, r) => s + r.totalFlow, 0).toLocaleString()}</div>
          </div>
          <div className="panel rounded-2xl p-2.5 text-center">
            <div className="text-[9px] text-amber-200/60">总房费</div>
            <div className="text-green-400 font-black text-sm truncate">{rooms.reduce((s, r) => s + r.totalRake, 0).toLocaleString()}</div>
          </div>
          <div className="panel rounded-2xl p-2.5 text-center">
            <div className="text-[9px] text-amber-200/60">进行中</div>
            <div className="text-blue-400 font-black text-sm">{rooms.filter(r => r.status === "playing").length}/{rooms.length}</div>
          </div>
        </div>

        <AppLink
          href="/workbench/players"
          className="frame-gold block mb-3"
        >
          <div className="frame-inner p-4 bg-gradient-to-r from-[#1b2a4d] to-[#0a1020] flex items-center justify-between">
            <div>
              <div className="gold-title text-base font-black">
                👥 我的玩家 · 上下分
              </div>
              <div className="text-[10px] text-amber-200/55 mt-0.5">
                给名下玩家上分 / 下分，查看筹码余额
              </div>
            </div>
            <span className="gold-btn px-3 py-2 rounded-lg text-xs shrink-0">
              进入 ▸
            </span>
          </div>
        </AppLink>

        <div className="panel rounded-2xl p-4 mb-4">
          <div className="text-sm font-bold gold-text mb-2">可开房间级别</div>
          <div className="flex gap-2">
            {(["junior", "senior", "top"] as Level[]).map((l) => (
              <div
                key={l}
                className={`flex-1 rounded-lg py-2 text-center text-xs ${
                  available.includes(l) && !me.openRoomBlocked && me.credit >= 100
                    ? "gold-btn"
                    : "bg-black/30 gold-border text-amber-200/40"
                }`}
              >
                <div className="font-bold">{LEVELS[l].name}</div>
                <div>{available.includes(l) ? "可开" : "未开放"}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel rounded-2xl p-5">
          <div className="text-lg font-bold gold-text mb-3">
            全部房间（{rooms.length}）
          </div>
          {rooms.length === 0 ? (
            <div className="text-amber-200/40 text-sm">
              暂无房间，进入任意游戏创建
            </div>
          ) : (
            <div className="space-y-2">
              {rooms.map((r) => (
                <button
                  key={r.id}
                  onClick={() => navigateRoom(r.id)}
                  className="w-full flex items-center justify-between bg-black/20 rounded-lg px-4 py-3 hover:bg-black/40"
                >
                  <div className="text-left">
                    <div className="font-bold text-amber-100">
                      {GAME_NAMES[r.gameType]} · 房号 {r.roomNo}
                    </div>
                    <div className="text-[10px] sm:text-xs text-amber-200/50 truncate">
                      {LEVELS[r.level as Level]?.name} · 流水{" "}
                      {r.totalFlow.toLocaleString()} · 房费{" "}
                      {r.totalRake.toLocaleString()}
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      r.status === "finished"
                        ? "bg-gray-600"
                        : r.status === "playing"
                        ? "bg-green-600"
                        : "bg-blue-600"
                    }`}
                  >
                    {r.currentRound}/{r.totalRounds}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

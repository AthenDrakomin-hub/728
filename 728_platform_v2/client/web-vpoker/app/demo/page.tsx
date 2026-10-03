"use client";

import { useState, useEffect } from "react";
import { AppLink } from "@/components/AppLink";
import { PlayingCard } from "@/components/Card";
import { Avatar } from "@/components/Avatar";
import { playTurn, playChipBet, playDealCards, setSoundEnabled } from "@/lib/sounds";
import { assetUrl } from "@/lib/assets";

/* ============ 模拟数据（无需登录即可预览牌桌） ============ */
interface DemoSeat {
  id: number;
  name: string;
  avatar: string;
  points: number;
  bet: number;
  cards: string[];
  hidden: boolean;
  folded?: boolean;
  hand?: string;
}

const SEATS_8: DemoSeat[] = [
  { id: 1, name: "我", avatar: "1", points: 12800, bet: 200, cards: ["♠A", "♥A"], hidden: false, hand: "一对A" },
  { id: 2, name: "北舍", avatar: "3", points: 30150, bet: 200, cards: ["", ""], hidden: true },
  { id: 3, name: "赛目", avatar: "2", points: 9410, bet: 400, cards: ["", ""], hidden: true },
  { id: 4, name: "靓靓", avatar: "7", points: 19260, bet: 0, cards: ["", ""], hidden: true, folded: true },
  { id: 5, name: "老张", avatar: "6", points: 20050, bet: 200, cards: ["", ""], hidden: true },
  { id: 6, name: "玫瑰", avatar: "4", points: 10450, bet: 800, cards: ["", ""], hidden: true },
  { id: 7, name: "阿飞", avatar: "5", points: 40090, bet: 0, cards: ["", ""], hidden: true, folded: true },
  { id: 8, name: "小雅", avatar: "8", points: 8070, bet: 200, cards: ["", ""], hidden: true },
];

const BOARD = ["♥5", "♦5", "♠5", "♣K", "♦9"];

export default function DemoPage() {
  const [turn, setTurn] = useState(0);
  const [tick, setTick] = useState(0);
  const [seatCount, setSeatCount] = useState(8);
  const [vw, setVw] = useState(390);
  useEffect(() => {
    const f = () => setVw(window.innerWidth);
    f();
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);
  const cardSize = (vw < 360 ? "xs" : vw < 480 ? "sm" : "md") as
    | "xs"
    | "sm"
    | "md";
  const holeSize = (vw < 400 ? "xs" : "sm") as "xs" | "sm";

  useEffect(() => {
    const t = setInterval(() => setTick((v) => (v + 1) % 30), 1000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const t = setInterval(() => {
      setTurn((v) => (v + 1) % seatCount);
      playTurn();
    }, 6000);
    return () => clearInterval(t);
  }, [seatCount]);

  const seats = SEATS_8.slice(0, seatCount);
  const n = seats.length;
  const pot = seats.reduce((a, s) => a + s.bet, 0) + 8800;

  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="stage" />

      {/* HUD */}
      <div
        className="relative z-30 px-2 pt-2"
        style={{ paddingTop: "calc(var(--safe-t) + 0.5rem)" }}
      >
        <div className="max-w-5xl mx-auto flex items-center gap-1.5 flex-wrap">
          <AppLink href="/" className="hud-pill px-2.5 py-1.5 text-[11px] gold-ink font-bold">
            ←
          </AppLink>
          <div className="hud-pill px-2.5 py-1.5 text-[10px] text-amber-200">
            🏠 房间 188888
          </div>
          <div className="hud-pill px-2.5 py-1.5 text-[10px] text-amber-200">
            德州扑克
          </div>
          <div className="flex-1" />
          <div className="hud-pill px-2.5 py-1.5 text-[10px]">
            <span className="text-amber-200/60">局数 </span>
            <span className="gold-text font-black">7/25</span>
          </div>
          <div className="hud-pill px-2.5 py-1.5 text-[10px] text-amber-200">
            河牌圈
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-2 flex items-center gap-1.5">
          <span className="text-[10px] text-amber-200/50">演示人数：</span>
          {[2, 4, 6, 8].map((c) => (
            <button
              key={c}
              onClick={() => setSeatCount(c)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                seatCount === c ? "gold-btn" : "hud-pill text-amber-200/70"
              }`}
            >
              {c} 人
            </button>
          ))}
        </div>
      </div>

      {/* 牌桌 */}
      <div className="table-stage relative z-10 flex-1 flex items-start justify-center px-2 py-2">
        <div className="w-full max-w-4xl">
          <div
            className="table-oval table-wrap mx-auto"
            style={{ aspectRatio: "1 / 1.15" }}
          >
            <div className="table-felt" style={{ backgroundImage: `radial-gradient(ellipse at 50% 42%, rgba(255,240,190,0.16) 0%, rgba(0,0,0,0.06) 45%, rgba(0,0,0,0.5) 100%), url(${assetUrl("/art/felt-texas.jpg")})` }}>
              {/* 中央 */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-6">
                <div className="board-row mb-3">
                  {BOARD.map((c, i) => (
                    <PlayingCard key={i} label={c} size={cardSize} delay={i * 90} />
                  ))}
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-end justify-center gap-1.5 h-8">
                    {["chip-black", "chip-green", "chip-blue", ""].map((cls, si) => (
                      <div key={si} className="relative" style={{ width: 20 }}>
                        {[0, 1, 2, 3].map((i) => (
                          <span
                            key={i}
                            className={`chip ${cls} absolute left-0`}
                            style={{ width: 20, height: 20, bottom: i * 3.5 }}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                  <div className="mt-1 seat-coin px-3.5 py-1 flex items-center gap-1.5">
                    <span className="chip inline-block" style={{ width: 13, height: 13 }} />
                    <span className="gold-text font-black text-base leading-none">
                      {pot.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* 座位 */}
              {seats.map((s, i) => {
                const theta = Math.PI / 2 + (i * 2 * Math.PI) / n;
                const x = 50 + 40 * Math.cos(theta);
                const y = 50 + 39 * Math.sin(theta);
                const isTurn = i === turn && !s.folded;
                return (
                  <div
                    key={s.id}
                    className="seat-box absolute flex flex-col items-center"
                    style={{
                      left: `${x}%`,
                      top: `${y}%`,
                      transform: "translate(-50%,-50%)",
                      opacity: s.folded ? 0.45 : 1,
                      filter: s.folded ? "grayscale(0.8)" : undefined,
                    }}
                  >
                    <div className="flex justify-center gap-[2px] mb-1 min-h-[34px]">
                      {s.cards.map((c, ci) => (
                        <PlayingCard
                          key={ci}
                          label={c}
                          hidden={s.hidden}
                          size={holeSize}
                          delay={ci * 60}
                        />
                      ))}
                    </div>
                    <div className="relative" style={{ width: 40, height: 40 }}>
                      <div
                        className={`seat-ring seat-avatar ${isTurn ? "seat-ring-active" : ""}`}
                        style={{ width: 40, height: 40 }}
                      >
                        <Avatar id={s.avatar} size={0} ring={false} fill />
                      </div>
                      {isTurn && (
                        <div
                          className="timer-ring"
                          style={{ ["--p" as string]: `${(tick / 30) * 100}%` }}
                        />
                      )}
                      {i === 1 && (
                        <span
                          className="dealer-btn absolute -top-0.5 -right-0.5"
                          style={{ width: 16, height: 16, fontSize: 9 }}
                        >
                          D
                        </span>
                      )}
                    </div>
                    <div className="seat-plate px-1.5 py-[2px] mt-1 w-full">
                      <div className="font-bold text-amber-50 truncate text-center leading-tight">
                        {s.id === 1 ? "★ " : ""}
                        {s.name}
                      </div>
                    </div>
                    <div className="seat-coin px-2 py-[1px] mt-[2px] flex items-center gap-1">
                      <span className="chip inline-block" style={{ width: 9, height: 9 }} />
                      <span className="text-[9px] gold-text font-black leading-none">
                        {s.points.toLocaleString()}
                      </span>
                    </div>
                    {s.bet > 0 ? (
                      <div className="mt-[2px] flex items-center gap-0.5 bg-black/70 rounded-full px-1.5 border border-amber-500/40">
                        <span className="chip inline-block" style={{ width: 7, height: 7 }} />
                        <span className="text-[8px] text-amber-200 font-bold">
                          {s.bet}
                        </span>
                      </div>
                    ) : s.folded ? (
                      <div className="mt-[2px] text-[8px] text-slate-300 bg-slate-700 px-1.5 rounded-full">
                        已弃牌
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 操作区 */}
      <div className="action-dock">
        <div className="max-w-4xl mx-auto px-3">
          <div className="flex items-center justify-center gap-2 mb-2 text-[11px] flex-wrap">
            <span className="hud-pill px-3 py-1">
              <span className="text-amber-200/60">我的筹码 </span>
              <b className="gold-text text-sm">12,800</b>
            </span>
            <span className="hud-pill px-3 py-1 text-amber-200/70">当前注 800</span>
            <span className="hud-pill px-3 py-1 text-amber-300 font-bold">
              ⏱ {30 - tick}s
            </span>
          </div>
          <div className="text-center mb-1.5">
            <span className="gold-text text-[11px] font-black tracking-widest animate-pulse">
              ◆ 轮 到 你 行 动 ◆
            </span>
          </div>
          <div className="act-row">
            {[
              { l: "弃牌", c: "act-red" },
              { l: "跟注 800", c: "act-blue" },
              { l: "加注", c: "act-orange" },
              { l: "All-in", c: "act-gold" },
            ].map((b) => (
              <button
                key={b.l}
                className={`act-round ${b.c} leading-tight`}
              >
                {b.l}
              </button>
            ))}
          </div>
          <div className="text-center mt-2">
            <AppLink href="/" className="text-[11px] text-amber-300/80 underline">
              这是画面演示 · 点此返回登录进入真实对局
            </AppLink>
          </div>
        </div>
      </div>
    </div>
  );
}

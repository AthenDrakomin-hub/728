"use client";

import { apiFetch } from "@/lib/api";
import { navigateLobby, navigateHome } from "@/lib/navigation";

import { useEffect, useState, useCallback, use, useRef } from "react";
import { useRouter } from "next/navigation";
import { AppLink } from "@/components/AppLink";
import { LEVELS, Level, limitText, chipsFor, capFor } from "@/lib/rooms";
import { AnimatedCard } from "@/components/AnimatedCard";
import { Avatar } from "@/components/Avatar";
import { RollingDiceFM } from "@/components/Dice";
import { ChipPicker } from "@/components/ChipPicker";
import { RoomChat, FloatItem } from "@/components/RoomChat";
import { enterImmersive, exitImmersive, isLandscape } from "@/lib/immersive";
import { joinRoom, leaveRoom as socketLeaveRoom, onRoomStateChanged, getSocket } from "@/lib/socket";
import { initGestureListener } from "@/lib/vibrate";
import {
  playDealCards, playDiceRoll, playChipBet, playChipStack, playFlipCard,
  playWin, playBigHand, playFold, playCall, playRaise,
  playAllIn, playCompare, playTurn, playGameStart, playLose,
  setSoundEnabled, isSoundEnabled,
  setVibrateEnabled, vibrateLight, vibrateMedium, vibrateHeavy, vibrateWin,
} from "@/lib/sounds";

interface PlayerRow {
  userId: number;
  account: string;
  avatar?: string;
  seat: number;
  points: number;
  isSpectator: boolean;
  ready: boolean;
}
interface HandSeat {
  userId: number;
  account: string;
  points: number;
  streetBet: number;
  totalBet: number;
  folded: boolean;
  allin: boolean;
  looked: boolean;
  diceRoll: number | null;
  cardCount: number;
  cards: string[] | null;
  handName: string | null;
}
interface HandResultPlayer {
  userId: number;
  account: string;
  cards: string[];
  handName: string;
  diceRoll: number | null;
  delta: number;
  gross: number;
  rake: number;
  mult: number;
  folded: boolean;
}
interface Hand {
  gameType: string;
  roundNo: number;
  phase: string;
  pot: number;
  currentBet: number;
  baseBet: number;
  community: string[];
  turnUserId: number | null;
  bankerUserId: number | null;
  finished: boolean;
  log: string[];
  result: { hands: HandResultPlayer[]; winnerUserId: number } | null;
  seats: HandSeat[];
}
interface Opt {
  action: string;
  label: string;
  amount?: number;
  min?: number;
  max?: number;
  chips?: number[];
}
interface RoundData {
  id: number;
  roundNo: number;
  result: { hands: HandResultPlayer[]; winnerUserId: number };
  rake: number;
  potBeforeRake: number;
}
interface RoomState {
  room: {
    id: number;
    roomNo: string;
    gameType: string;
    level: string;
    initialPoints: number;
    status: string;
    currentRound: number;
    totalRounds: number;
    maxSeats: number;
    totalRake: number;
    totalFlow: number;
    settled: boolean;
    agentId: number;
    password?: string;
  };
  players: PlayerRow[];
  rounds: RoundData[];
  me: {
    seat: number;
    points: number;
    isSpectator: boolean;
    ready: boolean;
  } | null;
  isAgent: boolean;
  isHost: boolean;
  role: string;
  userId: number;
  hand: Hand | null;
  options: Opt[];
}

const GAME_NAMES: Record<string, string> = {
  texas: "德州扑克",
  jinhua: "赢三张",
  sangong: "三公竞技",
  niuniu: "抢庄斗牛",
};
const PHASE_LABEL: Record<string, string> = {
  preflop: "翻牌前",
  flop: "翻牌圈",
  turn: "转牌圈",
  river: "河牌圈",
  betting: "下注中",
  grab: "掷骰抢庄",
  grab_result: "抢庄结果",
  dealt: "发牌完成",
  showdown: "亮牌结算",
};
const TURN_SECONDS = 30;

// 依据视口宽度决定牌面尺寸，保证小屏不溢出
function useCardSizes() {
  const [w, setW] = useState(390);
  useEffect(() => {
    const f = () => setW(window.innerWidth);
    f();
    window.addEventListener("resize", f);
    return () => window.removeEventListener("resize", f);
  }, []);
  return {
    board: (w < 360 ? "xs" : w < 480 ? "sm" : "md") as "xs" | "sm" | "md",
    hole: (w < 400 ? "xs" : "sm") as "xs" | "sm",
    narrow: w < 380,
  };
}

export default function RoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [state, setState] = useState<RoomState | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [showSettlement, setShowSettlement] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showEarlySettle, setShowEarlySettle] = useState(false);
  const [raiseOpen, setRaiseOpen] = useState<Opt | null>(null);
  const [compareOpen, setCompareOpen] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [dealing, setDealing] = useState(false);
  const [wsConnected, setWsConnected] = useState(false);
  const [immersive, setImmersive] = useState(false);
  const [immersiveMode, setImmersiveMode] = useState<"fullscreen" | "css-only" | "none">("none");
  const [soundOn, setSoundOn] = useState(true);
  const [vibrateOn, setVibrateOn] = useState(true);
  const sizes = useCardSizes();
  const [floats, setFloats] = useState<FloatItem[]>([]);
  const prevRound = useRef(0);
  const turnKey = useRef("");
  const prevPhase = useRef<string>("");
  const prevIsSpectator = useRef<boolean | null>(null);
  const [showBrokeNotice, setShowBrokeNotice] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await apiFetch(`/api/rooms/${id}`);
      if (res.status === 401) return navigateHome();
      let data: RoomState;
      try {
        data = await res.json();
      } catch {
        return;
      }
      if (!res.ok) return;
      setState(data);
      // 检测当前玩家是否从玩家转为观战（筹码不足）
      const me = data.players.find((p) => p.userId === data.userId);
      if (me && prevIsSpectator.current === false && me.isSpectator) {
        setShowBrokeNotice(true);
      }
      prevIsSpectator.current = me?.isSpectator ?? null;
      // 25局结束（waiting_continue）自动弹出总战绩，单局结束不弹窗
      if (data.room.status === "waiting_continue" && !showSettlement) {
        setShowSettlement(true);
      }
      prevRound.current = data.room.currentRound;
      // 重置计时
      const k = `${data.hand?.roundNo ?? 0}-${data.hand?.turnUserId ?? 0}-${
        data.hand?.phase ?? ""
      }`;
      if (k !== turnKey.current) {
        turnKey.current = k;
        setElapsed(0);
      }
      // 阶段变化音效
      const newPhase = data.hand?.phase ?? "";
      if (newPhase && newPhase !== prevPhase.current) {
        const oldPhase = prevPhase.current;
        prevPhase.current = newPhase;
        // 轮到当前玩家
        if (data.hand?.turnUserId === data.userId && !data.hand.finished) {
          setTimeout(playTurn, 300);
          setTimeout(vibrateMedium, 300);
        }
        if (newPhase === "grab") {
          setTimeout(playDiceRoll, 200);
        } else if (newPhase === "dealt" && oldPhase === "betting") {
          // 发牌完成，播放发牌音效
          setTimeout(() => playDealCards(3), 100);
          setTimeout(vibrateLight, 100);
        } else if (newPhase === "showdown" || data.hand?.finished) {
          // 结算：检测赢家和大牌型
          setTimeout(() => {
            const winners = data.hand?.result?.hands.filter((h: any) => h.delta > 0) ?? [];
            const hasBigHand = data.hand?.seats?.some((s: any) =>
              s.handName && ["皇家同花顺", "同花顺", "豹子", "牛牛", "炸弹牛", "五花牛", "三公", "混三公"].includes(s.handName)
            );
            if (hasBigHand) {
              playBigHand();
              vibrateHeavy();
            } else if (winners.length > 0) {
              playWin();
              vibrateWin();
              setShowConfetti(true);
              setTimeout(() => setShowConfetti(false), 3000);
            } else {
              playLose();
              vibrateLight();
            }
          }, 400);
        }
      } else if (!newPhase) {
        prevPhase.current = "";
      }
    } catch {
      // 网络错误静默忽略，下一轮询重试
    }
  }, [id, router]);

  useEffect(() => {
    const roomId = Number(id);
    let active = true;
    let pollTimer: NodeJS.Timeout | null = null;

    // 切换房间时重置状态，避免旧房间数据残留
    setState(null);
    setError("");
    setDealing(false);
    setShowConfetti(false);
    setShowSettlement(false);
    setShowMoreMenu(false);
    setCompareOpen(false);
    setRaiseOpen(null);
    setShowEarlySettle(false);
    setShowBrokeNotice(false);
    setShowRules(false);

    // WebSocket：加入房间并监听状态变更
    joinRoom(roomId);
    const offStateChanged = onRoomStateChanged(roomId, () => {
      if (active) load();
    });

    // 监听WebSocket连接状态
    const sock = getSocket();
    const onConnect = () => {
      if (active) {
        setWsConnected(true);
        // 连接成功立即刷新一次
        load();
      }
    };
    const onDisconnect = () => {
      if (active) setWsConnected(false);
    };
    sock.on("connect", onConnect);
    sock.on("disconnect", onDisconnect);
    if (sock.connected) setWsConnected(true);

    // 降级轮询：只在WebSocket未连接时每5秒轮询一次
    const startPolling = () => {
      if (pollTimer) clearTimeout(pollTimer);
      pollTimer = setTimeout(async () => {
        if (!active) return;
        if (sock.connected) {
          // 已连接，停止轮询
          return;
        }
        try {
          await load();
        } catch {
          // 轮询失败，退避后重试
        }
        startPolling();
      }, 5000);
    };

    // 初始加载
    load();
    // 如果初始未连接，启动轮询
    if (!sock.connected) {
      startPolling();
    }

    return () => {
      active = false;
      if (pollTimer) clearTimeout(pollTimer);
      sock.off("connect", onConnect);
      sock.off("disconnect", onDisconnect);
      offStateChanged();
      socketLeaveRoom(roomId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // 初始化手势监听，解决浏览器自动播放和vibrate限制
  useEffect(() => {
    initGestureListener();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // 荷官发牌特效：局号变化时触发1.2秒发牌动画
  const prevHandRound = useRef<number>(0);
  useEffect(() => {
    const roundNo = state?.hand?.roundNo ?? 0;
    if (roundNo > 0 && roundNo !== prevHandRound.current) {
      prevHandRound.current = roundNo;
      setDealing(true);
      const t = setTimeout(() => setDealing(false), 1200);
      return () => clearTimeout(t);
    }
    if (roundNo === 0) prevHandRound.current = 0;
  }, [state?.hand?.roundNo]);

  // 自动开始下一局：一局结束后，未到25局时延迟2秒自动开始（任何玩家端都可触发，后端有并发锁）
  const autoStartTimer = useRef<NodeJS.Timeout | null>(null);
  const tryingAutoStart = useRef(false);
  useEffect(() => {
    if (!state) return;
    const { room, hand } = state;
    const isFinished = hand?.finished === true;
    const canAutoStart =
      isFinished &&
      room.status !== "finished" &&
      room.status !== "waiting_continue" &&
      room.currentRound < 25;

    if (canAutoStart && !autoStartTimer.current && !tryingAutoStart.current) {
      tryingAutoStart.current = true;
      autoStartTimer.current = setTimeout(async () => {
        try {
          await startHand();
        } catch {
          // 开始失败，5秒后重试
          autoStartTimer.current = setTimeout(() => {
            tryingAutoStart.current = false;
            autoStartTimer.current = null;
          }, 5000);
          return;
        }
        tryingAutoStart.current = false;
        autoStartTimer.current = null;
      }, 5000);
    }
    if (!canAutoStart && autoStartTimer.current) {
      clearTimeout(autoStartTimer.current);
      autoStartTimer.current = null;
      tryingAutoStart.current = false;
    }
    return () => {
      if (autoStartTimer.current) {
        clearTimeout(autoStartTimer.current);
        autoStartTimer.current = null;
      }
      tryingAutoStart.current = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state?.hand?.finished, state?.room.currentRound, state?.room.status]);

  async function api(path: string, method: string, body?: unknown) {
    setError("");
    setBusy(true);
    try {
      const res = await apiFetch(`/api/rooms/${id}${path}`, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) setError(d.error || "操作失败");
      await load();
      return d;
    } finally {
      setBusy(false);
    }
  }

  const pushFloats = useCallback((items: FloatItem[]) => {
    setFloats((f) => [...f, ...items]);
    setTimeout(
      () =>
        setFloats((f) =>
          f.filter((x) => !items.some((i) => i.key === x.key))
        ),
      2600
    );
  }, []);

  const startHand = () => api("/hand", "POST");
  const joinGame = async () => {
    setBusy(true);
    setError("");
    try {
      const res = await apiFetch("/api/rooms/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomNo: room.roomNo, password: room.password || "", wantSpectate: false }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(d.error || "加入失败");
        return;
      }
      await load();
      // 加入游戏后自动准备（延迟等待state更新）
      setTimeout(() => api("/ready", "POST", {}), 500);
    } finally {
      setBusy(false);
    }
  };
  const toggleReady = () => {
    // 0筹码玩家不能准备，房主除外
    if (me && me.points <= 0 && !me.isSpectator && !state?.isHost) {
      setError("筹码为0，无法准备，请联系代理上分");
      return;
    }
    api("/ready", "POST", {});
  };

  const toggleImmersive = async () => {
    if (immersive) {
      await exitImmersive();
      setImmersive(false);
      setImmersiveMode("none");
    } else {
      const mode = await enterImmersive();
      setImmersive(true);
      setImmersiveMode(mode);
    }
  };

  // 监听全屏变化，用户手动退出全屏时同步状态
  useEffect(() => {
    const handler = () => {
      const isFs = !!(document.fullscreenElement || (document as any).webkitFullscreenElement);
      if (!isFs && immersive) {
        setImmersive(false);
        setImmersiveMode("none");
      }
    };
    document.addEventListener("fullscreenchange", handler);
    document.addEventListener("webkitfullscreenchange", handler);
    return () => {
      document.removeEventListener("fullscreenchange", handler);
      document.removeEventListener("webkitfullscreenchange", handler);
    };
  }, [immersive]);
  const doEarlySettle = () => api("/early-settle", "POST", {});
  const doContinue = () => api("/continue", "POST", {});
  const doKick = (targetUserId: number) => {
    if (confirm("确定踢出该玩家？剩余筹码将退回其钱包。")) {
      api("/kick", "POST", { targetUserId });
    }
  };
  const leaveRoom = () => {
    if (handActive) {
      if (!confirm("游戏进行中离开将带走剩余筹码，确定离开？")) return;
    } else {
      if (!confirm("确定离开房间？剩余筹码将退回钱包。")) return;
    }
    apiFetch(`/api/rooms/${id}/ready`, { method: "DELETE" })
      .then(() => navigateLobby())
      .catch(() => setError("离开失败，请重试"));
  };
  const act = (action: string, amount?: number) => {
    setRaiseOpen(null);
    // 行动音效
    const soundMap: Record<string, () => void> = {
      fold: playFold, check: playCall, call: playCall,
      bet: playChipBet, raise: playRaise, allin: playAllIn,
      look: playFlipCard, compare: playCompare, roll: playDiceRoll,
      confirm: playFlipCard, confirm_bet: playChipStack,
    };
    if (soundMap[action]) soundMap[action]();
    // 行动震动
    const vibrateMap: Record<string, () => void> = {
      fold: vibrateLight, check: vibrateLight, call: vibrateMedium,
      bet: vibrateMedium, raise: vibrateMedium, allin: vibrateHeavy,
      look: vibrateLight, compare: vibrateHeavy, roll: vibrateMedium,
      confirm: vibrateLight, confirm_bet: vibrateMedium,
    };
    if (vibrateMap[action]) vibrateMap[action]();
    // 行动飘字
    const actionLabels: Record<string, string> = {
      fold: "弃牌", check: "过牌", call: `跟注${amount ?? ""}`,
      bet: `下注${amount ?? ""}`, raise: `加注${amount ?? ""}`,
      allin: `ALL-IN ${amount ?? ""}`, look: "看牌",
      compare: "比牌", roll: "掷骰", confirm: "看牌",
      confirm_bet: "确认下注",
    };
    if (state && actionLabels[action]) {
      pushFloats([{
        key: `act-${Date.now()}-${action}`,
        userId: state.userId,
        targetUserId: null,
        content: actionLabels[action],
        kind: "action",
      }]);
    }
    if (!state || !hand) return api("/hand", "PUT", { action, amount });
    // 炸金花比牌：多个对手时先选对手
    if (action === "compare" && room.gameType === "jinhua") {
      const opponents = hand.seats.filter(
        (s) => !s.folded && s.userId !== state.userId
      );
      if (opponents.length > 1) {
        setCompareOpen(true);
        return;
      }
    }
    return api("/hand", "PUT", { action, amount });
  };

  if (!state)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="stage" />
        <div className="gold-title text-xl animate-pulse">进入牌桌…</div>
      </div>
    );

  const { room, players, rounds, me, hand, options } = state;
  const seated = players
    .filter((p) => !p.isSpectator)
    .sort((a, b) => a.seat - b.seat);
  const spectators = players.filter((p) => p.isSpectator);
  const isInRoom = seated.some((p) => p.userId === state.userId);
  const agentAvatar = players.find((p) => p.userId === room.agentId)?.avatar;
  const waitingContinue = room.status === "waiting_continue";
  const finished = room.status === "finished" || (room.settled && !waitingContinue);
  const myTurn = hand?.turnUserId === state.userId && options.length > 0;
  const handActive = !!hand && !hand.finished;
  const isPlayer = !!me && !me.isSpectator;
  const readyCount = seated.filter((p) => p.ready).length;
  const allReady = seated.length >= 2 && readyCount === seated.length;
  const remain = Math.max(0, TURN_SECONDS - elapsed);
  const isBankerGame = room.gameType === "sangong" || room.gameType === "niuniu";

  // 座位环绕排列：自己永远在正下方
  const myIdx = seated.findIndex((p) => p.userId === state.userId);
  const ordered =
    myIdx >= 0
      ? [...seated.slice(myIdx), ...seated.slice(0, myIdx)]
      : seated;
  const n = Math.max(ordered.length, 1);

  return (
    <div className="room-page min-h-screen flex flex-col relative">
      {/* 赢牌彩带庆祝 */}
      {showConfetti && (
        <div className="confetti-container">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="confetti-piece"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                backgroundColor: ["#ffd700", "#ff6b6b", "#4ecdc4", "#45b7d1", "#ff69b4", "#98d8c8"][i % 6],
                animationDuration: `${2 + Math.random() * 1.5}s`,
              }}
            />
          ))}
        </div>
      )}
      {/* 竖屏提示：沉浸式模式下竖屏时显示 */}
      {immersive && (
        <div className="rotate-hint">
          <div className="phone-icon">📱</div>
          <div className="hint-text">请旋转手机至横屏</div>
          <div className="hint-sub">横屏后自动进入沉浸式游戏体验</div>
          <button
            onClick={toggleImmersive}
            className="mt-4 px-6 py-2 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-200 text-sm font-bold"
          >
            退出沉浸模式
          </button>
        </div>
      )}

      {/* 沉浸式浮动退出按钮 */}
      {immersive && (
        <button
          onClick={toggleImmersive}
          className="immersive-exit"
        >
          ✕ 退出
        </button>
      )}

      {/* 沉浸式浮动信息条 */}
      {/* 沉浸式浮动信息条 */}
      {immersive && (
        <div className="immersive-info">
          <div className="flex items-center gap-2">
            <span className="text-amber-300 font-black">{GAME_NAMES[room.gameType]}</span>
            <span className="text-amber-200/50">|</span>
            <span>第{room.currentRound + 1}/{room.totalRounds}局</span>
            {hand && <><span className="text-amber-200/50">|</span><span>{PHASE_LABEL[hand.phase]}</span></>}
          </div>
          {hand && hand.pot > 0 && (
            <div className="text-[10px] text-amber-300/80 mt-0.5">底池 {hand.pot.toLocaleString()}</div>
          )}
        </div>
      )}

      {/* 沉浸式底部玩家筹码条 */}
      {immersive && me && (
        <div className="immersive-chips">
          <span className="text-amber-300 font-black text-sm">{me.points.toLocaleString()}</span>
          <span className="text-amber-200/50 text-[10px] ml-1">筹码</span>
        </div>
      )}

      <div className="stage" />

      {/* ===== 顶部 HUD ===== */}
      <div
        className="hud-top relative z-30 px-2 pt-2"
        style={{ paddingTop: "calc(var(--safe-t) + 0.5rem)" }}
      >
        <div className="max-w-5xl mx-auto flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => {
              if (isInRoom) {
                leaveRoom();
              } else {
                navigateLobby();
              }
            }}
            className="hud-pill px-2.5 py-1.5 text-[11px] gold-ink font-bold shrink-0"
            title="返回大厅"
          >
            ←
          </button>
          <div className="hud-pill px-2.5 py-1.5 text-[10px] text-amber-200 shrink-0">
            {GAME_NAMES[room.gameType]}
          </div>
          <div className="flex-1" />
          <div className="hud-pill px-2.5 py-1.5 text-[10px] shrink-0">
            <span className="text-amber-200/60">局数 </span>
            <span className="gold-text font-black">
              {room.currentRound}/{room.totalRounds}
            </span>
          </div>
          {hand && (
            <div className="hud-pill px-2.5 py-1.5 text-[10px] text-amber-200 shrink-0">
              {PHASE_LABEL[hand.phase]}
            </div>
          )}
          <button
            onClick={toggleImmersive}
            className={`hud-pill px-2.5 py-1.5 text-[10px] shrink-0 ${immersive ? "gold-text font-black" : "text-amber-200/70"}`}
            title={immersive ? "退出沉浸模式" : "横屏全屏沉浸模式"}
          >
            {immersive ? "🔲 退出" : "🎮 沉浸"}
          </button>
          <div className="relative shrink-0">
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className={`hud-pill px-2.5 py-1.5 text-[10px] ${showMoreMenu ? "gold-text font-black" : "text-amber-200/70"}`}
            >
              ⋯ 更多
            </button>
            {showMoreMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMoreMenu(false)} />
                <div className="absolute right-0 top-full mt-1 z-50 bg-[#1a1410]/95 border border-amber-500/30 rounded-xl p-2 min-w-[160px] shadow-2xl backdrop-blur-sm">
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      setShowInfo(true);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-amber-200 hover:bg-amber-500/10 flex items-center gap-2"
                  >
                    🏠 房间信息
                  </button>
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      setShowHistory(true);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-amber-200 hover:bg-amber-500/10 flex items-center gap-2"
                  >
                    📊 对局记录
                  </button>
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      setShowRules(true);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-amber-200 hover:bg-amber-500/10 flex items-center gap-2"
                  >
                    📖 游戏规则
                  </button>
                  {isInRoom && (
                    <button
                      onClick={() => {
                        setShowMoreMenu(false);
                        leaveRoom();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs text-red-300 hover:bg-red-500/10 flex items-center gap-2"
                    >
                      🚪 离开房间
                    </button>
                  )}
                  <div className="border-t border-amber-500/20 my-1" />
                  <button
                    onClick={() => {
                      const v = !soundOn;
                      setSoundOn(v);
                      setSoundEnabled(v);
                      if (v) playChipBet();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-amber-200 hover:bg-amber-500/10 flex items-center justify-between"
                  >
                    <span>{soundOn ? "🔊 音效开" : "🔇 音效关"}</span>
                    <span className="text-amber-400/60">{soundOn ? "✓" : ""}</span>
                  </button>
                  <button
                    onClick={() => {
                      const v = !vibrateOn;
                      setVibrateOn(v);
                      setVibrateEnabled(v);
                      if (v) vibrateMedium();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-amber-200 hover:bg-amber-500/10 flex items-center justify-between"
                  >
                    <span>{vibrateOn ? "📳 震动开" : "📴 震动关"}</span>
                    <span className="text-amber-400/60">{vibrateOn ? "✓" : ""}</span>
                  </button>
                  {state.isAgent && !finished && !waitingContinue && (
                    <button
                      onClick={() => {
                        setShowMoreMenu(false);
                        setShowEarlySettle(true);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs text-red-300 hover:bg-red-500/10 flex items-center gap-2 border-t border-amber-500/20 mt-1 pt-2"
                    >
                      ⚠️ 提前结算房间
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 错误提示条 */}
      {error && (
        <div className="mx-2 mt-1 bg-red-900/80 border border-red-500/50 rounded-lg px-3 py-2 text-xs text-red-100 text-center font-bold animate-pulse">
          ⚠️ {error}
        </div>
      )}

      {/* ===== 牌桌 ===== */}
      <div className="table-stage relative z-10 flex-1 flex items-center justify-center px-1 py-1 min-h-0">
        <div className="w-full max-w-3xl h-full flex items-center justify-center">
          <div
            className="table-oval table-wrap mx-auto w-full"
            style={{ aspectRatio: "1 / 1.15", maxHeight: "100%" }}
          >
            <div className={`table-felt table-felt-v2 table-felt-${room.gameType}`}>
              {/* 游戏阶段提示 */}
              {handActive && (
                <div className="phase-banner">
                  {room.gameType === "texas" ? (
                    hand?.phase === "preflop" ? "翻牌前" :
                    hand?.phase === "flop" ? "翻牌圈" :
                    hand?.phase === "turn" ? "转牌圈" :
                    hand?.phase === "river" ? "河牌圈" : "摊牌"
                  ) : hand?.phase === "grab" ? "抢庄" :
                    hand?.phase === "grab_result" ? "抢庄结果" :
                    hand?.phase === "betting" ? "下注" :
                    hand?.phase === "dealt" ? "开牌" : "结算"}
                </div>
              )}

              {/* 底池：移到phase-banner下面 */}
              {handActive && hand!.pot > 0 && (
                <div className="absolute top-10 left-1/2 -translate-x-1/2 pot-display !py-1 !px-3">
                  <span className="pot-label !text-[9px]">底池</span>
                  <span className="pot-amount !text-sm ml-1">{hand!.pot.toLocaleString()}</span>
                </div>
              )}

              {/* --- 中央区域 --- */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-6">

              {/* 全局倒计时 */}
              {handActive && hand?.turnUserId !== undefined && hand?.turnUserId !== null && hand?.turnUserId >= 0 && (
                <div className={`mb-2 px-4 py-1.5 rounded-full text-sm font-black flex items-center gap-1.5 ${
                  remain <= 5 ? "bg-red-600/90 text-white animate-pulse" : "bg-black/70 text-amber-300 border border-amber-500/50"
                }`}>
                  <span className="text-base">⏱</span>
                  <span className="text-lg">{remain}</span>
                  <span className="text-[10px] opacity-70">秒</span>
                </div>
              )}

              {/* 荷官发牌特效 */}
              {dealing && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="dealer-dealing w-14 h-20 rounded-lg bg-gradient-to-br from-red-800 to-red-950 border-2 border-amber-400/70 flex items-center justify-center shadow-2xl">
                    <span className="text-amber-300 text-2xl">♠</span>
                  </div>
                  <div className="absolute -bottom-8 text-[10px] text-amber-300 font-black tracking-widest animate-pulse">
                    荷官发牌中…
                  </div>
                </div>
              )}

              {/* ====== 德州扑克：公共牌 ====== */}
              {room.gameType === "texas" && (
                <>
                  <div className="board-row mb-2 flex gap-1.5">
                    {hand?.community.length
                      ? hand.community.map((c, i) => (
                          <AnimatedCard key={i} label={c} delay={i * 80} size={sizes.board} />
                        ))
                      : [0,1,2,3,4].map((i) => (
                          <div key={i} className="rounded-md border border-dashed border-amber-100/20"
                            style={{ width: sizes.board==="xs"?24:sizes.board==="sm"?32:44, height: sizes.board==="xs"?34:sizes.board==="sm"?45:62 }} />
                        ))}
                  </div>
                  {handActive && hand!.phase === "preflop" && (
                    <div className="flex gap-2 mt-1.5 text-[9px]">
                      <span className="px-2 py-0.5 rounded-full bg-blue-900/50 border border-blue-500/40 text-blue-200">小盲 {Math.max(1, Math.ceil(hand!.baseBet/2))}</span>
                      <span className="px-2 py-0.5 rounded-full bg-red-900/50 border border-red-500/40 text-red-200">大盲 {Math.max(1, Math.ceil(hand!.baseBet/2))*2}</span>
                    </div>
                  )}
                </>
              )}

              {/* ====== 非德州：金花/抢庄 ====== */}
              {room.gameType !== "texas" && hand && (
                <div className="mb-3 text-center w-full max-w-xs">
                  <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-amber-900/40 to-amber-700/30 border border-amber-500/30">
                    <span className="text-[11px] text-amber-200/80 tracking-[0.2em] font-bold">{GAME_NAMES[room.gameType]}</span>
                  </div>
                  {room.gameType === "jinhua" && hand?.phase === "betting" && !hand?.finished && (
                    <div className="mt-2 inline-block px-3 py-1 rounded-full bg-purple-900/40 border border-purple-500/40">
                      <span className="text-[10px] text-purple-200 font-bold">🃏 底注已下 · 闷牌/看牌/跟注/加注/比牌</span>
                    </div>
                  )}
                  {hand?.phase === "grab" && (
                    <div className="mt-2 flex flex-wrap justify-center gap-3">
                      {hand.seats.map((s) => (
                        <div key={s.userId} className="text-center">
                          <div className="text-[8px] text-amber-200/60 truncate max-w-[60px] mb-1">{s.account}</div>
                          <RollingDiceFM value={s.diceRoll} size={36} />
                        </div>
                      ))}
                    </div>
                  )}
                  {/* 抢庄结果展示：显示所有玩家点数和庄家 */}
                  {hand?.phase === "grab_result" && (
                    <div className="mt-2">
                      <div className="flex flex-wrap justify-center gap-3 mb-2">
                        {hand.seats.map((s) => {
                          const isBanker = hand.bankerUserId === s.userId;
                          const maxRoll = Math.max(...hand.seats.map(x => x.diceRoll ?? 0));
                          return (
                            <div key={s.userId} className={`text-center px-2 py-1 rounded-lg ${isBanker ? 'bg-amber-500/20 ring-1 ring-amber-400 winner-glow' : ''}`}>
                              <div className={`text-[9px] truncate max-w-[60px] mb-1 font-bold ${isBanker ? 'text-amber-300' : 'text-amber-200/60'}`}>
                                {isBanker && '👑 '}{s.account}
                              </div>
                              <RollingDiceFM value={s.diceRoll} size={36} />
                              <div className={`text-[10px] font-black mt-1 ${isBanker ? 'gold-text' : 'text-amber-200/70'}`}>
                                {s.diceRoll}点{s.diceRoll === maxRoll ? ' 🏆' : ''}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="text-center text-[11px] text-amber-300 font-black animate-pulse">
                        👑 {hand.seats.find(s => s.userId === hand.bankerUserId)?.account} 成为庄家，即将进入下注…
                      </div>
                    </div>
                  )}
                  {hand?.phase === "betting" && (
                    <div className="mt-2 w-full">
                      <div className="text-center mb-2">
                        <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-amber-900/60 to-amber-700/40 border border-amber-500/50">
                          <span className="text-[11px] text-amber-300 font-black">👑 庄家：{hand.seats.find(s => s.userId === hand.bankerUserId)?.account}</span>
                        </span>
                      </div>
                      <div className="text-[10px] text-amber-300/80 font-black text-center mb-2 tracking-wider">💰 下注阶段 · 点筹码累加，确认后下一位</div>
                      <div className="betting-area flex justify-center gap-3 flex-wrap">
                        {hand.seats.filter(s => s.totalBet > 0).map((s) => (
                          <div key={s.userId} className="flex flex-col items-center">
                            <div className="text-[8px] text-amber-200/60 truncate max-w-[50px] mb-1 font-bold">{s.account}</div>
                            <div className="flex items-end gap-[2px] h-7">
                              {Array.from({ length: Math.min(Math.ceil(s.totalBet/50), 5) }).map((_, i) => (
                                <span key={i} className={`chip betting-chip ${s.totalBet>=500?"chip-blue":s.totalBet>=100?"chip-green":""}`}
                                  style={{ width:16, height:16, bottom:i*3, animationDelay:`${i*60}ms` }} />
                              ))}
                            </div>
                            <div className="text-[9px] gold-text font-black mt-1">{s.totalBet}</div>
                          </div>
                        ))}
                      </div>
                      {me && (
                        <div className="text-center text-[10px] text-amber-200/60 mt-2 flex justify-center gap-3">
                          <span>筹码：<b className="gold-text">{me.points}</b></span>
                          {(() => {
                            const mySeat = hand.seats.find(s => s.userId === state.userId);
                            return mySeat?.totalBet ? <span>已下注：<b className="text-amber-300">{mySeat.totalBet}</b></span> : null;
                          })()}
                        </div>
                      )}
                    </div>
                  )}
                  {/* 开牌阶段 */}
                  {hand?.phase === "dealt" && (
                    <div className="mt-2 text-center">
                      <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-amber-900/60 to-amber-700/40 border border-amber-500/50">
                        <span className="text-[11px] text-amber-300 font-black">
                          👑 {hand.seats.find((s) => s.userId === hand.bankerUserId)?.account} 为庄家
                        </span>
                      </div>
                      {(() => {
                        const meSeat = hand.seats.find((s) => s.userId === state.userId);
                        if (meSeat?.handName) {
                          const isBig = ["牛牛","炸弹牛","五花牛","五小牛","三公","混三公"].includes(meSeat.handName);
                          return (
                            <div className={`mt-2 ${isBig ? 'text-2xl font-black gold-text winner-glow animate-pulse' : 'text-base font-bold text-amber-200'}`}>
                              {isBig && '🎉 '}你的牌型：{meSeat.handName}
                            </div>
                          );
                        }
                        return null;
                      })()}
                      <div className="text-[10px] text-amber-200/50 mt-1.5">请点击下方「开牌」亮牌结算</div>
                    </div>
                  )}
                  {/* 结算结果 */}
                  {hand?.finished && hand.result && (
                    <div className="mt-1 space-y-1">
                      {hand.bankerUserId !== null && (
                        <div className="text-[10px] text-amber-300 font-black banker-glow text-center">
                          👑 庄家：{hand.seats.find((s) => s.userId === hand.bankerUserId)?.account}
                        </div>
                      )}
                      {(() => {
                        const winners = hand.result.hands.filter((h: any) => h.delta > 0);
                        if (winners.length === 1) {
                          const w = hand.seats.find((s) => s.userId === winners[0].userId);
                          return (
                            <div className="text-center py-1">
                              <span className="text-base font-black gold-text winner-glow animate-pulse">
                                🏆 {w?.account} 赢 +{winners[0].delta}
                              </span>
                            </div>
                          );
                        }
                        return null;
                      })()}
                      <div className="flex flex-wrap justify-center gap-1.5 mt-1">
                        {hand.result?.hands.map((h, hi) => {
                          const hs = hand.seats.find((s) => s.userId === h.userId);
                          const isWinner = h.delta > 0;
                          const deltaSign = h.delta > 0 ? "+" : "";
                          const isBigHand = hs?.handName && ["皇家同花顺","同花顺","豹子","牛牛","炸弹牛","五花牛","五小牛","三公","混三公","四条","葫芦","金花","顺子"].includes(hs.handName);
                          return (
                            <div key={h.userId} className={`text-center px-2 py-1 rounded-lg ${isWinner ? 'winner-glow bg-green-900/70 ring-1 ring-green-400/50' : h.delta < 0 ? 'bg-red-900/40' : 'bg-black/40'}`}
                              style={{ animationDelay: `${hi * 120}ms` }}>
                              <div className="text-[10px] text-amber-200/80 flex items-center justify-center gap-0.5 font-bold">
                                {isWinner && <span className="winner-crown">👑</span>}{h.account}
                              </div>
                              {hs?.handName ? (
                                <div className={`text-xs font-black mt-1 flex items-center justify-center gap-1 ${isBigHand ? 'hand-name-burst text-amber-300' : 'text-amber-100'}`}
                                  style={{ animationDelay: `${hi * 120 + 200}ms` }}>
                                  <span>{hs.handName}</span>
                                  {isWinner && h.mult > 1 && <span className="text-[9px] text-amber-400 bg-amber-900/50 px-1 rounded">×{h.mult}</span>}
                                </div>
                              ) : hs?.diceRoll != null && (
                                <div className="flex items-center justify-center gap-0.5 mt-1"><DiceDot value={hs.diceRoll!} size={14} /></div>
                              )}
                              {isWinner && h.rake > 0 && (
                                <div className="text-[8px] text-amber-200/50 mt-0.5">
                                  赢{h.gross} - 房费{h.rake}
                                </div>
                              )}
                              <div className={`text-sm font-black mt-0.5 ${h.delta > 0 ? 'text-green-400' : h.delta < 0 ? 'text-red-400' : 'text-amber-200/60'}`}>
                                {deltaSign}{h.delta}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 等待开始 / 已结束 */}
              {!hand && !finished && (
                <div className="text-center flex flex-col items-center px-4">
                  {/* 游戏类型徽章 */}
                  <div className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-amber-900/50 to-amber-700/30 border border-amber-500/40 mb-3">
                    <span className="text-xs text-amber-200/90 tracking-[0.15em] font-bold">{GAME_NAMES[room.gameType]}</span>
                  </div>
                  {/* 房号 */}
                  <div className="text-2xl font-black text-amber-100 tracking-wider mb-1">
                    房号 <span className="gold-text">{room.roomNo}</span>
                  </div>
                  {/* 房间配置 */}
                  <div className="flex items-center gap-2 text-[10px] text-amber-200/50 mb-4">
                    <span className="px-2 py-0.5 rounded bg-black/30">{LEVELS[room.level as Level]?.name ?? "-"}</span>
                    <span>·</span>
                    <span>上限 {room.initialPoints}</span>
                    <span>·</span>
                    <span>{room.totalRounds}局</span>
                  </div>
                  {/* 玩家准备状态 */}
                  {seated.length > 0 && (
                    <div className="flex items-center justify-center gap-3 mb-3 flex-wrap">
                      {seated.map((p) => (
                        <div key={p.userId} className="flex flex-col items-center">
                          <div className={`relative ${p.ready ? "ring-2 ring-green-400 rounded-full" : "ring-2 ring-slate-500/50 rounded-full"}`}>
                            <Avatar id={p.avatar || "1"} size={36} />
                            {p.ready && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-[8px] text-white font-bold">✓</div>
                            )}
                          </div>
                          <span className="text-[9px] text-amber-200/60 mt-1 max-w-[50px] truncate">{p.account}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* 状态提示 */}
                  <div className="text-[11px] text-amber-200/50">
                    {seated.length < 2
                      ? `等待玩家加入（${seated.length}/${room.maxSeats}）`
                      : allReady
                      ? "✓ 全部已准备，等待房主开始"
                      : `已准备 ${readyCount}/${seated.length} 人`}
                  </div>
                </div>
              )}
              {finished && (
                <div className="text-center"><div className="gold-title text-lg font-black">🏁 本房已结束</div></div>
              )}

            </div> {/* --- 中央区域结束 --- */}

            {/* --- 座位（沿椭圆边缘分布，在桌布边线上） --- */}
            {ordered.map((p, i) => {
              const theta = (Math.PI / 2) + (i * 2 * Math.PI) / n;
              const rx = immersive ? 48 : 46;
              const ry = immersive ? 29 : 38;
              const x = 50 + rx * Math.cos(theta);
              const y = 50 + ry * Math.sin(theta);
              const hs = hand?.seats.find((s) => s.userId === p.userId);
              const isTurn = hand?.turnUserId === p.userId;
              const isMe = state.userId === p.userId;
              const isWinner = hand?.finished && hand.result?.winnerUserId === p.userId;
              const isBanker = hand?.bankerUserId === p.userId;
              return (
                <Seat
                  key={p.userId}
                  x={x}
                  y={y}
                  player={p}
                  hs={hs}
                  isTurn={isTurn}
                  isMe={isMe}
                  isWinner={!!isWinner}
                  isBanker={isBanker}
                  isHost={p.userId === room.agentId}
                  showReady={!handActive && !finished}
                  handActive={handActive}
                  progress={isTurn ? elapsed / TURN_SECONDS : 0}
                  remain={isTurn ? Math.max(0, TURN_SECONDS - elapsed) : 0}
                  isAgentViewer={state.isHost}
                  roomId={room.id}
                  onGift={load}
                  canGift={state.isHost && !finished && !waitingContinue}
                  canKick={state.isHost && !finished && !waitingContinue && !p.isSpectator && p.userId !== room.agentId}
                  onKick={doKick}
                  holeSize={sizes.hole}
                  gameType={room.gameType}
                  floats={floats.filter(
                    (f) =>
                      f.userId === p.userId ||
                      f.targetUserId === p.userId
                  )}
                />
              );
            })}
          </div>
        </div>

        {/* 观众条 */}
        {spectators.length > 0 && (
          <div className="spectator-bar max-w-4xl mx-auto mt-2 flex items-center gap-1.5 flex-wrap justify-center">
            <span className="text-[10px] text-amber-200/50">👁 观众</span>
            {spectators.map((p) => (
              <span
                key={p.userId}
                className="hud-pill px-2 py-0.5 text-[10px] text-amber-100"
              >
                {p.userId === room.agentId ? "🎩 " : ""}
                {p.account}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>

      {/* ===== 底部操作区 ===== */}
      <div className="action-dock">
        <div className="max-w-4xl mx-auto px-3">
          {/* 我的信息条 */}
          {isPlayer && (
            <div className="flex items-center justify-center gap-2 mb-2.5 text-[11px] flex-wrap">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-900/40 to-amber-800/20 border border-amber-500/30">
                <span className="text-amber-200/60">💰 座位筹码</span>
                <b className="gold-text text-sm">
                  {(
                    hand?.seats.find((s) => s.userId === state.userId)?.points ??
                    me.points
                  ).toLocaleString()}
                </b>
              </div>
              {handActive && hand!.currentBet > 0 && (
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-900/30 border border-red-500/30">
                  <span className="text-red-200/70">
                    {room.gameType === "jinhua" && !hand?.seats.find((s) => s.userId === state.userId)?.looked
                      ? `闷跟 ${Math.max(1, Math.round(hand!.currentBet * 0.5))}`
                      : `当前注 ${hand!.currentBet}`}
                  </span>
                </div>
              )}
              {myTurn && (
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/50 animate-pulse">
                  <span className="text-amber-300 font-bold">⏱ {remain}s</span>
                </div>
              )}
            </div>
          )}

          {waitingContinue ? (
            <div className="mb-1">
              <div className="hud-pill py-2 text-center text-xs text-amber-200/70 mb-2">
                🏁 本轮 {room.totalRounds} 局已结束，流水 {room.totalFlow.toLocaleString()}
              </div>
              {state.isHost ? (
                <button
                  onClick={doContinue}
                  disabled={busy}
                  className="gold-btn w-full py-3.5 rounded-xl text-base mb-1"
                >
                  🔄 续开房间（玩家无需重新加入）
                </button>
              ) : (
                <div className="hud-pill py-3 text-center text-sm text-amber-200/60 mb-1">
                  ⏳ 等待房主续开房间…
                </div>
              )}
              <button
                onClick={() => setShowSettlement(true)}
                className="w-full py-2.5 rounded-xl text-xs bg-amber-900/40 border border-amber-500/40 text-amber-100"
              >
                📊 查看本轮战绩
              </button>
            </div>
          ) : finished ? (
            <button
              onClick={() => setShowSettlement(true)}
              className="gold-btn w-full py-3.5 rounded-xl text-base mb-1"
            >
              📊 查看总局战绩
            </button>
          ) : (
            <>
              {raiseOpen ? (
                <ChipPicker
                  chips={raiseOpen.chips ?? [10, 50, 100]}
                  min={raiseOpen.min ?? 0}
                  max={raiseOpen.max ?? 0}
                  busy={busy}
                  title={raiseOpen.action === "roll" ? "掷骰子抢庄" : "选择加注筹码"}
                  confirmLabel={raiseOpen.action === "roll" ? "确认掷骰" : "确认加注"}
                  onCancel={() => setRaiseOpen(null)}
                  onConfirm={(amt) => act(raiseOpen.action, amt)}
                />
              ) : compareOpen ? (
                <div className="hud-panel p-3 rounded-xl">
                  <div className="text-center text-amber-200 font-bold text-sm mb-2">⚔ 选择比牌对手</div>
                  <div className="space-y-1.5">
                    {hand?.seats
                      .filter((s) => !s.folded && s.userId !== state.userId)
                      .map((s) => (
                        <button
                          key={s.userId}
                          disabled={busy}
                          onClick={() => {
                            setCompareOpen(false);
                            api("/hand", "PUT", { action: "compare", amount: s.userId });
                          }}
                          className="w-full py-2.5 rounded-lg bg-amber-900/40 border border-amber-500/40 text-amber-100 text-sm font-bold hover:bg-amber-800/50 active:scale-95 transition"
                        >
                          {s.account}（{s.looked ? "看牌" : "闷牌"}）
                        </button>
                      ))}
                  </div>
                  <button
                    onClick={() => setCompareOpen(false)}
                    className="w-full mt-2 py-2 text-xs text-amber-200/60"
                  >
                    取消
                  </button>
                </div>
              ) : myTurn ? (
                <ActionBar
                  options={options}
                  busy={busy}
                  onAct={act}
                  onRaise={(o) => setRaiseOpen(o)}
                />
              ) : handActive ? (
                <div className="hud-pill py-3 text-center text-xs text-amber-200/70 mb-1">
                  {hand?.phase === "dealt"
                    ? `⏳ 玩家依次点击「开牌」亮牌结算…`
                    : (
                      <>
                        ⏳ 等待 <b className="text-amber-100">
                          {hand?.seats.find((s) => s.userId === hand.turnUserId)?.account ?? "其他玩家"}
                        </b> 行动…
                      </>
                    )}
                </div>
              ) : isPlayer ? (
                <div className="mb-1">
                  {/* 第一局需要准备；之后的局自动开始，不显示准备按钮 */}
                  {room.currentRound === 0 ? (
                    <>
                      {/* 准备按钮 - 主操作 */}
                      <button
                        onClick={toggleReady}
                        disabled={busy}
                        className={`w-full py-4 rounded-2xl text-base font-black transition-all active:scale-[0.98] ${
                          me.ready
                            ? "bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-900/50"
                            : "gold-btn shadow-lg shadow-amber-900/30"
                        }`}
                      >
                        {me.ready ? "✓  已 准 备" : "我 准 备 好 了"}
                      </button>

                      {/* 房主开始游戏按钮 - 仪式感 */}
                      {state.isHost && (
                        <button
                          onClick={startHand}
                          disabled={busy || !allReady || seated.length < 2}
                          className={`w-full py-3.5 rounded-2xl text-sm font-bold mt-2.5 transition-all ${
                            allReady && seated.length >= 2 && !busy
                              ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-black shadow-lg shadow-amber-500/40 animate-pulse"
                              : "bg-slate-800/80 text-slate-400 cursor-not-allowed"
                          }`}
                        >
                          {busy
                            ? "🎴 发牌中…"
                            : seated.length < 2
                            ? `等待玩家（${seated.length}/2）`
                            : !allReady
                            ? `等待准备（${readyCount}/${seated.length}）`
                            : "▶  开 始 游 戏"}
                        </button>
                      )}

                      {/* 状态提示 */}
                      <div className="text-center text-[11px] text-amber-200/45 mt-2">
                        {seated.length < 2
                          ? "至少需要 2 名玩家"
                          : allReady
                          ? state.isHost
                            ? "点击上方按钮开始游戏"
                            : "等待房主开始游戏…"
                          : `等待其他玩家准备（${readyCount}/${seated.length}）`}
                      </div>

                      {/* 次要操作 - 一行小按钮 */}
                      <div className="flex gap-2 mt-2.5">
                        <button
                          onClick={() => api("/spectate", "POST")}
                          disabled={busy || handActive}
                          className="flex-1 py-2 rounded-xl text-[11px] text-amber-200/60 hover:text-amber-200 border border-amber-500/20 hover:border-amber-500/40 transition"
                        >
                          👁 切换观战
                        </button>
                        <button
                          onClick={leaveRoom}
                          className="flex-1 py-2 rounded-xl text-[11px] text-red-300/70 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 transition"
                        >
                          🚪 离开房间
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <div className="gold-text text-sm font-black animate-pulse">
                        🎴 发牌中…
                      </div>
                      {state.isHost && (
                        <button
                          onClick={startHand}
                          disabled={busy}
                          className="gold-btn w-full py-2.5 rounded-xl text-xs mt-2"
                        >
                          {busy ? "发牌中…" : "▶ 立即开始"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="mb-1">
                  {state.isHost && (
                    <button
                      onClick={startHand}
                      disabled={busy || (room.currentRound === 0 && !allReady)}
                      className={`w-full py-3.5 rounded-2xl text-base font-black transition-all ${
                        allReady && seated.length >= 2 && !busy && room.currentRound === 0
                          ? "bg-gradient-to-r from-amber-500 to-yellow-600 text-black shadow-lg shadow-amber-500/40 animate-pulse"
                          : "gold-btn"
                      }`}
                    >
                      {busy
                        ? "🎴 发牌中…"
                        : seated.length < 2
                        ? `等待玩家（${seated.length}/2）`
                        : room.currentRound === 0 && !allReady
                        ? `等待准备（${readyCount}/${seated.length}）`
                        : "▶  开 始 游 戏"}
                    </button>
                  )}
                  {state.isAgent && !finished && !waitingContinue && (
                    <button
                      onClick={() => setShowEarlySettle(true)}
                      className="w-full py-2.5 rounded-xl text-xs mt-2.5 bg-red-900/40 border border-red-500/40 text-red-200 font-bold hover:bg-red-900/60 transition"
                    >
                      ⚠️ 提前结算房间
                    </button>
                  )}
                  {!handActive && !finished && seated.length < room.maxSeats && state.role !== "admin" && state.role !== "customer_service" && !isInRoom && (
                    <button
                      onClick={joinGame}
                      disabled={busy}
                      className="gold-btn w-full py-3.5 rounded-2xl text-sm font-bold mt-2.5 shadow-lg shadow-amber-900/30"
                    >
                      {busy ? "加入中…" : `🎮 加入游戏（上限 ${room.initialPoints} 筹码）`}
                    </button>
                  )}
                  <div className="flex items-center justify-center gap-1.5 py-2.5 mt-2 rounded-xl bg-black/30 border border-amber-500/20">
                    <span className="text-base">👁</span>
                    <span className="text-[11px] text-amber-200/65">
                    {state.role === "admin"
                      ? "👨‍💼 管理员观战 · 后台管理账号"
                      : isInRoom
                      ? "🪑 已入座 · 游戏中"
                      : state.isHost
                      ? "🎩 房主观战 · 全程不可见任何底牌"
                      : "👁 观战中 · 不可见底牌"}
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <RoomChat
        roomId={room.id}
        meId={state.userId}
        players={players.map((p) => ({
          userId: p.userId,
          account: p.account,
        }))}
        onFloat={pushFloats}
      />

      {showInfo && (
        <InfoModal state={state} onClose={() => setShowInfo(false)} />
      )}
      {showSettlement && (
        <SettlementModal state={state} onClose={() => setShowSettlement(false)} />
      )}
      {showBrokeNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-gradient-to-b from-[#1a1410] to-[#0d0a08] rounded-2xl p-6 max-w-sm w-full border border-amber-500/30 shadow-2xl">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">💸</div>
              <div className="text-lg font-black text-amber-300 mb-1">筹码已用完</div>
              <div className="text-xs text-amber-200/60">您的筹码已用完，已转为观战</div>
            </div>
            <div className="text-sm text-amber-100/80 text-center mb-5 leading-relaxed">
              请联系您的代理上分，或充值后重新加入游戏。
            </div>
            <button
              onClick={() => setShowBrokeNotice(false)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black text-sm hover:from-amber-400 hover:to-amber-500 transition-all"
            >
              我知道了
            </button>
          </div>
        </div>
      )}
      {showEarlySettle && (
        <EarlySettleModal
          room={state.room}
          players={state.players.filter((p) => !p.isSpectator)}
          hand={state.hand}
          onConfirm={async () => {
            await doEarlySettle();
            setShowEarlySettle(false);
            await load();
          }}
          onClose={() => setShowEarlySettle(false)}
        />
      )}
      {showRules && (
        <RulesModal gameType={room.gameType} onClose={() => setShowRules(false)} />
      )}
      {showHistory && (
        <HistoryModal state={state} onClose={() => setShowHistory(false)} />
      )}
    </div>
  );
}

/* ================= 座位 ================= */
function Seat({
  x,
  y,
  player,
  hs,
  isTurn,
  isMe,
  isWinner,
  isBanker,
  isHost,
  showReady,
  handActive,
  progress,
  remain,
  roomId,
  onGift,
  canGift,
  canKick,
  onKick,
  holeSize,
  gameType,
  floats,
}: {
  x: number;
  y: number;
  player: PlayerRow;
  hs?: HandSeat;
  isTurn: boolean;
  isMe: boolean;
  isWinner: boolean;
  isBanker: boolean;
  isHost: boolean;
  showReady: boolean;
  handActive: boolean;
  progress: number;
  remain: number;
  isAgentViewer: boolean;
  roomId: number;
  onGift: () => void;
  canGift: boolean;
  canKick: boolean;
  onKick: (userId: number) => void;
  holeSize: "xs" | "sm";
  gameType: string;
  floats: FloatItem[];
}) {
  const folded = hs?.folded;
  // 荷官发牌方向：从牌桌中央(50,50)飞向座位，计算反向偏移
  const dealX = `${(50 - x) * 0.7}px`;
  const dealY = `${(50 - y) * 0.7}px`;
  return (
    <div
      className="seat-box absolute flex flex-col items-center"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%,-50%)",
        opacity: folded ? 0.45 : 1,
        filter: folded ? "grayscale(0.8)" : undefined,
        ["--deal-x" as string]: dealX,
        ["--deal-y" as string]: dealY,
      }}
    >
      {/* 聊天气泡 / 互动表情 */}
      {floats.length > 0 && (
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center gap-0.5">
          {floats.slice(-2).map((f) => (
            <span
              key={f.key}
              className={
                f.kind === "action"
                  ? "action-float text-amber-300 text-xs font-black"
                  : f.kind === "emoji" || f.kind === "interact"
                  ? "text-2xl float-up"
                  : "chat-bubble"
              }
            >
              {f.content}
            </span>
          ))}
        </div>
      )}

      {/* 手牌 */}
      {hs && (
        <div className="flex flex-col items-center">
          <div className={`flex justify-center gap-[2px] mb-1 min-h-[34px] ${isTurn && isMe ? "my-turn-hand" : ""} ${hs.folded ? "folded-hand" : ""}`}>
            {Array.from({ length: hs.cardCount }).map((_, i) => (
              <div key={`${hs.cards ? hs.cards.join('') : 'hidden'}-${i}`} className={hs.cards && handActive === false ? "card-flip" : ""} style={{ animationDelay: `${i * 100}ms` }}>
                <AnimatedCard
                  label={hs.cards ? hs.cards[i] : ""}
                  hidden={!hs.cards}
                  size={holeSize}
                  delay={i * 60}
                  highlight={isWinner && !!hs.cards}
                />
              </div>
            ))}
          </div>
          {/* 炸金花：闷牌/看牌状态 */}
          {gameType === "jinhua" && handActive && !hs.folded && (
            <span
              className={`text-[8px] px-1.5 rounded-full font-black -mt-0.5 ${
                hs.looked
                  ? "bg-blue-900/60 text-blue-200 border border-blue-500/40"
                  : "bg-purple-900/60 text-purple-200 border border-purple-500/40"
              }`}
            >
              {hs.looked ? "看牌" : "闷牌"}
            </span>
          )}
        </div>
      )}

      {/* 头像 */}
      <div className="relative" style={{ width: 40, height: 40 }}>
        <div
          className={`seat-ring seat-avatar ${isTurn ? "seat-ring-active" : ""}`}
          style={{ width: 40, height: 40 }}
        >
          <Avatar id={player.avatar || "1"} size={0} ring={false} fill />
        </div>
        {isTurn && (
          <div
            className="timer-ring"
            style={{ ["--p" as string]: `${Math.min(100, progress * 100)}%` }}
          />
        )}
        {/* 玩家倒计时：当前行动玩家旁显示剩余秒数 */}
        {isTurn && handActive && (
          <div
            className={`absolute -right-1 -bottom-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
              remain <= 5 ? "bg-red-600 text-white animate-pulse" : "bg-amber-500 text-black"
            }`}
          >
            {remain}
          </div>
        )}
        {/* 思考中气泡：对手回合时显示 */}
        {isTurn && !isMe && handActive && (
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 thinking-dots">
            <span>.</span><span>.</span><span>.</span>
          </div>
        )}
        {isBanker && (
          <span
            className="dealer-btn absolute -top-0.5 -right-0.5"
            style={{ width: 16, height: 16, fontSize: 9 }}
          >
            D
          </span>
        )}
        {isWinner && (
          <>
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-base winner-crown z-10">👑</span>
            <div className="absolute inset-0 rounded-full winner-glow pointer-events-none" />
          </>
        )}
        {hs?.allin && (
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] bg-red-700 px-1.5 rounded-full font-black">
            ALL IN
          </span>
        )}
      </div>

      {/* 名牌 */}
      <div className="seat-plate px-1.5 py-[2px] mt-1 w-full">
        <div className="font-bold text-amber-50 truncate text-center leading-tight flex items-center justify-center gap-0.5 text-[11px]">
          {isHost && <span title="房主">👑</span>}
          {isMe ? "★ " : ""}
          {player.account}
        </div>
      </div>

      {/* 金额 */}
      <div className="seat-coin px-2 py-[1px] mt-[2px] flex items-center gap-1">
        <span className="chip inline-block" style={{ width: 9, height: 9 }} />
        <span className="text-[9px] gold-text font-black leading-none">
          {(hs?.points ?? player.points).toLocaleString()}
        </span>
      </div>

      {/* 状态 / 下注 */}
      {hs?.streetBet ? (
        <div className="mt-[2px] flex items-center gap-0.5 bg-black/70 rounded-full px-1.5 border border-amber-500/40">
          <span className="chip inline-block" style={{ width: 7, height: 7 }} />
          <span className="text-[8px] text-amber-200 font-bold">
            {hs.streetBet}
          </span>
        </div>
      ) : hs?.diceRoll != null && handActive ? (
        <div className="mt-[2px] flex items-center gap-0.5">
          <DiceDot value={hs.diceRoll} size={14} />
        </div>
      ) : hs?.handName ? (
        <div className="mt-[2px] text-[8px] text-amber-200/85 bg-black/60 px-1.5 rounded-full">
          {hs.handName}
        </div>
      ) : showReady ? (
        <div
          className={`mt-[2px] text-[8px] px-1.5 rounded-full font-bold ${
            player.ready ? "bg-green-600 text-white" : "bg-slate-700 text-slate-300"
          }`}
        >
          {player.ready ? "已准备" : "未准备"}
        </div>
      ) : null}

      {canGift && (
        <GiftButton roomId={roomId} targetUserId={player.userId} onGift={onGift} />
      )}
      {canKick && (
        <button
          onClick={() => onKick(player.userId)}
          className="mt-1 text-[9px] px-1.5 py-0.5 rounded bg-red-900/60 border border-red-500/40 text-red-200 hover:bg-red-800/70"
          title="踢出玩家"
        >
          🚪 踢出
        </button>
      )}
    </div>
  );
}

/* ================= 操作按钮 ================= */
function ActionBar({
  options,
  busy,
  onAct,
  onRaise,
}: {
  options: Opt[];
  busy: boolean;
  onAct: (a: string, amt?: number) => void;
  onRaise: (o: Opt) => void;
}) {
  const btnClass = (a: string) =>
    a === "fold"
      ? "btn-fold"
      : a === "call"
      ? "btn-call"
      : a === "check"
      ? "btn-check"
      : a === "raise" || a === "bet"
      ? "btn-raise"
      : a === "allin"
      ? "btn-allin"
      : a === "compare"
      ? "btn-check"
      : "btn-raise";

  // 抢庄 / 下注倍数：横向排列
  const isMulti = options.every(
    (o) => o.action === "grab" || o.action === "bet"
  );

  return (
    <div className="mb-1">
      <div className="text-center mb-2">
        <span className="inline-block px-4 py-1 rounded-full bg-gradient-to-r from-amber-900/60 to-amber-700/40 border border-amber-500/40 text-amber-300 text-[11px] font-black tracking-widest animate-pulse">
          ◆ 轮 到 你 行 动 ◆
        </span>
      </div>
      <div className={`flex justify-center items-center gap-3 ${isMulti ? "flex-wrap" : ""}`}>
        {options.map((o) => {
          const isRaise = o.min !== undefined;
          return (
            <button
              key={o.action + o.label}
              disabled={busy}
              onClick={() => (isRaise ? onRaise(o) : onAct(o.action, o.amount))}
              className={`btn-action ${btnClass(o.action)}`}
            >
              <span className="text-base leading-none">{o.label.split(" ")[0]}</span>
              {o.label.split(" ").slice(1).length > 0 && (
                <span className="text-[9px] opacity-80 mt-0.5">{o.label.split(" ").slice(1).join(" ")}</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ================= 筹码堆 ================= */
function ChipStack({ amount }: { amount: number }) {
  if (amount <= 0) return null;
  const tiers = [
    { cls: "chip-black", unit: 1000 },
    { cls: "chip-green", unit: 500 },
    { cls: "chip-blue", unit: 100 },
    { cls: "", unit: 25 },
  ];
  let left = amount;
  const stacks: { cls: string; count: number }[] = [];
  for (const t of tiers) {
    const c = Math.floor(left / t.unit);
    if (c > 0) {
      stacks.push({ cls: t.cls, count: Math.min(c, 5) });
      left -= c * t.unit;
    }
  }
  if (!stacks.length) stacks.push({ cls: "", count: 1 });
  return (
    <div className="flex items-end justify-center gap-1.5 h-8">
      {stacks.slice(0, 4).map((st, si) => (
        <div key={si} className="relative" style={{ width: 20 }}>
          {Array.from({ length: st.count }).map((_, i) => (
            <span
              key={i}
              className={`chip ${st.cls} absolute left-0 pop-in`}
              style={{
                width: 20,
                height: 20,
                bottom: i * 3.5,
                animationDelay: `${(si * 5 + i) * 40}ms`,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ================= 赠送 ================= */
function GiftButton({
  roomId,
  targetUserId,
  onGift,
}: {
  roomId: number;
  targetUserId: number;
  onGift: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [amt, setAmt] = useState("100");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  if (!open)
    return (
      <button
        onClick={() => { setOpen(true); setErr(""); }}
        className="mt-1 text-[8px] bg-amber-600/80 px-2 py-[2px] rounded-full font-bold"
      >
        ＋ 上分
      </button>
    );
  return (
    <div className="mt-1 flex flex-col gap-1">
      <div className="flex gap-0.5">
        <input
          inputMode="numeric"
          value={amt}
          onChange={(e) => setAmt(e.target.value)}
          className="w-9 text-[9px] px-1 rounded bg-black/70 text-amber-100 outline-none"
        />
        <button
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            setErr("");
            try {
              const res = await apiFetch(`/api/rooms/${roomId}/gift`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ targetUserId, amount: Number(amt) }),
              });
              const data = await res.json().catch(() => ({}));
              if (!res.ok) {
                setErr(data.error || `上分失败 (${res.status})`);
                return;
              }
              setOpen(false);
              onGift();
            } catch (e: any) {
              setErr("网络错误，请重试");
            } finally {
              setBusy(false);
            }
          }}
          className="text-[9px] gold-btn px-1.5 rounded disabled:opacity-50"
        >
          {busy ? "…" : "✓"}
        </button>
        <button
          onClick={() => setOpen(false)}
          className="text-[9px] bg-black/70 px-1.5 rounded text-red-300"
        >
          ✕
        </button>
      </div>
      {err && (
        <div className="text-[8px] text-red-400 bg-red-900/40 px-1.5 py-0.5 rounded">
          {err}
        </div>
      )}
    </div>
  );
}

/* ================= 弹窗 ================= */
function InfoModal({
  state,
  onClose,
}: {
  state: RoomState;
  onClose: () => void;
}) {
  const { room } = state;
  return (
    <Modal onClose={onClose} title="房间信息">
      <div className="space-y-1.5 mb-4">
        <IRow label="房间号" value={room.roomNo} />
        <IRow label="玩法" value={GAME_NAMES[room.gameType]} />
        <IRow label="场次" value={LEVELS[room.level as Level]?.name ?? "-"} />
        <IRow label="筹码面额" value={chipsFor(room.level).join(" / ")} />
        <IRow label="单注封顶" value={capFor(room.level).toLocaleString()} />
        <IRow label="座位上限" value={`${room.maxSeats} 人`} />
        <IRow
          label="进度"
          value={`${room.currentRound} / ${room.totalRounds} 局`}
        />
        <IRow label="房间费用 3%" value={room.totalRake.toLocaleString()} />
      </div>
    </Modal>
  );
}

function SettlementModal({
  state,
  onClose,
}: {
  state: RoomState;
  onClose: () => void;
}) {
  const { room, rounds } = state;
  // 从每局记录汇总每个玩家的详细战绩
  const statsMap = new Map<number, {
    account: string; avatar: string;
    totalDelta: number; totalGross: number; totalRake: number;
    hands: number; winCount: number; loseCount: number; tieCount: number;
    maxWin: number; maxLoss: number;
  }>();
  for (const r of rounds) {
    for (const h of r.result.hands) {
      const ex = statsMap.get(h.userId) || {
        account: h.account, avatar: "1",
        totalDelta: 0, totalGross: 0, totalRake: 0,
        hands: 0, winCount: 0, loseCount: 0, tieCount: 0,
        maxWin: 0, maxLoss: 0,
      };
      if (!ex.account || ex.account === "?") ex.account = h.account;
      ex.totalDelta += h.delta;
      ex.totalGross += h.gross || 0;
      ex.totalRake += h.rake || 0;
      ex.hands += 1;
      if (h.delta > 0) {
        ex.winCount += 1;
        if (h.delta > ex.maxWin) ex.maxWin = h.delta;
      } else if (h.delta < 0) {
        ex.loseCount += 1;
        if (h.delta < ex.maxLoss) ex.maxLoss = h.delta;
      } else {
        ex.tieCount += 1;
      }
      statsMap.set(h.userId, ex);
    }
  }
  // 补充头像信息
  for (const p of state.players) {
    const ex = statsMap.get(p.userId);
    if (ex) ex.avatar = p.avatar || "1";
  }
  const ranked = Array.from(statsMap.values()).sort((a, b) => b.totalDelta - a.totalDelta);
  const totalFlow = room.totalFlow || 0;
  const totalRake = room.totalRake || 0;
  const totalPlayerDelta = ranked.reduce((s, p) => s + p.totalDelta, 0);
  const winRate = (wins: number, total: number) => total > 0 ? Math.round(wins / total * 100) : 0;
  const avgDelta = (delta: number, hands: number) => hands > 0 ? Math.round(delta / hands) : 0;
  const biggestWinner = ranked.length > 0 ? ranked[0] : null;
  const biggestLoser = ranked.length > 1 ? ranked[ranked.length - 1] : null;
  const [expandedPlayer, setExpandedPlayer] = useState<number | null>(null);

  return (
    <Modal onClose={onClose} title="总 局 战 绩" icon="🏆">
      <div className="text-[11px] text-amber-200/55 text-center mb-3">
        {room.currentRound} 局已完成 · 房号 {room.roomNo} · {GAME_NAMES[room.gameType] || room.gameType}
      </div>

      {/* 大赢家/大输家概览 */}
      {ranked.length >= 2 && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-gradient-to-br from-amber-500/20 to-amber-600/10 rounded-xl p-2.5 border border-amber-400/30">
            <div className="text-[9px] text-amber-300/70 font-bold mb-1">🏆 大赢家</div>
            <div className="flex items-center gap-1.5">
              <Avatar id={biggestWinner?.avatar || "1"} size={20} ring={false} />
              <span className="text-[11px] text-amber-100 font-bold truncate">{biggestWinner?.account}</span>
            </div>
            <div className="text-green-400 font-black text-sm mt-1">+{biggestWinner?.totalDelta.toLocaleString()}</div>
          </div>
          <div className="bg-gradient-to-br from-red-500/20 to-red-600/10 rounded-xl p-2.5 border border-red-400/30">
            <div className="text-[9px] text-red-300/70 font-bold mb-1">💸 大输家</div>
            <div className="flex items-center gap-1.5">
              <Avatar id={biggestLoser?.avatar || "1"} size={20} ring={false} />
              <span className="text-[11px] text-amber-100 font-bold truncate">{biggestLoser?.account}</span>
            </div>
            <div className="text-red-400 font-black text-sm mt-1">{biggestLoser?.totalDelta.toLocaleString()}</div>
          </div>
        </div>
      )}

      {/* 玩家详细战绩排行 */}
      <div className="space-y-2 mb-4 max-h-[45vh] overflow-y-auto">
        {ranked.length === 0 ? (
          <div className="text-center text-amber-200/40 py-6 text-sm">暂无对局记录</div>
        ) : ranked.map((p, i) => (
          <div
            key={p.account + i}
            className={`rounded-xl overflow-hidden ${
              i === 0 ? "bg-gradient-to-r from-amber-500/20 to-transparent ring-1 ring-amber-400/50" : "bg-black/25"
            }`}
          >
            {/* 第一行：排名 + 头像 + 名字 + 总输赢 */}
            <div
              className="flex items-center justify-between px-3 py-2.5 cursor-pointer"
              onClick={() => setExpandedPlayer(expandedPlayer === i ? null : i)}
            >
              <span className="flex items-center gap-2 min-w-0">
                <span className="w-6 text-center shrink-0 text-sm">
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : <span className="text-amber-200/50">{i + 1}</span>}
                </span>
                <Avatar id={p.avatar} size={26} ring={false} />
                <span className="truncate text-amber-50 font-bold text-sm">{p.account}</span>
                {i === 0 && <span className="text-[8px] bg-amber-500 text-black px-1 rounded font-bold">WIN</span>}
              </span>
              <span className={`text-lg font-black shrink-0 ${
                p.totalDelta > 0 ? "text-green-400" : p.totalDelta < 0 ? "text-red-400" : "text-white/50"
              }`}>
                {p.totalDelta > 0 ? "+" : ""}{p.totalDelta.toLocaleString()}
              </span>
            </div>
            {/* 第二行：详细统计 */}
            <div className="px-3 pb-2.5 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-amber-200/60">
              <span>📊 {p.winCount}胜{p.loseCount}负{p.tieCount}平 ({winRate(p.winCount, p.hands)}%)</span>
              {p.totalGross > 0 && <span>💰 赢{p.totalGross.toLocaleString()}</span>}
              {p.totalRake > 0 && <span className="text-amber-300/80">🏠 扣房费{p.totalRake.toLocaleString()}</span>}
              {p.maxWin > 0 && <span className="text-green-400/80">最高+{p.maxWin.toLocaleString()}</span>}
              {p.maxLoss < 0 && <span className="text-red-400/80">最高{p.maxLoss.toLocaleString()}</span>}
            </div>
            {/* 展开的每局明细 */}
            {expandedPlayer === i && (
              <div className="border-t border-amber-500/15 px-3 py-2 bg-black/30">
                <div className="text-[9px] text-amber-200/40 mb-1.5 font-bold">每局明细</div>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {rounds.filter(r => r.result.hands.some(h => h.userId === Array.from(statsMap.keys())[i])).map((r) => {
                    const h = r.result.hands.find(x => x.userId === Array.from(statsMap.keys())[i]);
                    return (
                      <div key={r.id} className="flex justify-between text-[10px]">
                        <span className="text-amber-200/50">第{r.roundNo}局 {h?.handName || ""}</span>
                        <span className={h && h.delta > 0 ? "text-green-400" : h && h.delta < 0 ? "text-red-400" : "text-amber-200/40"}>
                          {h && h.delta > 0 ? "+" : ""}{h?.delta.toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 对账校验 */}
      <div className="bg-black/35 rounded-xl p-3 text-[11px] space-y-1.5 mb-4">
        <div className="flex justify-between">
          <span className="text-amber-200/65">玩家输赢合计</span>
          <span className={`font-bold ${totalPlayerDelta < 0 ? "text-red-400" : "text-green-400"}`}>
            {totalPlayerDelta > 0 ? "+" : ""}{totalPlayerDelta.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-amber-200/65">总局流水</span>
          <span className="text-amber-100 font-bold">{totalFlow.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-amber-200/65">房费合计</span>
          <span className="gold-text font-black">{totalRake.toLocaleString()}</span>
        </div>
        <div className="flex justify-between border-t border-amber-500/20 pt-1.5">
          <span className="text-amber-200/50">对账校验（玩家合计+房费）</span>
          <span className={`font-bold ${Math.abs(totalPlayerDelta + totalRake) <= 1 ? "text-green-400" : "text-red-400"}`}>
            {(totalPlayerDelta + totalRake).toLocaleString()}
            {Math.abs(totalPlayerDelta + totalRake) <= 1 ? " ✓" : " ✗"}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onClose}
          className="flex-1 hud-pill py-3 text-amber-200 text-sm font-bold"
        >
          关闭
        </button>
        {state.isHost && (
          <AppLink
            href={`/game/${room.gameType}`}
            className="flex-1 gold-btn py-3 rounded-xl text-center text-sm"
          >
            ＋ 新建房间
          </AppLink>
        )}
      </div>
    </Modal>
  );
}

function Modal({
  title,
  icon,
  children,
  onClose,
}: {
  title: string;
  icon?: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 flex items-end sm:items-center justify-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="frame-gold w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="frame-inner p-5 bg-gradient-to-b from-[#182444] to-[#0a1020] max-h-[88vh] overflow-y-auto safe-bottom">
          <div className="text-center mb-3">
            {icon && <div className="text-3xl mb-1">{icon}</div>}
            <div className="gold-title text-lg font-black">{title}</div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

/* 骰子点数显示组件 */
function DiceDot({ value, size }: { value: number; size: number }) {
  const dots: Record<number, [number, number][]> = {
    1: [[50, 50]],
    2: [[25, 25], [75, 75]],
    3: [[25, 25], [50, 50], [75, 75]],
    4: [[25, 25], [75, 25], [25, 75], [75, 75]],
    5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
    6: [[25, 20], [75, 20], [25, 50], [75, 50], [25, 80], [75, 80]],
  };
  const dotSize = Math.max(3, size * 0.22);
  return (
    <div
      className="inline-flex items-center justify-center rounded bg-white border border-amber-300/60 shadow-sm"
      style={{ width: size, height: size, position: "relative", flexShrink: 0 }}
    >
      {dots[value]?.map(([x, y], i) => (
        <span
          key={i}
          className="absolute rounded-full bg-gray-900"
          style={{
            width: dotSize,
            height: dotSize,
            left: `${x}%`,
            top: `${y}%`,
            transform: "translate(-50%,-50%)",
          }}
        />
      ))}
    </div>
  );
}

function IRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-xs bg-black/25 rounded-lg px-3 py-2">
      <span className="text-amber-200/55">{label}</span>
      <span className="text-amber-50 font-bold">{value}</span>
    </div>
  );
}

function EarlySettleModal({
  room,
  players,
  hand,
  onConfirm,
  onClose,
}: {
  room: RoomState["room"];
  players: PlayerRow[];
  hand: RoomState["hand"];
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
}) {
  const totalPoints = players.reduce((s, p) => s + p.points, 0);
  const hasPendingHand = hand !== null && !hand.finished;
  return (
    <Modal onClose={onClose} title="提前结算房间" icon="⚠️">
      <div className="space-y-2 mb-4 text-xs">
        <div className="bg-red-950/40 border border-red-500/30 rounded-lg px-3 py-2 text-red-200">
          将立即结束本房间所有对局，退还所有玩家桌上剩余筹码。
        </div>
        {hasPendingHand && (
          <div className="bg-amber-950/40 border border-amber-500/30 rounded-lg px-3 py-2 text-amber-200">
            ⚠️ 当前有第 {hand.roundNo} 局正在进行中，该局的底池将按未弃牌玩家人数均分。
          </div>
        )}
        <div className="flex justify-between bg-black/25 rounded-lg px-3 py-2">
          <span className="text-amber-200/60">房间号</span>
          <span className="text-amber-100 font-bold">{room.roomNo}</span>
        </div>
        <div className="flex justify-between bg-black/25 rounded-lg px-3 py-2">
          <span className="text-amber-200/60">已玩局数</span>
          <span className="text-amber-100 font-bold">{room.currentRound} / {room.totalRounds}</span>
        </div>
        <div className="flex justify-between bg-black/25 rounded-lg px-3 py-2">
          <span className="text-amber-200/60">待退还总筹码</span>
          <span className="gold-text font-black">{totalPoints.toLocaleString()}</span>
        </div>
        <div className="flex justify-between bg-black/25 rounded-lg px-3 py-2">
          <span className="text-amber-200/60">将扣房费（已完成局累计）</span>
          <span className="text-red-300 font-black">−{room.totalRake.toLocaleString()}</span>
        </div>
        <div className="text-[10px] text-amber-200/50 mt-1">
          参与玩家：{players.map((p) => `${p.account}(${p.points})`).join("、")}
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onClose}
          className="flex-1 hud-pill py-3 text-amber-200 text-sm font-bold"
        >
          取消
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 red-btn py-3 rounded-xl text-center text-sm font-bold"
        >
          确认提前结算
        </button>
      </div>
    </Modal>
  );
}

/* ================= 游戏规则弹窗 ================= */
const GAME_RULES: Record<string, { name: string; emoji: string; steps: string[]; hands: string[]; tips: string[] }> = {
  texas: {
    name: "德州竞技",
    emoji: "♠️",
    steps: [
      "1. 小盲/大盲位强制下盲注，庄家按钮位依次移动",
      "2. 每人发2张底牌（仅自己可见）",
      "3. 四轮下注：翻牌前 → 翻牌圈(3张公共牌) → 转牌圈(1张) → 河牌圈(1张)",
      "4. 每轮可选择：弃牌/跟注/加注/过牌/全押(All-in)",
      "5. 摊牌时用2张底牌+5张公共牌组合最佳5张比大小",
    ],
    hands: [
      "皇家同花顺 > 同花顺 > 四条 > 葫芦 > 同花 > 顺子 > 三条 > 两对 > 一对 > 高牌",
      "【赔付】赢牌者赢得底池全部筹码；多人All-in时按投入比例分配侧边池",
      "All-in 不受单注封顶限制，可全押所有筹码",
    ],
    tips: [
      "小盲=大盲的一半，大盲=基础注",
      "筹码不足时自动全押，侧边池自动计算",
    ],
  },
  niuniu: {
    name: "抢庄斗牛",
    emoji: "🐂",
    steps: [
      "1. 抢庄阶段：每人掷骰子，点数最大者为庄家（相同则重掷）",
      "2. 下注阶段：闲家依次选择筹码下注，可多次累加，确认后下一位",
      "3. 发牌：每人发5张牌",
      "4. 开牌：将5张牌分成3张+2张两组，3张点数和为10/20/30即'有牛'",
      "5. 结算：有牛则比剩余2张和的个位数（牛几），无牛直接输",
    ],
    hands: [
      "牌型大小：五小牛 > 炸弹牛 > 五花牛 > 牛牛 > 牛九 > 牛八 > ... > 牛一 > 无牛",
      "【赔付倍数】五小牛×6、炸弹牛×5、五花牛×4、牛牛×3、牛七~牛九×2、牛一~牛六及无牛×1",
      "J/Q/K 算10点，A算1点",
    ],
    tips: [
      "庄家与每位闲家一对一比牌，互不影响",
      "闲家赢牌退还本金+赔对应倍数，输牌扣除下注额",
      "炸弹牛：四张相同点数的牌；五花牛：五张全是J/Q/K；五小牛：五张均≤5且总和≤10",
    ],
  },
  sangong: {
    name: "三公竞技",
    emoji: "👑",
    steps: [
      "1. 抢庄阶段：每人掷骰子，点数最大者为庄家（相同则重掷）",
      "2. 下注阶段：闲家依次选择筹码下注，可多次累加，确认后下一位",
      "3. 发牌：每人发3张牌",
      "4. 开牌：3张牌点数之和的个位数比大小，越接近9越大",
      "5. 结算：庄家与每位闲家一对一比牌",
    ],
    hands: [
      "牌型大小：至尊九(三张3) > 三条 > 三公 > 双公 > 单公 > 普通点数",
      "【赔付倍数】至尊九×4、三条×3、三公×3、8点/9点×2、其余×1",
      "J/Q/K 算0点（公牌），A算1点，其他按面值",
    ],
    tips: [
      "三张都是公牌即为'三公'；两张公牌+一张点数为'双公'；一张公牌为'单公'",
      "点数优先于公仔数量：无公3点 > 双公1点",
      "点数相同则庄家赢",
      "至尊九：三张都是3，通杀全场",
    ],
  },
  jinhua: {
    name: "金花竞技",
    emoji: "🃏",
    steps: [
      "1. 所有玩家下底注后，每人发3张牌",
      "2. 闷牌（不看牌）：跟注只需半价，加注也按闷牌价",
      "3. 看牌后：跟注需全价，可加注/比牌/弃牌",
      "4. 比牌：主动比牌者需额外支付跟注额，两人私下比牌，输者出局",
      "5. 当只剩2人时可随时比牌；最多20轮下注后强制比牌",
    ],
    hands: [
      "豹子 > 顺金 > 金花 > 顺子 > 对子 > 散牌",
      "【赔付】比牌赢者赢得对方全部下注筹码；闷牌跟注为看牌价的一半",
      "特殊：235（散牌）> 豹子（仅当桌有豹子时生效）",
    ],
    tips: [
      "筹码不足时下一次跟注时只能选择比牌，不能继续跟注",
      "闷牌状态下加注金额为看牌的一半",
      "A-2-3是最小顺子，Q-K-A是最大顺子",
    ],
  },
};

function HistoryModal({ state, onClose }: { state: RoomState; onClose: () => void }) {
  const { room, rounds } = state;
  const [expandedRound, setExpandedRound] = useState<number | null>(null);
  return (
    <Modal onClose={onClose} title="对局记录" icon="📊">
      <div className="text-[11px] text-amber-200/55 text-center mb-3">
        房号 {room.roomNo} · {GAME_NAMES[room.gameType]} · 共 {rounds.length} 局
      </div>
      {rounds.length === 0 ? (
        <div className="text-center text-amber-200/40 py-8 text-sm">暂无对局记录</div>
      ) : (
        <div className="space-y-1.5 max-h-[55vh] overflow-y-auto">
          {rounds.map((r) => {
            const winner = r.result.hands.find((h) => h.userId === r.result.winnerUserId);
            const isExpanded = expandedRound === r.id;
            return (
              <div key={r.id} className="rounded-xl overflow-hidden bg-black/25">
                <div
                  className="flex items-center justify-between px-3 py-2.5 cursor-pointer hover:bg-amber-500/5"
                  onClick={() => setExpandedRound(isExpanded ? null : r.id)}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[10px] text-amber-200/50 w-12 shrink-0">第{r.roundNo}局</span>
                    <span className="text-[11px] text-amber-100 font-bold truncate">{winner?.account || "平局"}</span>
                    {winner?.handName && <span className="text-[9px] text-amber-300/70 bg-amber-500/10 px-1.5 py-0.5 rounded">{winner.handName}</span>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {winner && winner.delta > 0 && <span className="text-green-400 text-xs font-bold">+{winner.delta}</span>}
                    <span className="text-amber-200/40 text-xs">{isExpanded ? "▲" : "▼"}</span>
                  </div>
                </div>
                {isExpanded && (
                  <div className="border-t border-amber-500/15 px-3 py-2 bg-black/30 space-y-1">
                    {r.result.hands.map((h) => (
                      <div key={h.userId} className="flex justify-between text-[10px]">
                        <span className="text-amber-200/60">{h.account} {h.handName || ""}</span>
                        <span className={h.delta > 0 ? "text-green-400 font-bold" : h.delta < 0 ? "text-red-400" : "text-amber-200/40"}>
                          {h.delta > 0 ? "+" : ""}{h.delta}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      <button onClick={onClose} className="w-full hud-pill py-3 text-amber-200 text-sm font-bold mt-4">关闭</button>
    </Modal>
  );
}
function RulesModal({ gameType, onClose }: { gameType: string; onClose: () => void }) {
  const rule = GAME_RULES[gameType] || GAME_RULES.texas;
  const multiplierLines = rule.hands.filter((h) => h.includes("倍") || h.includes("赔付"));
  const otherHands = rule.hands.filter((h) => !h.includes("倍") && !h.includes("赔付"));
  return (
    <Modal onClose={onClose} title={`${rule.emoji} ${rule.name} 规则说明`}>
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
        <div>
          <div className="text-amber-300 font-black text-sm mb-2">游戏流程</div>
          <div className="space-y-1.5">
            {rule.steps.map((s, i) => (
              <div key={i} className="text-[11px] text-amber-100/80 leading-relaxed">{s}</div>
            ))}
          </div>
        </div>
        {multiplierLines.length > 0 && (
          <div className="bg-gradient-to-r from-amber-900/40 to-amber-700/20 border border-amber-500/40 rounded-xl p-3">
            <div className="text-amber-300 font-black text-sm mb-2">赔付倍数</div>
            <div className="space-y-1.5">
              {multiplierLines.map((s, i) => (
                <div key={i} className="text-[11px] text-amber-100 leading-relaxed font-bold">{s}</div>
              ))}
            </div>
          </div>
        )}
        <div className="border-t border-amber-500/20 pt-3">
          <div className="text-amber-300 font-black text-sm mb-2">牌型大小</div>
          <div className="space-y-1.5">
            {otherHands.map((s, i) => (
              <div key={i} className="text-[11px] text-amber-100/80 leading-relaxed">{s}</div>
            ))}
          </div>
        </div>
        <div className="border-t border-amber-500/20 pt-3">
          <div className="text-amber-300 font-black text-sm mb-2">小贴士</div>
          <div className="space-y-1.5">
            {rule.tips.map((s, i) => (
              <div key={i} className="text-[11px] text-amber-100/60 leading-relaxed">{s}</div>
            ))}
          </div>
        </div>
        <div className="border-t border-amber-500/20 pt-3 text-[10px] text-amber-200/40 text-center">
          每局收取总流水3%作为房费，按赢家盈利比例分摊
        </div>
      </div>
      <button onClick={onClose} className="w-full hud-pill py-3 text-amber-200 text-sm font-bold mt-4">关闭</button>
    </Modal>
  );
}

"use client";

import { apiFetch } from "@/lib/api";
import { navigateRoom, navigateLobby, navigateHome } from "@/lib/navigation";
import { assetUrl } from "@/lib/assets";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { AppLink } from "@/components/AppLink";
import Image from "next/image";
import { Me } from "@/lib/types";
import { LEVELS, levelForCredit, Level, limitText, chipsFor, capFor } from "@/lib/rooms";

const GAME_NAMES: Record<string, string> = {
  texas: "德州扑克",
  jinhua: "赢三张",
  sangong: "三公竞技",
  niuniu: "抢庄斗牛",
};
const GAME_ART: Record<string, string> = {
  texas: "/art/texas.jpg",
  jinhua: "/art/jinhua.jpg",
  sangong: "/art/sangong.jpg",
  niuniu: "/art/niuniu.jpg",
};

interface Room {
  id: number;
  ownerName?: string;
  isMine?: boolean;
  roomNo: string;
  gameType: string;
  level: string;
  initialPoints: number;
  status: string;
  currentRound: number;
  totalRounds: number;
}

export default function GameEntry({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = use(params);
  const router = useRouter();
  const [me, setMe] = useState<Me | null>(null);
  const [roomNo, setRoomNo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [joining, setJoining] = useState(false);
  const [myRooms, setMyRooms] = useState<Room[]>([]);
  const [joinedRooms, setJoinedRooms] = useState<any[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [freeSpectate, setFreeSpectate] = useState(false);

  const gameName = GAME_NAMES[type] || "竞技";

  useEffect(() => {
    apiFetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (!d.user) navigateHome();
        else setMe(d.user);
      });
  }, [router]);

  const isAgent =
    me?.role === "agent" || me?.role === "top_agent" || me?.role === "admin";
  const isPrivileged = me?.role === "admin" || me?.role === "top_agent";

  function reloadRooms() {
    apiFetch(`/api/rooms/mine?gameType=${type}`)
      .then((r) => r.json())
      .then((d) => {
        setMyRooms(d.rooms || []);
        setFreeSpectate(!!d.canSpectateFree);
      });
    // 加载已加入的房间（继续游戏），只显示当前游戏类型
    apiFetch("/api/rooms/joined")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => setJoinedRooms((d?.rooms || []).filter((r: any) => r.gameType === type)))
      .catch(() => {});
  }

  useEffect(() => {
    reloadRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAgent, type]);

  async function join() {
    setError("");
    setJoining(true);
    try {
      const res = await apiFetch("/api/rooms/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomNo, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "加入失败");
        return;
      }
      navigateRoom(data.room.id);
    } finally {
      setJoining(false);
    }
  }

  async function joinAndNavigate(roomId: number, roomNo: string, password?: string) {
    setJoining(true);
    try {
      const res = await apiFetch("/api/rooms/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomNo, password: password || "" }),
      });
      let data: { error?: string; room?: { id: number } } = {};
      try {
        data = await res.json();
      } catch {
        setError("网络错误，请重试");
        return;
      }
      if (!res.ok) {
        setError(data.error || "加入失败");
        return;
      }
      navigateRoom(roomId);
    } finally {
      setJoining(false);
    }
  }

  if (!me)
    return (
      <div className="min-h-screen flex items-center justify-center gold-text animate-pulse">
        加载中…
      </div>
    );

  const active = myRooms.filter((r) => r.status !== "finished");
  const finishedRooms = myRooms.filter((r) => r.status === "finished");

  return (
    <div className="min-h-screen px-3 py-3 pb-10 relative">
      <div className="stage" />
      <div className="max-w-2xl mx-auto relative z-10">
        <div className="flex items-center justify-between mb-3">
          <AppLink href="/lobby" className="panel px-3 py-2 rounded-lg gold-ink text-xs">
            ← 大厅
          </AppLink>
          <div className="gold-title text-xl font-black">{gameName}</div>
          <div className="w-14" />
        </div>

        {/* hero art */}
        <div className="frame-gold mb-3 shine">
          <div className="frame-inner h-24 sm:h-32">
            <Image
              src={assetUrl(GAME_ART[type] || "/art/texas.jpg")}
              alt={gameName}
              fill
              sizes="100vw"
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050a16]/90 via-transparent to-[#050a16]/70" />
            <div className="absolute inset-0 flex items-center px-4">
              <div>
                <div className="gold-title text-xl font-black">{gameName}</div>
                <div className="text-[10px] text-amber-100/70 mt-0.5">
                  自由对局 · 随时结算
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 继续游戏：已加入但未结束的房间 */}
        {joinedRooms.length > 0 && (
          <div className="panel rounded-2xl p-4 mb-3">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-bold gold-text">🎮 继续游戏</span>
              <span className="text-[10px] text-amber-200/50">{joinedRooms.length}个房间进行中</span>
            </div>
            <div className="space-y-2">
              {joinedRooms.map((r) => (
                <button
                  key={r.id}
                  onClick={() => navigateRoom(r.id)}
                  className="w-full text-left frame-gold shine active:scale-[0.98] transition-transform"
                >
                  <div className="frame-inner px-3 py-2.5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-black/40 grid place-items-center text-xl shrink-0">
                      {type === "texas" ? "♠️" : type === "jinhua" ? "🃏" : type === "sangong" ? "🎲" : "🐂"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-amber-100 font-bold">
                        房间 #{r.roomNo}
                        <span className="ml-2 text-[10px] text-amber-300/70">
                          {LEVELS[r.level as Level]?.name || r.level}
                        </span>
                      </div>
                      <div className="text-[10px] text-amber-200/50 mt-0.5">
                        {r.isSpectator ? "👁 观战中" : `🪑 座位${r.seat} · 筹码${r.points}`}
                        <span className="ml-2">第{r.currentRound + 1}/{r.totalRounds}局</span>
                        <span className="ml-2">房主 {r.ownerName}</span>
                      </div>
                    </div>
                    <div className="gold-btn px-3 py-1.5 rounded-lg text-[11px] font-bold shrink-0">
                      进入
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Join */}
        <div className="panel rounded-2xl p-4 mb-3">
          <div className="text-sm font-bold gold-text mb-3">🔑 加入房间</div>
          <div className="space-y-2.5">
            <input
              inputMode="numeric"
              placeholder="请输入房间号"
              value={roomNo}
              onChange={(e) => setRoomNo(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/35 gold-border text-amber-100 placeholder-amber-200/35 outline-none focus:border-amber-400"
            />
            <input
              placeholder={
                isPrivileged ? "房间密码（观战可留空）" : "请输入房间密码"
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/35 gold-border text-amber-100 placeholder-amber-200/35 outline-none focus:border-amber-400"
            />
          </div>
          {!isAgent && me.role === "player" && (
            <div className="flex items-center justify-between mt-2.5 text-[11px] bg-black/30 rounded-lg px-3 py-2">
              <span className="text-amber-200/60">我的筹码</span>
              <span className="gold-text font-black text-sm">
                {me.points.toLocaleString()}
              </span>
            </div>
          )}
          {error && (
            <div className="mt-2.5 rounded-lg bg-red-950/60 border border-red-500/40 px-3 py-2 text-xs text-red-200">
              ⚠️ {error}
            </div>
          )}
          <button
            onClick={join}
            disabled={joining}
            className="gold-btn w-full py-3.5 rounded-xl mt-3 text-base"
          >
            {joining ? "加入中…" : isPrivileged ? "免密进入观战" : "加入对局"}
          </button>
          {isPrivileged && (
            <div className="text-[10px] text-amber-200/45 mt-2 text-center">
              {me.role === "admin" ? "管理员" : "总代理"}身份可免密码进入任意房间观战
            </div>
          )}
        </div>

        {/* Agent area */}
        {isAgent && (
          <>
            <button
              onClick={() => setShowCreate((s) => !s)}
              className="gold-btn w-full py-3.5 rounded-xl mb-3 text-base"
            >
              {showCreate ? "✕ 取消创建" : "＋ 创建房间"}
            </button>

            {showCreate && (
              <CreateRoom
                gameType={type}
                credit={me.role === "admin" ? 1_000_000 : me.credit}
                blocked={me.openRoomBlocked}
                onCreated={() => {
                  reloadRooms();
                  setShowCreate(false);
                }}
              />
            )}

            <div className="panel rounded-2xl p-4 mb-3">
              <div className="text-sm font-bold gold-text mb-2">
                🎯 {isPrivileged ? "可观战房间" : "进行中的房间"}（{active.length}）
              </div>
              {active.length === 0 ? (
                <div className="text-amber-200/40 text-xs py-2">
                  暂无进行中的房间，点击上方创建
                </div>
              ) : (
                <div className="space-y-2">
                  {active.map((r) => (
                    <RoomRow key={r.id} r={r} onClick={() => joinAndNavigate(r.id, r.roomNo)} />
                  ))}
                </div>
              )}
            </div>

            {finishedRooms.length > 0 && (
              <div className="panel rounded-2xl p-4">
                <div className="text-sm font-bold gold-text mb-2">
                  🏁 已结束房间（需重新创建）
                </div>
                <div className="space-y-2">
                  {finishedRooms.slice(0, 10).map((r) => (
                    <RoomRow
                      key={r.id}
                      r={r}
                      onClick={() => joinAndNavigate(r.id, r.roomNo)}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {!isAgent && (
          <div className="panel rounded-2xl p-4 text-[11px] text-amber-200/60 leading-relaxed">
            💡 请向房主索取房间号与密码后加入对局。
          </div>
        )}
      </div>
    </div>
  );
}

function RoomRow({ r, onClick }: { r: Room; onClick: () => void }) {
  const done = r.status === "finished";
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between gap-2 bg-black/25 gold-border rounded-xl px-3 py-2.5 active:bg-black/50"
    >
      <div className="text-left min-w-0">
        <div className="font-bold text-amber-100 text-sm flex items-center gap-1.5 flex-wrap min-w-0">
          房号 {r.roomNo}
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-600/40 font-normal">
            {LEVELS[r.level as Level]?.name}
          </span>
        </div>
        <div className="text-[10px] text-amber-200/55 mt-0.5 truncate">
          {r.ownerName && !r.isMine ? `房主 ${r.ownerName} · ` : ""}
          {limitText(r.level)} · 进度 {r.currentRound}/{r.totalRounds}
        </div>
      </div>
      <span
        className={`text-[10px] px-2 py-1 rounded shrink-0 ${
          done
            ? "bg-gray-600"
            : r.status === "playing"
            ? "bg-green-600"
            : "bg-blue-600"
        }`}
      >
        {done ? "已结算" : r.status === "playing" ? "进行中" : "等待中"}
      </span>
    </button>
  );
}

function CreateRoom({
  gameType,
  credit,
  blocked,
  onCreated,
}: {
  gameType: string;
  credit: number;
  blocked: boolean;
  onCreated: () => void;
}) {
  const available = levelForCredit(credit);
  const [level, setLevel] = useState<Level>(available[available.length - 1]);
  const [initialPoints, setInitialPoints] = useState<number>(
    LEVELS[available[available.length - 1]].min
  );
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const lv = LEVELS[level];

  async function create() {
    setError("");
    setLoading(true);
    try {
      const res = await apiFetch("/api/rooms/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameType, level, initialPoints, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "创建失败");
        return;
      }
      onCreated();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="panel rounded-2xl p-4 mb-3">
      <div className="text-sm font-bold gold-text mb-3">🏗 创建房间</div>

      {blocked && (
        <div className="bg-red-900/40 border border-red-500/40 rounded-lg p-2.5 text-[11px] text-red-200 mb-3">
          ⚠️ 存在扣分失败记录，开房权限已冻结，请联系客服补充信用分
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 mb-3">
        {(["junior", "senior", "top"] as Level[]).map((l) => {
          const enabled = available.includes(l);
          return (
            <button
              key={l}
              disabled={!enabled}
              onClick={() => {
                setLevel(l);
                setInitialPoints(LEVELS[l].min);
              }}
              className={`py-2 px-1 rounded-xl text-xs font-bold ${
                level === l
                  ? "gold-btn"
                  : "bg-black/30 gold-border text-amber-200/70"
              } ${!enabled ? "opacity-40" : ""}`}
            >
              {LEVELS[l].name}
              <div className="text-[9px] font-normal mt-0.5 leading-tight">
                {enabled
                  ? LEVELS[l].chips.join("/")
                  : `需信用${LEVELS[l].creditReq}`}
              </div>
              {enabled && (
                <div className="text-[8px] font-normal opacity-70">
                  封顶 {LEVELS[l].cap}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="bg-black/35 rounded-xl p-2.5 mb-3 text-[11px]">
        <div className="flex justify-between mb-1">
          <span className="text-amber-200/60">下注筹码面额</span>
          <span className="gold-text font-black">
            {chipsFor(level).join(" / ")}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-amber-200/60">单注封顶</span>
          <span className="gold-text font-black">{capFor(level)}</span>
        </div>
      </div>

      <label className="text-[11px] text-amber-200/70">
        买入上限·每桌最多带入（{lv.min} - {lv.max}）
      </label>
      <input
        type="number"
        inputMode="numeric"
        value={initialPoints}
        min={lv.min}
        max={lv.max}
        onChange={(e) => setInitialPoints(Number(e.target.value))}
        className="w-full mt-1 px-4 py-3 rounded-xl bg-black/35 gold-border text-amber-100 outline-none"
      />
      <input
        type="range"
        min={lv.min}
        max={lv.max}
        step={100}
        value={initialPoints}
        onChange={(e) => setInitialPoints(Number(e.target.value))}
        className="w-full mt-2 accent-amber-400"
      />

      <label className="text-[11px] text-amber-200/70 mt-3 block">
        房间密码（分享给玩家）
      </label>
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="设置房间密码"
        className="w-full mt-1 px-4 py-3 rounded-xl bg-black/35 gold-border text-amber-100 placeholder-amber-200/35 outline-none"
      />

      <div className="text-[10px] text-amber-200/45 mt-2.5 leading-relaxed">
        房间费用 3% 于结算时从信用分扣除。代理可提前结算并退还玩家筹码。
      </div>

      {error && <div className="text-red-400 text-xs mt-2">{error}</div>}
      <button
        onClick={create}
        disabled={loading}
        className="gold-btn w-full py-3.5 rounded-xl mt-3"
      >
        {loading ? "创建中…" : "确认创建"}
      </button>
    </div>
  );
}

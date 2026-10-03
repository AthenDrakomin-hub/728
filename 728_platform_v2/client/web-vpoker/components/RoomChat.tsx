"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { apiFetch } from "@/lib/api";
import { QUICK_PHRASES, EMOJIS, INTERACTIONS } from "@/lib/chat";
import { Avatar } from "@/components/Avatar";

export interface ChatMsg {
  id: number;
  userId: number;
  account: string;
  avatar: string;
  kind: string;
  content: string;
  targetUserId: number | null;
  targetName: string | null;
  createdAt: string;
}

export interface FloatItem {
  key: string;
  userId: number;
  targetUserId: number | null;
  content: string;
  kind: string;
}

/** 语音播报（浏览器内置 TTS，无需音频文件） */
function speak(text: string, enabled: boolean) {
  if (!enabled) return;
  try {
    const synth = window.speechSynthesis;
    if (!synth) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "zh-CN";
    u.rate = 1.05;
    u.volume = 0.9;
    synth.speak(u);
  } catch {
    /* ignore */
  }
}

export function RoomChat({
  roomId,
  meId,
  players,
  onFloat,
}: {
  roomId: number;
  meId: number;
  players: { userId: number; account: string }[];
  onFloat: (items: FloatItem[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"quick" | "emoji" | "interact" | "text">(
    "quick"
  );
  const [msgs, setMsgs] = useState<ChatMsg[]>([]);
  const [text, setText] = useState("");
  const [unread, setUnread] = useState(0);
  const [voiceOn, setVoiceOn] = useState(true);
  const [target, setTarget] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const sinceRef = useRef(0);
  const listRef = useRef<HTMLDivElement>(null);
  const firstLoad = useRef(true);

  const poll = useCallback(async () => {
    try {
      const res = await apiFetch(
        `/api/rooms/${roomId}/chat?since=${sinceRef.current}`
      );
      if (!res.ok) return;
      const d = await res.json();
      const list: ChatMsg[] = d.messages || [];
      if (!list.length) return;
      sinceRef.current = Math.max(...list.map((m) => m.id));
      setMsgs((prev) => [...prev, ...list].slice(-60));

      if (!firstLoad.current) {
        // 飘字 / 飘表情
        onFloat(
          list.map((m) => ({
            key: `${m.id}`,
            userId: m.userId,
            targetUserId: m.targetUserId,
            content: m.content,
            kind: m.kind,
          }))
        );
        // 他人的快捷语做语音播报
        for (const m of list) {
          if (m.userId !== meId && (m.kind === "quick" || m.kind === "text")) {
            speak(m.content, voiceOn);
          }
        }
        setOpen((o) => {
          if (!o) setUnread((u) => u + list.filter((m) => m.userId !== meId).length);
          return o;
        });
      }
      firstLoad.current = false;
    } catch {
      /* ignore */
    }
  }, [roomId, meId, voiceOn, onFloat]);

  useEffect(() => {
    poll();
    const t = setInterval(poll, 2000);
    return () => clearInterval(t);
  }, [poll]);

  useEffect(() => {
    if (open) {
      // 延迟清除未读数，避免在 effect 同步调用中触发级联渲染
      const timer = setTimeout(() => setUnread(0), 0);
      listRef.current?.scrollTo({ top: 999999 });
      return () => clearTimeout(timer);
    }
  }, [open, msgs]);

  async function send(kind: string, content: string, targetUserId?: number) {
    if (busy) return;
    setBusy(true);
    try {
      await apiFetch(`/api/rooms/${roomId}/chat`, {
        method: "POST",
        body: JSON.stringify({ kind, content, targetUserId }),
      });
      if (kind === "quick" || kind === "text") speak(content, voiceOn);
      await poll();
    } finally {
      setBusy(false);
    }
  }

  const others = players.filter((p) => p.userId !== meId);

  return (
    <>
      {/* 悬浮聊天按钮 */}
      <button
        onClick={() => setOpen(true)}
        className="fixed z-40 right-2.5 bottom-[190px] w-11 h-11 rounded-full gold-btn grid place-items-center text-lg shadow-lg"
        aria-label="聊天"
      >
        💬
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] font-black grid place-items-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {!open ? null : (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-end"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full bg-gradient-to-b from-[#16223f] to-[#080e1c] border-t border-amber-500/35 rounded-t-2xl safe-bottom"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 头部 */}
            <div className="flex items-center justify-between px-3 pt-2.5 pb-1.5">
              <span className="gold-text font-black text-sm">房间互动</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setVoiceOn((v) => !v)}
                  className={`hud-pill px-2.5 py-1 text-[10px] font-bold ${
                    voiceOn ? "text-amber-200" : "text-amber-200/40"
                  }`}
                >
                  {voiceOn ? "🔊 语音开" : "🔇 语音关"}
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="hud-pill px-2.5 py-1 text-[10px] text-amber-200"
                >
                  收起
                </button>
              </div>
            </div>

            {/* 消息列表 */}
            <div
              ref={listRef}
              className="h-32 overflow-y-auto px-3 space-y-1.5 mb-2"
            >
              {msgs.length === 0 && (
                <div className="text-center text-amber-200/30 text-[11px] py-8">
                  还没有消息，打个招呼吧～
                </div>
              )}
              {msgs.map((m) => (
                <div key={m.id} className="flex items-start gap-1.5">
                  <Avatar id={m.avatar} size={20} ring={false} />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] text-amber-300/70 mr-1">
                      {m.account}
                      {m.targetName ? ` → ${m.targetName}` : ""}:
                    </span>
                    <span
                      className={`text-[11px] text-amber-50 ${
                        m.kind === "emoji" || m.kind === "interact"
                          ? "text-base"
                          : ""
                      }`}
                    >
                      {m.content}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Tab */}
            <div className="flex gap-1 px-3 mb-2">
              {(
                [
                  ["quick", "💬 快捷语"],
                  ["emoji", "😀 表情"],
                  ["interact", "🎁 互动"],
                  ["text", "⌨️ 输入"],
                ] as const
              ).map(([k, label]) => (
                <button
                  key={k}
                  onClick={() => setTab(k)}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold ${
                    tab === k ? "gold-btn" : "hud-pill text-amber-200/60"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* 内容区 */}
            <div className="px-3 pb-3">
              {tab === "quick" && (
                <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto">
                  {QUICK_PHRASES.map((q) => (
                    <button
                      key={q}
                      disabled={busy}
                      onClick={() => send("quick", q)}
                      className="hud-pill px-2 py-2.5 text-[11px] text-amber-100 text-left active:opacity-70"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {tab === "emoji" && (
                <div className="grid grid-cols-8 gap-1.5 max-h-40 overflow-y-auto">
                  {EMOJIS.map((e) => (
                    <button
                      key={e}
                      disabled={busy}
                      onClick={() => send("emoji", e)}
                      className="hud-pill py-2 text-xl active:scale-90 transition"
                    >
                      {e}
                    </button>
                  ))}
                </div>
              )}

              {tab === "interact" && (
                <div>
                  <div className="text-[10px] text-amber-200/60 mb-1.5">
                    选择目标玩家
                  </div>
                  <div className="flex gap-1.5 overflow-x-auto no-scrollbar mb-2 pb-1">
                    {others.length === 0 && (
                      <span className="text-[10px] text-amber-200/35">
                        暂无其他玩家
                      </span>
                    )}
                    {others.map((p) => (
                      <button
                        key={p.userId}
                        onClick={() => setTarget(p.userId)}
                        className={`px-2.5 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap shrink-0 ${
                          target === p.userId
                            ? "gold-btn"
                            : "hud-pill text-amber-200/70"
                        }`}
                      >
                        {p.account}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {INTERACTIONS.map((it) => (
                      <button
                        key={it.id}
                        disabled={busy || !target}
                        onClick={() =>
                          target && send("interact", it.icon, target)
                        }
                        className={`hud-pill py-2 flex flex-col items-center gap-0.5 active:scale-90 transition ${
                          !target ? "opacity-40" : ""
                        }`}
                      >
                        <span className="text-lg">{it.icon}</span>
                        <span className="text-[9px] text-amber-200/70">
                          {it.label}
                        </span>
                      </button>
                    ))}
                  </div>
                  {!target && (
                    <div className="text-[10px] text-amber-200/40 mt-1.5 text-center">
                      请先选择一位目标玩家
                    </div>
                  )}
                </div>
              )}

              {tab === "text" && (
                <div className="flex gap-2">
                  <input
                    value={text}
                    maxLength={60}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && text.trim()) {
                        send("text", text.trim());
                        setText("");
                      }
                    }}
                    placeholder="说点什么…"
                    className="flex-1 min-w-0 px-3 py-2.5 rounded-xl bg-black/45 gold-border text-amber-50 text-sm outline-none placeholder-amber-200/25"
                  />
                  <button
                    disabled={busy || !text.trim()}
                    onClick={() => {
                      send("text", text.trim());
                      setText("");
                    }}
                    className="gold-btn px-4 rounded-xl text-xs"
                  >
                    发送
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

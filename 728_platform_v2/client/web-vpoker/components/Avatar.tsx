"use client";

import { useState } from "react";
import { assetUrl } from "@/lib/assets";

// 8 套头像：优先使用真实头像图片，加载失败时回退到渐变底 + Emoji
export const AVATARS: { id: string; emoji: string; from: string; to: string }[] =
  [
    { id: "1", emoji: "🤵", from: "#3b82f6", to: "#1e3a8a" },
    { id: "2", emoji: "💃", from: "#ec4899", to: "#831843" },
    { id: "3", emoji: "🤠", from: "#f59e0b", to: "#78350f" },
    { id: "4", emoji: "👑", from: "#a855f7", to: "#4c1d95" },
    { id: "5", emoji: "🐂", from: "#ef4444", to: "#7f1d1d" },
    { id: "6", emoji: "🎩", from: "#10b981", to: "#064e3b" },
    { id: "7", emoji: "🦊", from: "#f97316", to: "#7c2d12" },
    { id: "8", emoji: "🐼", from: "#64748b", to: "#1e293b" },
  ];

function Face({ id, sizePx }: { id: string; sizePx: number }) {
  const a = AVATARS.find((x) => x.id === String(id)) ?? AVATARS[0];
  const [err, setErr] = useState(false);
  if (err) {
    return (
      <div
        className="w-full h-full rounded-full grid place-items-center overflow-hidden"
        style={{
          background: `linear-gradient(160deg, ${a.from}, ${a.to})`,
          fontSize: sizePx ? sizePx * 0.52 : "1.4em",
          lineHeight: 1,
        }}
      >
        <span>{a.emoji}</span>
      </div>
    );
  }
  return (
    <img
      src={assetUrl(`/avatars/${a.id}.png`)}
      alt=""
      className="w-full h-full object-cover rounded-full"
      onError={() => setErr(true)}
    />
  );
}

export function Avatar({
  id = "1",
  size = 44,
  ring = true,
  online,
  fill,
}: {
  id?: string;
  size?: number;
  ring?: boolean;
  online?: boolean;
  fill?: boolean;
}) {
  if (fill) {
    return (
      <div className="relative w-full h-full rounded-full overflow-hidden">
        <Face id={id} sizePx={0} />
      </div>
    );
  }
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <div
        className={ring ? "frame-gold w-full h-full !p-[2px] !rounded-full" : ""}
        style={{ borderRadius: "9999px" }}
      >
        <div className="relative w-full h-full rounded-full overflow-hidden">
          <Face id={id} sizePx={size} />
        </div>
      </div>
      {online && (
        <span
          className="absolute bottom-0 right-0 rounded-full bg-green-400 border-2 border-[#0a1020]"
          style={{ width: size * 0.26, height: size * 0.26 }}
        />
      )}
    </div>
  );
}

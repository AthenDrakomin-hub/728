"use client";

import { motion } from "framer-motion";

const RED = "#c8102e";
const BLACK = "#1a1a20";

const PIPS: Record<string, [number, number][]> = {
  "2": [[50, 20], [50, 80]],
  "3": [[50, 20], [50, 50], [50, 80]],
  "4": [[30, 20], [70, 20], [30, 80], [70, 80]],
  "5": [[30, 20], [70, 20], [50, 50], [30, 80], [70, 80]],
  "6": [[30, 20], [70, 20], [30, 50], [70, 50], [30, 80], [70, 80]],
  "7": [[30, 20], [70, 20], [50, 35], [30, 50], [70, 50], [30, 80], [70, 80]],
  "8": [[30, 20], [70, 20], [50, 35], [30, 50], [70, 50], [50, 65], [30, 80], [70, 80]],
  "9": [[30, 18], [70, 18], [30, 40], [70, 40], [50, 50], [30, 62], [70, 62], [30, 84], [70, 84]],
  "10": [[30, 16], [70, 16], [50, 28], [30, 38], [70, 38], [30, 62], [70, 62], [50, 72], [30, 84], [70, 84]],
};

const FACE_ART: Record<string, string> = { J: "🤴", Q: "👸", K: "🤵", A: "" };

const SIZES = {
  xs: { w: 30, h: 42, idx: 9, pip: 6, center: 15 },
  sm: { w: 38, h: 54, idx: 11, pip: 7, center: 19 },
  md: { w: 48, h: 68, idx: 14, pip: 9, center: 26 },
  lg: { w: 60, h: 84, idx: 17, pip: 11, center: 32 },
};

/**
 * 动画扑克牌 - 使用 framer-motion
 * 发牌时有从牌堆飞入的动画
 */
export function AnimatedCard({
  label,
  hidden,
  size = "md",
  delay = 0,
  dim,
  highlight,
  dealFrom = { x: 0, y: -80 },
}: {
  label: string;
  hidden?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  delay?: number;
  dim?: boolean;
  highlight?: boolean;
  dealFrom?: { x: number; y: number };
}) {
  const d = SIZES[size];

  if (hidden || !label) {
    return (
      <motion.div
        initial={{ opacity: 0, x: dealFrom.x, y: dealFrom.y, rotate: -15, scale: 0.5 }}
        animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
        transition={{ duration: 0.35, delay: delay / 1000, ease: [0.2, 0.9, 0.3, 1.3] }}
        style={{
          width: d.w,
          height: d.h,
          borderRadius: "8%/6%",
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,214,102,0.20), transparent 62%), repeating-linear-gradient(45deg, #7f1020 0 4px, #9c1528 4px 8px), linear-gradient(180deg, #9c1528, #5d0a15)",
          boxShadow:
            "0 4px 9px rgba(0,0,0,0.6), inset 0 0 0 2px rgba(230,195,110,0.9), inset 0 0 0 4px rgba(120,15,30,0.95)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: dim ? 0.55 : 1,
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: d.center * 0.7, color: "rgba(240,210,130,0.92)" }}>♠</span>
      </motion.div>
    );
  }

  const suit = label.charAt(0);
  const rank = label.slice(1);
  const isRed = suit === "♥" || suit === "♦";
  const color = isRed ? RED : BLACK;
  const pips = PIPS[rank];
  const isFace = rank === "J" || rank === "Q" || rank === "K";
  const isAce = rank === "A";

  return (
    <motion.div
      initial={{ opacity: 0, x: dealFrom.x, y: dealFrom.y, rotate: -15, scale: 0.5 }}
      animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
      transition={{ duration: 0.35, delay: delay / 1000, ease: [0.2, 0.9, 0.3, 1.3] }}
      whileHover={highlight ? { scale: 1.05 } : undefined}
      style={{
        width: d.w,
        height: d.h,
        color,
        background: "linear-gradient(157deg, #ffffff 0%, #fdfcf8 42%, #f2efe4 100%)",
        borderRadius: "8%/6%",
        boxShadow: highlight
          ? "0 0 0 2px #ffd766, 0 0 16px rgba(255,215,102,0.85), 0 4px 9px rgba(0,0,0,0.6)"
          : "0 4px 9px rgba(0,0,0,0.6), 0 1px 2px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(0,0,0,0.18)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Georgia, 'Times New Roman', serif",
        lineHeight: 1,
        opacity: dim ? 0.5 : 1,
        flexShrink: 0,
        position: "relative",
      }}
    >
      {/* 左上角索引 */}
      <span
        style={{
          position: "absolute",
          top: "5%",
          left: "7%",
          fontWeight: 900,
          lineHeight: 0.85,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontSize: d.idx,
        }}
      >
        {rank}
        <span style={{ fontSize: d.idx * 0.85 }}>{suit}</span>
      </span>
      {/* 右下角索引 */}
      <span
        style={{
          position: "absolute",
          bottom: "5%",
          right: "7%",
          fontWeight: 900,
          lineHeight: 0.85,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontSize: d.idx,
          transform: "rotate(180deg)",
        }}
      >
        {rank}
        <span style={{ fontSize: d.idx * 0.85 }}>{suit}</span>
      </span>

      {/* 中央图案 */}
      {isAce && (
        <span style={{ fontSize: d.center, fontWeight: 900 }}>{suit}</span>
      )}
      {isFace && (
        <span
          style={{
            display: "grid",
            placeItems: "center",
            borderRadius: 3,
            fontSize: d.center * 0.82,
            width: "54%",
            height: "48%",
            background: "linear-gradient(160deg, rgba(200,16,46,0.10), rgba(212,175,55,0.22))",
            border: `1px solid ${color}55`,
          }}
        >
          {FACE_ART[rank]}
        </span>
      )}
      {pips &&
        pips.map(([x, y], i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              fontSize: d.pip * 1.7,
              fontWeight: 900,
              lineHeight: 1,
              transform: `translate(-50%,-50%) ${y > 55 ? "rotate(180deg)" : ""}`,
            }}
          >
            {suit}
          </span>
        ))}
    </motion.div>
  );
}

"use client";

const RED = "#c8102e";
const BLACK = "#1a1a20";

// 标准扑克点数排布（列坐标 x%, 行坐标 y%，翻转标记）
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

export function PlayingCard({
  label,
  hidden,
  size = "md",
  delay = 0,
  dim,
  highlight,
}: {
  label: string;
  hidden?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  delay?: number;
  dim?: boolean;
  highlight?: boolean;
}) {
  const d = {
    xs: { w: 30, h: 42, idx: 9, pip: 6, center: 15 },
    sm: { w: 38, h: 54, idx: 11, pip: 7, center: 19 },
    md: { w: 48, h: 68, idx: 14, pip: 9, center: 26 },
    lg: { w: 60, h: 84, idx: 17, pip: 11, center: 32 },
  }[size];

  if (hidden || !label) {
    return (
      <div
        className="pcard-back shrink-0"
        style={{
          width: d.w,
          height: d.h,
          animationDelay: `${delay}ms`,
          opacity: dim ? 0.55 : 1,
        }}
      >
        <span
          className="pcard-back-emblem"
          style={{ fontSize: d.center * 0.7 }}
        >
          ♠
        </span>
      </div>
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
    <div
      className={`pcard shrink-0 relative ${highlight ? "pcard-hl" : ""}`}
      style={{
        width: d.w,
        height: d.h,
        color,
        animationDelay: `${delay}ms`,
        opacity: dim ? 0.5 : 1,
      }}
    >
      {/* 左上角索引 */}
      <span
        className="absolute font-black leading-[0.85] flex flex-col items-center"
        style={{ top: "5%", left: "7%", fontSize: d.idx }}
      >
        {rank}
        <span style={{ fontSize: d.idx * 0.85 }}>{suit}</span>
      </span>
      {/* 右下角索引（旋转180°）*/}
      <span
        className="absolute font-black leading-[0.85] flex flex-col items-center rotate-180"
        style={{ bottom: "5%", right: "7%", fontSize: d.idx }}
      >
        {rank}
        <span style={{ fontSize: d.idx * 0.85 }}>{suit}</span>
      </span>

      {/* 中央图案 */}
      {isAce && (
        <span style={{ fontSize: d.center }} className="font-black">
          {suit}
        </span>
      )}
      {isFace && (
        <span
          className="grid place-items-center rounded-[3px]"
          style={{
            fontSize: d.center * 0.82,
            width: "54%",
            height: "48%",
            background:
              "linear-gradient(160deg, rgba(200,16,46,0.10), rgba(212,175,55,0.22))",
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
            className="absolute font-black leading-none"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              fontSize: d.pip * 1.7,
              transform: `translate(-50%,-50%) ${y > 55 ? "rotate(180deg)" : ""}`,
            }}
          >
            {suit}
          </span>
        ))}
    </div>
  );
}

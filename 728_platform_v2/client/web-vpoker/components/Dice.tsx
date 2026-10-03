"use client";

import { useState, useEffect, useRef } from "react";

/**
 * 骰子组件 - 纯2D实现，无任何3D变换，兼容所有WebView
 * value 变化时播放掷骰动画（快速切换点数 + 轻微抖动）
 */

const DOTS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[25, 25], [75, 75]],
  3: [[25, 25], [50, 50], [75, 75]],
  4: [[25, 25], [75, 25], [25, 75], [75, 75]],
  5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
  6: [[25, 20], [75, 20], [25, 50], [75, 50], [25, 80], [75, 80]],
};

function DiceFace({ value, size }: { value: number; size: number }) {
  const dots = DOTS[value] || DOTS[1];
  const dotSize = Math.max(4, size * 0.18);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.18,
        background: "linear-gradient(145deg, #ffffff, #e8e0d0)",
        boxShadow:
          "inset 0 2px 4px rgba(255,255,255,0.9), inset 0 -2px 4px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.25)",
        position: "relative",
        flexShrink: 0,
        display: "inline-block",
      }}
    >
      {dots.map(([x, y], i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            width: dotSize,
            height: dotSize,
            left: `${x}%`,
            top: `${y}%`,
            transform: "translate(-50%, -50%)",
            borderRadius: "50%",
            background: "radial-gradient(circle at 35% 35%, #555, #111)",
            boxShadow: "inset 0 1px 1px rgba(0,0,0,0.6)",
          }}
        />
      ))}
    </div>
  );
}

/**
 * 带掷骰动画的骰子（纯2D）
 * value 从 null 变为有值，或值变化时，播放 1 秒掷骰动画
 */
export function RollingDiceFM({
  value,
  size = 36,
}: {
  value: number | null;
  size?: number;
}) {
  const [displayValue, setDisplayValue] = useState<number>(value ?? 1);
  const [rolling, setRolling] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevValue = useRef<number | null>(null);

  useEffect(() => {
    // value 从 null 变为有值，或值发生变化时触发动画
    if (value != null && (prevValue.current === null || prevValue.current !== value)) {
      setRolling(true);
      // 掷骰过程中快速切换随机点数（每100ms换一次）
      intervalRef.current = setInterval(() => {
        setDisplayValue(Math.floor(Math.random() * 6) + 1);
      }, 100);
      // 1秒后停止，显示最终值
      timeoutRef.current = setTimeout(() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setDisplayValue(value);
        setRolling(false);
      }, 1000);
      prevValue.current = value;
    }
    if (value == null) {
      prevValue.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [value]);

  if (value == null) {
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: size * 0.18,
          background: "rgba(0,0,0,0.4)",
          border: "1px solid rgba(212,175,55,0.3)",
          display: "inline-block",
          flexShrink: 0,
        }}
      />
    );
  }

  return (
    <div
      style={{
        display: "inline-block",
        flexShrink: 0,
        animation: rolling ? "dice-shake 0.12s infinite" : "none",
      }}
    >
      <DiceFace value={displayValue} size={size} />
    </div>
  );
}

/** 兼容旧导出 */
export const Dice3D = RollingDiceFM;

"use client";

import { useState } from "react";
import { vibrateLight } from "@/lib/sounds";

const CHIP_STYLE: Record<number, string> = {
  2: "chip-blue",
  5: "chip-green",
  10: "",
  50: "chip-black",
  100: "chip-gold",
};

/**
 * 筹码面额下注器：点面额累加，达封顶后禁用，确认后提交总额。
 * 不使用倍数计算 —— 例如高级场想下 40，点 4 次「10」即可。
 */
export function ChipPicker({
  chips,
  min,
  max,
  title = "选择下注筹码",
  confirmLabel = "确认下注",
  onCancel,
  onConfirm,
  busy,
}: {
  chips: number[];
  min: number;
  max: number;
  title?: string;
  confirmLabel?: string;
  onCancel?: () => void;
  onConfirm: (amount: number) => void;
  busy?: boolean;
}) {
  const [amount, setAmount] = useState(0);
  const [stack, setStack] = useState<number[]>([]);

  const add = (v: number) => {
    if (amount + v > max) return;
    setAmount(amount + v);
    setStack([...stack, v]);
    vibrateLight();
  };
  const undo = () => {
    if (!stack.length) return;
    const last = stack[stack.length - 1];
    setAmount(amount - last);
    setStack(stack.slice(0, -1));
  };
  const clear = () => {
    setAmount(0);
    setStack([]);
  };

  const ok = amount >= min && amount <= max;

  return (
    <div className="mb-1">
      {/* 顶部：当前累计 */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] text-amber-200/70">{title}</span>
        <span className="text-[10px] text-amber-200/50">
          封顶 {max.toLocaleString()}
        </span>
      </div>

      <div className="flex items-center justify-center gap-2 mb-2">
        <div className="seat-coin px-4 py-1.5 flex items-center gap-2">
          <span className="chip inline-block" style={{ width: 16, height: 16 }} />
          <span className="gold-text font-black text-2xl leading-none">
            {amount.toLocaleString()}
          </span>
        </div>
        {stack.length > 0 && (
          <>
            <button
              onClick={undo}
              className="hud-pill px-2.5 py-2 text-[11px] text-amber-200 font-bold"
            >
              ↩ 撤销
            </button>
            <button
              onClick={clear}
              className="hud-pill px-2.5 py-2 text-[11px] text-red-300 font-bold"
            >
              清空
            </button>
          </>
        )}
      </div>

      {/* 面额按钮 */}
      <div className="flex items-center justify-center gap-2.5 mb-2.5">
        {chips.map((c) => {
          const disabled = amount + c > max;
          return (
            <button
              key={c}
              disabled={disabled}
              onClick={() => add(c)}
              className={`chip ${CHIP_STYLE[c] ?? ""} relative grid place-items-center transition ${
                disabled ? "opacity-35" : "active:scale-90"
              }`}
              style={{ width: 54, height: 54 }}
            >
              <span
                className="relative z-10 font-black text-slate-900"
                style={{ fontSize: c >= 100 ? 13 : 15 }}
              >
                {c}
              </span>
            </button>
          );
        })}
      </div>

      {/* 确认 / 取消 */}
      <div className="flex gap-2">
        {onCancel && (
          <button
            onClick={onCancel}
            className="hud-pill px-4 py-3 text-xs text-amber-200 font-bold"
          >
            取消
          </button>
        )}
        <button
          onClick={() => onConfirm(amount)}
          disabled={!ok || busy}
          className="flex-1 gold-btn py-3 rounded-xl text-sm"
        >
          {busy
            ? "提交中…"
            : amount === 0
            ? `请选择筹码（最低 ${min}）`
            : `${confirmLabel} ${amount.toLocaleString()}`}
        </button>
      </div>
    </div>
  );
}

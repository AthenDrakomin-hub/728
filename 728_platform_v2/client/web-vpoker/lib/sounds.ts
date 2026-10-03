"use client";

/**
 * 游戏音效工具 — 使用 Web Audio API 实时生成，无需音频文件
 * 高端俱乐部级别的精致音效
 */

let ctx: AudioContext | null = null;
let enabled = true;
let userInteracted = false;

// 监听用户第一次交互，之后才允许创建AudioContext
if (typeof window !== "undefined") {
  const unlock = () => {
    userInteracted = true;
    if (ctx && ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
    // 移除监听器
    window.removeEventListener("click", unlock);
    window.removeEventListener("touchstart", unlock);
    window.removeEventListener("keydown", unlock);
  };
  window.addEventListener("click", unlock, { once: true });
  window.addEventListener("touchstart", unlock, { once: true });
  window.addEventListener("keydown", unlock, { once: true });
}

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  // 用户未交互前不创建AudioContext，避免浏览器自动播放限制警告
  if (!userInteracted) return null;
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }
  return ctx;
}

export function setSoundEnabled(v: boolean) {
  enabled = v;
}

export function isSoundEnabled() {
  return enabled;
}

/** 通用音调播放 */
function tone(
  freq: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.15,
  delay = 0
) {
  if (!enabled) return;
  const ac = getCtx();
  if (!ac) return;
  const t0 = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(volume, t0 + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

/** 噪声爆发（用于发牌、骰子等） */
function noiseBurst(
  duration: number,
  filterFreq: number,
  volume = 0.12,
  delay = 0,
  filterType: BiquadFilterType = "bandpass"
) {
  if (!enabled) return;
  const ac = getCtx();
  if (!ac) return;
  const t0 = ac.currentTime + delay;
  const bufferSize = Math.floor(ac.sampleRate * duration);
  const buffer = ac.createBuffer(1, bufferSize, ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }
  const src = ac.createBufferSource();
  src.buffer = buffer;
  const filter = ac.createBiquadFilter();
  filter.type = filterType;
  filter.frequency.value = filterFreq;
  filter.Q.value = 1.5;
  const gain = ac.createGain();
  gain.gain.setValueAtTime(volume, t0);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
  src.connect(filter);
  filter.connect(gain);
  gain.connect(ac.destination);
  src.start(t0);
  src.stop(t0 + duration);
}

// ==================== 游戏音效 ====================

/** 荷官发牌声：清脆的"唰"声 */
export function playDealCard() {
  noiseBurst(0.12, 3000, 0.08, 0, "highpass");
  tone(800, 0.08, "triangle", 0.06, 0.02);
}

/** 多张牌连发 */
export function playDealCards(count = 2) {
  for (let i = 0; i < count; i++) {
    setTimeout(() => playDealCard(), i * 80);
  }
}

/** 骰子滚动声：连续碰撞声 */
export function playDiceRoll() {
  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      noiseBurst(0.05, 1500, 0.1, 0, "bandpass");
      tone(200 + Math.random() * 100, 0.04, "square", 0.05);
    }, i * 60);
  }
  // 落定声
  setTimeout(() => {
    noiseBurst(0.08, 800, 0.12, 0, "lowpass");
    tone(150, 0.1, "sine", 0.1);
  }, 400);
}

/** 筹码下注声：清脆的"叮"声 */
export function playChipBet() {
  tone(1200, 0.08, "sine", 0.12);
  tone(1800, 0.06, "sine", 0.08, 0.02);
  noiseBurst(0.04, 4000, 0.05, 0, "highpass");
}

/** 筹码堆叠声 */
export function playChipStack() {
  tone(900, 0.05, "sine", 0.1);
  setTimeout(() => tone(1100, 0.05, "sine", 0.08), 40);
}

/** 翻牌声：短促的"啪"声 */
export function playFlipCard() {
  noiseBurst(0.06, 2000, 0.1, 0, "bandpass");
  tone(600, 0.05, "triangle", 0.08, 0.01);
}

/** 赢家庆祝：上升音阶+光芒 */
export function playWin() {
  const notes = [523, 659, 784, 1047]; // C5 E5 G5 C6
  notes.forEach((f, i) => {
    tone(f, 0.25, "sine", 0.12, i * 0.1);
    tone(f * 2, 0.2, "triangle", 0.06, i * 0.1 + 0.02);
  });
  // 光芒声
  setTimeout(() => {
    noiseBurst(0.4, 6000, 0.06, 0, "highpass");
  }, 0.3);
}

/** 大牌型（同花顺/豹子/牛牛等）：震撼音效 */
export function playBigHand() {
  // 低沉前奏
  tone(220, 0.15, "sawtooth", 0.1);
  setTimeout(() => {
    // 上升爆发
    const notes = [440, 554, 659, 880, 1109];
    notes.forEach((f, i) => {
      tone(f, 0.3, "sine", 0.14, i * 0.08);
      tone(f * 1.5, 0.25, "triangle", 0.08, i * 0.08 + 0.02);
    });
  }, 150);
  // 定音鼓
  noiseBurst(0.3, 200, 0.15, 0.15, "lowpass");
}

/** 弃牌声：低沉的"嗒"声 */
export function playFold() {
  tone(200, 0.1, "sine", 0.1);
  noiseBurst(0.05, 500, 0.08, 0, "lowpass");
}

/** 跟注/过牌声：轻柔提示 */
export function playCall() {
  tone(660, 0.08, "sine", 0.08);
}

/** 加注声：上升音调 */
export function playRaise() {
  tone(440, 0.06, "sine", 0.1);
  setTimeout(() => tone(660, 0.08, "sine", 0.1), 50);
  setTimeout(() => tone(880, 0.1, "sine", 0.12), 100);
}

/** All-in：震撼全押声 */
export function playAllIn() {
  // 筹码倾泻
  for (let i = 0; i < 8; i++) {
    setTimeout(() => playChipBet(), i * 30);
  }
  // 重音
  setTimeout(() => {
    tone(110, 0.3, "sawtooth", 0.15);
    noiseBurst(0.2, 300, 0.12, 0, "lowpass");
  }, 250);
}

/** 比牌对决：紧张对峙声 */
export function playCompare() {
  // 低沉持续音
  tone(150, 0.4, "sawtooth", 0.08);
  // 对决冲击
  setTimeout(() => {
    noiseBurst(0.15, 1000, 0.15, 0, "bandpass");
    tone(330, 0.2, "square", 0.1);
  }, 300);
}

/** 轮到玩家：提示音 */
export function playTurn() {
  tone(880, 0.1, "sine", 0.08);
  setTimeout(() => tone(1100, 0.12, "sine", 0.06), 100);
}

/** 游戏开始：发牌前提示 */
export function playGameStart() {
  tone(440, 0.1, "sine", 0.1);
  setTimeout(() => tone(554, 0.1, "sine", 0.1), 100);
  setTimeout(() => tone(659, 0.15, "sine", 0.12), 200);
}

/** 输牌：低沉下降音 */
export function playLose() {
  tone(440, 0.15, "sine", 0.1);
  setTimeout(() => tone(330, 0.2, "sine", 0.1), 100);
  setTimeout(() => tone(220, 0.3, "sine", 0.12), 250);
}

// ==================== 震动反馈 ====================
let vibrateEnabled = true;
export function setVibrateEnabled(v: boolean) { vibrateEnabled = v; }
export function isVibrateEnabled() { return vibrateEnabled; }

/** 轻触震动（按钮点击） */
export function vibrateLight() {
  if (!vibrateEnabled) return;
  if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(10);
}

/** 中等震动（轮到玩家、跟注） */
export function vibrateMedium() {
  if (!vibrateEnabled) return;
  if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(25);
}

/** 强烈震动（All-in、赢牌） */
export function vibrateHeavy() {
  if (!vibrateEnabled) return;
  if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate([30, 40, 30]);
}

/** 赢牌庆祝震动 */
export function vibrateWin() {
  if (!vibrateEnabled) return;
  if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate([50, 30, 50, 30, 80]);
}

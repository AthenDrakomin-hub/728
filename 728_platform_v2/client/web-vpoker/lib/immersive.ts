"use client";

/**
 * 沉浸式横屏模式工具
 * 
 * 策略：
 * 1. 进入全屏（支持原生Fullscreen API，含webkit前缀兼容）
 * 2. 提示用户手动旋转手机到横屏（iOS不支持Orientation Lock）
 * 3. 横屏时CSS自动放大牌桌（通过.immersive-active类，不依赖媒体查询）
 */

export type ImmersiveMode = "fullscreen" | "none";

/** 检测是否支持全屏API */
export function supportsFullscreen(): boolean {
  if (typeof document === "undefined") return false;
  const el = document.documentElement as any;
  return !!(
    el.requestFullscreen ||
    el.webkitRequestFullscreen ||
    el.webkitEnterFullscreen
  );
}

/** 进入全屏 */
export async function enterFullscreen(): Promise<boolean> {
  try {
    const el = document.documentElement as any;
    if (document.fullscreenElement || (document as any).webkitFullscreenElement) return true;
    if (el.requestFullscreen) {
      await el.requestFullscreen();
      return true;
    }
    if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
      return true;
    }
    if (el.webkitEnterFullscreen) {
      el.webkitEnterFullscreen();
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/** 退出全屏 */
export async function exitFullscreen(): Promise<void> {
  try {
    if (document.exitFullscreen) {
      await document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    }
  } catch {
    // ignore
  }
}

/** 检测当前是否横屏 */
export function isLandscape(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth > window.innerHeight;
}

/**
 * 进入沉浸式模式
 * 1. 尝试进入全屏
 * 2. 添加immersive-active类
 * 3. 如果是竖屏，提示用户旋转
 */
export async function enterImmersive(): Promise<"fullscreen" | "css-only"> {
  document.documentElement.classList.add("immersive-active");
  const fsOk = await enterFullscreen();
  return fsOk ? "fullscreen" : "css-only";
}

/** 退出沉浸式模式 */
export async function exitImmersive(): Promise<void> {
  document.documentElement.classList.remove("immersive-active");
  await exitFullscreen();
}

/** 监听全屏变化，自动退出immersive-active */
export function onFullscreenChange(callback: (isFullscreen: boolean) => void): () => void {
  const handler = () => {
    const isFs = !!(document.fullscreenElement || (document as any).webkitFullscreenElement);
    callback(isFs);
  };
  document.addEventListener("fullscreenchange", handler);
  document.addEventListener("webkitfullscreenchange", handler);
  return () => {
    document.removeEventListener("fullscreenchange", handler);
    document.removeEventListener("webkitfullscreenchange", handler);
  };
}

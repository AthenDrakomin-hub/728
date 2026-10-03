"use client";

/**
 * APP环境（file://协议）下，绝对路径跳转会失败。
 * 统一使用相对路径导航，自动计算当前页面深度，确保浏览器和APP都能正常工作。
 */

function isAppEnvironment(): boolean {
  if (typeof window === "undefined") return false;
  // HBuilderX 5+ App环境：file://协议 或 存在plus对象
  return window.location.protocol === "file:" || typeof (window as any).plus !== "undefined";
}

/**
 * 计算当前页面相对于根目录的深度
 * 例如：
 *   /index.html -> 0
 *   /lobby/index.html -> 1
 *   /room/123/index.html -> 2
 */
function getDepth(): number {
  if (typeof window === "undefined") return 0;
  const path = window.location.pathname;
  // 移除文件名，只保留目录部分
  const dirPath = path.substring(0, path.lastIndexOf("/"));
  // 计算目录层数（排除空字符串）
  const parts = dirPath.split("/").filter(Boolean);
  // 找到out目录的位置，out目录之后的就是应用内路径
  const outIndex = parts.indexOf("out");
  if (outIndex >= 0) {
    return parts.length - outIndex - 1;
  }
  // 如果路径包含www（HBuilderX Android常见路径），找www之后的深度
  const wwwIndex = parts.indexOf("www");
  if (wwwIndex >= 0) {
    return Math.max(0, parts.length - wwwIndex - 2);
  }
  // fallback：如果路径很短（小于3层），假设在根目录
  if (parts.length <= 2) return 0;
  // 否则根据路径中的 / 数量估算（减去可能的系统路径）
  return Math.max(0, parts.length - 3);
}

/**
 * 页面跳转（替代 window.location.href）
 * 在APP环境下，HTML中已添加<base href>标签，直接使用相对于根目录的路径即可
 */
export function navigateTo(path: string): void {
  if (typeof window === "undefined") return;

  if (isAppEnvironment()) {
    // 移除开头的 /，base标签会自动处理相对路径
    const cleanPath = path.replace(/^\//, "");
    // 确保路径以 / 结尾，让WebView自动加载index.html
    const target = cleanPath.endsWith("/") || cleanPath.includes(".") ? cleanPath : `${cleanPath}/`;
    window.location.href = target;
  } else {
    window.location.href = path;
  }
}

/**
 * 返回首页
 */
export function navigateHome(): void {
  navigateTo("/");
}

/**
 * 返回大厅
 */
export function navigateLobby(): void {
  navigateTo("/lobby");
}

/**
 * 跳转到房间
 */
export function navigateRoom(roomId: number | string): void {
  navigateTo(`/room/${roomId}`);
}

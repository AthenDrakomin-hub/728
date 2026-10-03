"use client";

/**
 * 资源路径工具
 * APP环境(file://)下，绝对路径会解析失败，需要转相对路径
 */

function isAppEnvironment(): boolean {
  if (typeof window === "undefined") return false;
  // HBuilderX 5+ App环境：file://协议 或 存在plus对象
  return window.location.protocol === "file:" || typeof (window as any).plus !== "undefined";
}

/**
 * 计算当前页面相对于根目录的深度
 */
function getDepth(): number {
  if (typeof window === "undefined") return 0;
  const path = window.location.pathname;
  const dirPath = path.substring(0, path.lastIndexOf("/"));
  const parts = dirPath.split("/").filter(Boolean);
  const outIndex = parts.indexOf("out");
  if (outIndex >= 0) {
    return parts.length - outIndex - 1;
  }
  const wwwIndex = parts.indexOf("www");
  if (wwwIndex >= 0) {
    return Math.max(0, parts.length - wwwIndex - 2);
  }
  if (parts.length <= 2) return 0;
  return Math.max(0, parts.length - 3);
}

/**
 * 获取正确的资源路径
 * @param absolutePath 以/开头的绝对路径，如 /art/texas.jpg
 */
export function assetUrl(absolutePath: string): string {
  if (!isAppEnvironment()) return absolutePath;
  if (!absolutePath.startsWith("/")) return absolutePath;
  // 有base标签，直接使用相对路径（去掉开头的/）
  return absolutePath.substring(1);
}

/**
 * 获取图片src（用于next/image或img标签）
 */
export function imgSrc(path: string): string {
  return assetUrl(path);
}

/**
 * 获取CSS背景图url
 */
export function bgUrl(path: string): string {
  return `url("${assetUrl(path)}")`;
}

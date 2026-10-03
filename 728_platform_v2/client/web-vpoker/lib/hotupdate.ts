"use client";

/**
 * APP热更新工具（HBuilder WGT）
 * 仅在APP环境(file:// + plus对象存在)下生效
 */

interface VersionInfo {
  version: string;
  wgtUrl: string | null;
  forceUpdate: boolean;
  changelog: string;
}

interface UpdateCallbacks {
  onProgress?: (percent: number, status: string) => void;
  onForceUpdate?: (info: VersionInfo) => void;
}

/**
 * 检测是否为APP环境
 */
function isAppEnvironment(): boolean {
  if (typeof window === "undefined") return false;
  return window.location.protocol === "file:" && typeof (window as any).plus !== "undefined";
}

/**
 * 比较版本号
 * 返回 1: a > b, -1: a < b, 0: a == b
 */
function compareVersion(a: string, b: string): number {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    if ((pa[i] || 0) > (pb[i] || 0)) return 1;
    if ((pa[i] || 0) < (pb[i] || 0)) return -1;
  }
  return 0;
}

/**
 * 获取当前APP版本
 */
function getCurrentVersion(): Promise<string> {
  return new Promise((resolve) => {
    if (!isAppEnvironment()) {
      resolve("0.0.0");
      return;
    }
    try {
      (window as any).plus.runtime.getProperty(
        (window as any).plus.runtime.appid,
        (info: any) => {
          resolve(info.version || "1.0.0");
        }
      );
    } catch {
      resolve("1.0.0");
    }
  });
}

/**
 * 上报错误到服务器
 */
async function reportError(error: any, context: { type: string; page?: string }): Promise<void> {
  try {
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
    await fetch(`${apiUrl}/api/app/error`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        platform: (window as any).plus?.runtime?.platform || "unknown",
        version: "1.0.1",
        device: navigator.userAgent || "",
        errorType: context.type,
        errorMessage: error?.message || String(error),
        stackTrace: error?.stack?.slice(0, 2000),
        page: context.page || window.location.href,
        timestamp: new Date().toISOString(),
      }),
    });
  } catch (e) {
    console.error("[ERROR_REPORT] 上报失败:", e);
  }
}

/**
 * 执行WGT下载和安装
 */
function downloadAndInstall(wgtUrl: string, onProgress?: (percent: number, status: string) => void): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      onProgress?.(10, "下载更新中...");

      const dtask = (window as any).plus.downloader.createDownload(
        wgtUrl,
        { method: "GET" },
        (d: any, status: number) => {
          if (status === 200) {
            onProgress?.(90, "安装更新中...");
            (window as any).plus.runtime.install(
              d.filename,
              { force: false },
              () => {
                onProgress?.(100, "更新完成，重启生效");
                setTimeout(() => {
                  (window as any).plus.runtime.restart();
                }, 1500);
                resolve(true);
              },
              (e: any) => {
                console.error("WGT安装失败:", e);
                reportError(e, { type: "install_error" });
                onProgress?.(0, "更新失败，请重启APP重试");
                resolve(false);
              }
            );
          } else {
            console.error("WGT下载失败:", status);
            reportError(new Error(`下载失败: ${status}`), { type: "download_error" });
            onProgress?.(0, "下载失败，请检查网络");
            resolve(false);
          }
        }
      );

      dtask.addEventListener("statechanged", (task: any) => {
        if (task.state === 3 && task.totalSize) {
          const percent = Math.round((task.downloadedSize / task.totalSize) * 80) + 10;
          onProgress?.(percent, `下载中 ${percent}%`);
        }
      });

      dtask.start();
    } catch (e) {
      console.error("热更新异常:", e);
      reportError(e, { type: "update_error" });
      resolve(false);
    }
  });
}

/**
 * 检测并执行热更新
 * @returns 是否有更新（强制更新时会阻塞直到更新完成）
 */
export async function checkAndUpdate(callbacks?: UpdateCallbacks): Promise<boolean> {
  if (!isAppEnvironment()) return false;

  try {
    callbacks?.onProgress?.(0, "检测更新中...");

    // 1. 获取当前版本
    const currentVersion = await getCurrentVersion();

    // 2. 请求服务器版本信息
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
    const resp = await fetch(`${apiUrl}/api/app/version`);
    if (!resp.ok) {
      console.error("获取版本信息失败:", resp.status);
      return false;
    }

    const info: VersionInfo = await resp.json();
    if (!info.wgtUrl) return false;

    // 3. 比较版本
    if (compareVersion(info.version, currentVersion) <= 0) {
      return false;
    }

    // 4. 强制更新：通知UI，然后立即开始下载
    if (info.forceUpdate) {
      callbacks?.onForceUpdate?.(info);
      await downloadAndInstall(info.wgtUrl, callbacks?.onProgress);
      return true;
    }

    // 5. 普通更新：静默下载安装
    callbacks?.onProgress?.(10, `发现新版本 v${info.version}`);
    return await downloadAndInstall(info.wgtUrl, callbacks?.onProgress);
  } catch (e) {
    console.error("检测更新失败:", e);
    reportError(e, { type: "check_update_error" });
    return false;
  }
}

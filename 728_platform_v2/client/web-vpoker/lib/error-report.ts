/**
 * APP错误捕获与上报工具
 */

interface ErrorReport {
  platform: string;
  version: string;
  device: string;
  osVersion: string;
  errorType: string;
  errorMessage: string;
  stackTrace?: string;
  page: string;
  timestamp: string;
  additional?: Record<string, any>;
}

/**
 * 上报错误到服务器
 */
export async function reportError(error: Error | string, context: {
  type?: string;
  page?: string;
  additional?: Record<string, any>;
}): Promise<void> {
  const report: ErrorReport = {
    platform: (window as any).plus?.runtime?.platform || 'web',
    version: '1.0.1',
    device: navigator.userAgent || '',
    osVersion: '',
    errorType: context.type || 'unknown',
    errorMessage: error instanceof Error ? error.message : String(error),
    stackTrace: error instanceof Error && error.stack ? error.stack.slice(0, 2000) : undefined,
    page: context.page || window.location.href,
    timestamp: new Date().toISOString(),
    ...context.additional,
  };

  try {
    const apiUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '');
    await fetch(`${apiUrl}/api/app/error`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report),
    });
    console.log('[ERROR_REPORT] 错误已上报:', report.errorMessage);
  } catch (e) {
    console.error('[ERROR_REPORT] 上报失败:', e);
  }
}

/**
 * 全局错误捕获（仅APP环境）
 */
export function setupGlobalErrorCapture(): void {
  if (typeof window === 'undefined') return;
  
  // 捕获全局未处理错误
  window.addEventListener('error', (event) => {
    console.error('[APP ERROR] 捕获到错误:', event.error?.message || event.message);
    reportError(event.error || new Error(String(event.message)), {
      type: 'runtime',
      page: (event.target as any)?.location?.href,
    });
  });

  // 捕获未处理的Promise拒绝
  window.addEventListener('unhandledrejection', (event) => {
    console.error('[APP ERROR] 未处理的Promise拒绝:', event.reason);
    reportError(new Error(String(event.reason?.message || event.reason)), {
      type: 'promise',
      page: window.location.href,
    });
    event.preventDefault();
  });
}

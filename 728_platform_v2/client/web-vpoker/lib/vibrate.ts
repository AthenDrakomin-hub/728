/**
 * 用户手势检测
 * 解决 navigator.vibrate 和 AudioContext 的浏览器自动播放限制
 */

let hasUserGesture = false;

/**
 * 标记用户已进行交互
 */
export function markUserGesture(): void {
  if (!hasUserGesture) {
    hasUserGesture = true;
    console.log("[Gesture] 用户手势已激活");
  }
}

/**
 * 检查是否有用户手势
 */
export function hasGesture(): boolean {
  return hasUserGesture;
}

/**
 * 初始化手势监听（在根组件调用）
 */
export function initGestureListener(): void {
  if (typeof window === "undefined") return;
  
  const listeners: { type: string; handler: () => void }[] = [];
  
  const register = (type: string) => {
    const handler = () => markUserGesture();
    window.addEventListener(type, handler, { once: true });
    listeners.push({ type, handler });
  };
  
  // 监听各种用户交互事件
  register("click");
  register("touchstart");
  register("keydown");
  register("touchmove");
  
  // 10秒后自动解锁（保守策略）
  setTimeout(() => {
    markUserGesture();
  }, 10000);
}

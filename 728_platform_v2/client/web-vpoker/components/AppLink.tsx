"use client";

import { navigateTo } from "@/lib/navigation";

/**
 * APP安全链接组件
 * 替代next/link，在file://协议下自动转换为相对路径跳转
 */
export function AppLink({
  href,
  children,
  className,
  style,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}) {
  return (
    <a
      href={href}
      className={className}
      style={style}
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
        navigateTo(href);
      }}
    >
      {children}
    </a>
  );
}

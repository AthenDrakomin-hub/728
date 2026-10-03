"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AppLink } from "@/components/AppLink";

interface Item {
  name: string;
  desc: string;
  file: string;
  url: string;
  download: string;
  width: number;
  height: number;
  size: string;
  type: string;
  usedIn: string;
}
interface Manifest {
  origin: string;
  count: number;
  totalSize: string;
  zip: { url: string; download: string };
  app: { url: string; download: string };
  assets: Item[];
}

export default function AssetsPage() {
  const [m, setM] = useState<Manifest | null>(null);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    fetch("/api/assets", { cache: "no-store" })
      .then((r) => r.json())
      .then(setM)
      .catch(() => {});
  }, []);

  function copy(text: string, key: string) {
    navigator.clipboard?.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 1600);
  }

  if (!m)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="stage" />
        <div className="gold-title text-xl animate-pulse">加载素材…</div>
      </div>
    );

  const allUrls = m.assets.map((a) => a.url).join("\n");

  return (
    <div className="min-h-screen relative pb-12">
      <div className="stage" />
      <div className="relative z-10 max-w-3xl mx-auto px-3 py-4">
        <div className="flex items-center justify-between mb-4">
          <AppLink href="/" className="panel px-3 py-2 rounded-lg gold-ink text-xs">
            ← 返回
          </AppLink>
          <div className="gold-title text-lg font-black">图片素材下载</div>
          <div className="w-14" />
        </div>

        {/* 打包下载 */}
        <div className="frame-gold mb-3">
          <div className="frame-inner p-4 bg-gradient-to-b from-[#1b2a4d] to-[#0a1020]">
            <div className="gold-text font-bold text-sm mb-1">
              📦 全部素材打包（{m.count} 个文件 · {m.totalSize}）
            </div>
            <div className="text-[10px] text-amber-200/50 mb-3 break-all">
              {m.zip.url}
            </div>
            <div className="flex gap-2">
              <a
                href={m.zip.download}
                className="gold-btn flex-1 text-center py-3 rounded-xl text-sm"
              >
                ⬇ 下载 ZIP
              </a>
              <button
                onClick={() => copy(m.zip.url, "zip")}
                className="panel px-4 py-3 rounded-xl text-xs text-amber-200 font-bold whitespace-nowrap"
              >
                {copied === "zip" ? "已复制" : "复制链接"}
              </button>
            </div>
          </div>
        </div>

        {/* App 打包工程 */}
        <div className="frame-gold mb-3">
          <div className="frame-inner p-4 bg-gradient-to-b from-[#2a1f0e] to-[#0a1020]">
            <div className="gold-text font-bold text-sm mb-1">
              📱 HBuilderX 打包工程（安卓 / 苹果 App）
            </div>
            <div className="text-[10px] text-amber-200/55 mb-3 leading-relaxed">
              开箱即用的 5+App 工程，含 16 个尺寸图标、4 张启动图、
              manifest 配置与完整打包说明。改一行域名即可打包。
            </div>
            <a
              href={m.app.download}
              className="gold-btn block text-center py-3 rounded-xl text-sm"
            >
              ⬇ 下载 App 打包工程（2.4 MB）
            </a>
          </div>
        </div>

        {/* 批量链接 */}
        <div className="panel rounded-2xl p-4 mb-3">
          <div className="gold-text font-bold text-xs mb-2">
            🔗 全部 HTTPS 直链
          </div>
          <textarea
            readOnly
            value={allUrls}
            onFocus={(e) => e.currentTarget.select()}
            className="w-full h-28 text-[10px] bg-black/50 border border-amber-500/25 rounded-lg p-2 text-amber-200/85 font-mono outline-none resize-none"
          />
          <div className="flex gap-2 mt-2 flex-wrap">
            <button
              onClick={() => copy(allUrls, "all")}
              className="gold-btn px-3 py-2 rounded-lg text-[11px]"
            >
              {copied === "all" ? "✓ 已复制全部" : "复制全部链接"}
            </button>
            <a
              href="/api/assets?format=txt"
              target="_blank"
              rel="noreferrer"
              className="panel px-3 py-2 rounded-lg text-[11px] text-amber-200 font-bold"
            >
              纯文本
            </a>
            <a
              href="/api/assets"
              target="_blank"
              rel="noreferrer"
              className="panel px-3 py-2 rounded-lg text-[11px] text-amber-200 font-bold"
            >
              JSON
            </a>
            <a
              href="/api/assets?format=md"
              target="_blank"
              rel="noreferrer"
              className="panel px-3 py-2 rounded-lg text-[11px] text-amber-200 font-bold"
            >
              Markdown
            </a>
          </div>
          <div className="text-[10px] text-amber-200/45 mt-2 leading-relaxed">
            批量下载命令：
            <code className="block bg-black/50 rounded p-1.5 mt-1 text-amber-300 break-all">
              wget -i {m.origin}/api/assets?format=txt
            </code>
          </div>
        </div>

        {/* 单个素材 */}
        <div className="space-y-3">
          {m.assets.map((a) => (
            <div key={a.file} className="frame-gold">
              <div className="frame-inner p-3 bg-gradient-to-b from-[#182444] to-[#0a1020]">
                <div className="flex gap-3">
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noreferrer"
                    className="relative shrink-0 rounded-lg overflow-hidden border border-amber-500/30"
                    style={{ width: 88, height: 88, background: "#0a1020" }}
                  >
                    <Image
                      src={a.file}
                      alt={a.name}
                      fill
                      sizes="88px"
                      className="object-cover"
                    />
                  </a>

                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-amber-50 text-sm truncate">
                      {a.name}
                    </div>
                    <div className="text-[10px] text-amber-200/55 mt-0.5 leading-snug">
                      {a.desc}
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      <Tag>
                        {a.width}×{a.height}
                      </Tag>
                      <Tag>{a.size}</Tag>
                      <Tag>{a.type.split("/")[1].toUpperCase()}</Tag>
                    </div>
                    <div className="text-[9px] text-amber-300/70 mt-1.5 break-all bg-black/40 rounded px-1.5 py-1">
                      {a.url}
                    </div>
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      <a
                        href={a.download}
                        className="gold-btn px-3 py-1.5 rounded-lg text-[10px] whitespace-nowrap"
                      >
                        ⬇ 下载
                      </a>
                      <button
                        onClick={() => copy(a.url, a.file)}
                        className="panel px-3 py-1.5 rounded-lg text-[10px] text-amber-200 font-bold whitespace-nowrap"
                      >
                        {copied === a.file ? "✓ 已复制" : "复制链接"}
                      </button>
                      <a
                        href={a.url}
                        target="_blank"
                        rel="noreferrer"
                        className="panel px-3 py-1.5 rounded-lg text-[10px] text-amber-200 font-bold whitespace-nowrap"
                      >
                        新窗口打开
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="panel rounded-2xl p-4 mt-4">
          <div className="gold-text font-bold text-xs mb-2">
            🎨 以下元素为纯 CSS/组件实现（无图片文件）
          </div>
          <ul className="text-[11px] text-amber-200/60 space-y-1 leading-relaxed">
            <li>• 扑克牌面 —— 组件绘制（标准点位排布 + 双向索引）</li>
            <li>• 牌背 —— CSS 红金菱格纹</li>
            <li>• 筹码 —— CSS 扇形分色（红/蓝/绿/黑）</li>
            <li>• 头像 —— 8 套渐变底 + Emoji</li>
            <li>• 木质桌框 / 金框 / 立体按钮 —— CSS 多层渐变</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[9px] bg-black/50 border border-amber-500/25 text-amber-200/80 px-1.5 py-0.5 rounded">
      {children}
    </span>
  );
}

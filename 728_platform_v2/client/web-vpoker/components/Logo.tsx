"use client";

import Image from "next/image";
import { assetUrl } from "@/lib/assets";

export function Logo({ size = 40 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="flex items-center justify-center relative"
    >
      <Image
        src={assetUrl("/logo.png")}
        alt="V-Poker"
        width={size}
        height={size}
        style={{ objectFit: "contain", width: "100%", height: "100%" }}
        priority
      />
    </div>
  );
}

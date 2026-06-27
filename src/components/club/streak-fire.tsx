"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function StreakFire({ size = 40 }: { size?: number }) {
  return (
    <div className="relative flicker" style={{ width: size, height: size }}>
      <Image
        src="/assets/icons/fire-medium.png"
        alt="Streak fire"
        width={size}
        height={size}
        className="pixel-image object-contain w-full h-full"
        unoptimized
      />
    </div>
  );
}

export function CountdownTimer() {
  const [time, setTime] = useState("23:59:59");

  useEffect(() => {
    let seconds = 23 * 3600 + 59 * 60 + 59;
    const tick = () => {
      seconds -= 1;
      if (seconds < 0) seconds = 86400;
      const h = Math.floor(seconds / 3600)
        .toString()
        .padStart(2, "0");
      const m = Math.floor((seconds % 3600) / 60)
        .toString()
        .padStart(2, "0");
      const s = (seconds % 60).toString().padStart(2, "0");
      setTime(`${h}:${m}:${s}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="pixel-border bg-surface-container-highest px-2 py-1 flex items-center gap-1">
      <span className="material-symbols-outlined text-tertiary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
        timer
      </span>
      <span className="text-xs font-bold font-[family-name:var(--font-space-mono)]">{time}</span>
    </div>
  );
}

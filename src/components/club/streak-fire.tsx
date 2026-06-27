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

function formatRemaining(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((total % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = (total % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export function CountdownTimer({ dayEndsAt }: { dayEndsAt: string }) {
  const deadline = new Date(dayEndsAt).getTime();
  const [time, setTime] = useState(() => formatRemaining(deadline - Date.now()));

  useEffect(() => {
    const tick = () => setTime(formatRemaining(deadline - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [deadline]);

  return (
    <div className="pixel-border bg-surface-container-highest px-2 py-1 flex items-center gap-1">
      <span className="material-symbols-outlined text-tertiary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
        timer
      </span>
      <span className="text-xs font-bold font-[family-name:var(--font-space-mono)]">{time}</span>
    </div>
  );
}

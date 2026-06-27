type StreakCardProps = {
  streak: number;
};

export function StreakCard({ streak }: StreakCardProps) {
  return (
    <div className="pixel-border bg-surface-variant p-4 pixel-shadow flex flex-col justify-between">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
          local_fire_department
        </span>
        <span className="text-xs font-bold font-[family-name:var(--font-space-mono)] text-on-surface uppercase">
          Current Streak
        </span>
      </div>
      <div className="text-5xl font-bold font-[family-name:var(--font-space-mono)] text-tertiary leading-none">
        {streak} <span className="text-lg">DAYS</span>
      </div>
      <p className="mt-4 text-sm text-on-surface-variant font-[family-name:var(--font-courier-prime)]">
        Don&apos;t let the fire go out tonight.
      </p>
    </div>
  );
}

import Link from "next/link";

type HeaderIconsProps = {
  className?: string;
};

export function HeaderIcons({ className = "" }: HeaderIconsProps) {
  const iconClass =
    "material-symbols-outlined hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-75 cursor-pointer";

  return (
    <div className={`flex gap-4 ${className}`}>
      <span className={iconClass}>local_fire_department</span>
      <span className={iconClass}>military_tech</span>
      <span className={iconClass}>timer</span>
    </div>
  );
}

type AppHeaderProps = {
  title?: string;
  showLogo?: boolean;
  right?: React.ReactNode;
};

export function AppHeader({ title = "QUEST LOG", showLogo, right }: AppHeaderProps) {
  return (
    <header className="bg-surface-container border-b-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex justify-between items-center w-full px-4 h-16 fixed top-0 z-50">
      <div className="text-xl font-bold font-[family-name:var(--font-space-mono)] text-tertiary-fixed-dim uppercase flex items-center gap-2 tracking-tighter">
        {showLogo && (
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            book_2
          </span>
        )}
        {title}
      </div>
      {right ?? <HeaderIcons />}
    </header>
  );
}

type BottomNavProps = {
  active?: "quests" | "stats" | "config";
};

export function BottomNav({ active = "quests" }: BottomNavProps) {
  const items = [
    { id: "quests" as const, icon: "swords", label: "QUESTS", href: "/dashboard" },
    { id: "stats" as const, icon: "leaderboard", label: "STATS", href: "/dashboard" },
    { id: "config" as const, icon: "settings", label: "CONFIG", href: "/character" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 bg-surface-container-highest border-t-4 border-black shadow-[0px_-4px_0px_0px_rgba(0,0,0,1)]">
      {items.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className={`flex flex-col items-center justify-center p-2 transition-all duration-75 ${
            active === item.id
              ? "bg-secondary-container text-on-secondary-container border-2 border-black scale-95"
              : "text-on-surface-variant hover:bg-surface-variant"
          }`}
        >
          <span
            className="material-symbols-outlined"
            style={active === item.id ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            {item.icon}
          </span>
          <span className="text-[10px] font-bold font-[family-name:var(--font-space-mono)] uppercase mt-1">
            {item.label}
          </span>
        </Link>
      ))}
    </nav>
  );
}

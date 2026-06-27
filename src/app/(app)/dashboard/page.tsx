import Link from "next/link";
import Image from "next/image";
import { AppHeader, BottomNav } from "@/components/layout/app-chrome";
import { UserMenu } from "@/components/auth/user-menu";
import { DEMO_CLUBS } from "@/lib/clubs";

const CLUB_ICONS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDq9HKFt4UqLd3f6rMYlR4g6svXvcJiWq19MiFBdthJZ7diLnGo_voNENN0ZkPWuOO7ymR9DhBVIN98IIqseSY_W4OFRwc6xWsBS5lUlykloKA4AIcHCA7avJ19MEBh3bk6dfKSibjOd_W5J69KSBinRNshvBDymbWfEzn18e-hIUgyJMe2UhJxiS3MtGhs2uck7Sn6la1B8GB1koDNjQpM4D6hcj0S56R1f_5X5Jd7eB5VkLmtbcR9wA",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBurGPhWrrBZgwsh57c2K_RZcqeOuw3wrYFGro0xYM4f-1S3xS7-gxTuaZ2rK70MSwhNieEUl3DRUJAwY6uU6daYqt1cbTUyk7OyYWQF80qU-slCsefHIQYZd1DLlrS1NUjiyitcv1g1KDZLhgFLiwSi5JVTMpPJFcIeyDJ1pQfxkRJ17O4i8bF9z8B4K2xiPqXmXgt_laMSQ2IbCDTdrl5LJhhK7YtY-JkIWG5KtFz8eLet-BUzGWGEg",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCVczvdjAhumNrfu_hNUw7dCS7lowGCQEilJG7Daf105BFvU77yUOiAhFQuV2PZrMotWrcL55JaxMZN6C587qXToBADt1VnEh8mfeDWg-FIECihnM7-IetUTB-EgEZlU7-paiiO_rxVamPMkojzwtXHIOhCPvwbQQHePEStbmBBgfAtOQkH25AVB4a9JHMDg-TkKuMC-vLPZv6DuKIigexch8cdOCdJlYk0MvpIcJyoLhZnSXhxeBj9eg",
];

const PROGRESS = ["75%", "25%", "100%"];

export default function DashboardPage() {
  return (
    <>
      <AppHeader right={<UserMenu />} />
      <main className="pt-24 px-4 max-w-md mx-auto pb-32">
        <div className="mb-8">
          <h1 className="text-2xl font-bold font-[family-name:var(--font-space-mono)] text-primary uppercase mb-2">
            MY CLUBS
          </h1>
          <div className="h-1 w-24 bg-secondary" />
        </div>

        <div className="grid grid-cols-1 gap-6 mb-12">
          {DEMO_CLUBS.map((club, i) => (
            <Link
              key={club.id}
              href={`/clubs/${club.id}`}
              className="pixel-border pixel-shadow bg-surface-variant p-4 relative overflow-hidden group cursor-pointer active-press transition-all block"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-surface-container-high pixel-border flex items-center justify-center">
                  <Image
                    src={CLUB_ICONS[i]}
                    alt={club.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 pixel-image object-contain"
                    unoptimized
                  />
                </div>
                <div className="flex-1">
                  <div className="text-[10px] text-secondary uppercase tracking-widest mb-1 font-bold font-[family-name:var(--font-space-mono)]">
                    {club.slotLabel}
                  </div>
                  <h3 className="text-lg font-bold font-[family-name:var(--font-space-mono)] text-on-surface">
                    {club.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="material-symbols-outlined text-error text-[18px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      local_fire_department
                    </span>
                    <span className="text-xs font-bold font-[family-name:var(--font-space-mono)] text-on-surface-variant uppercase">
                      {club.currentStreak.toString().padStart(2, "0")} DAYS STREAK
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-4 h-4 bg-background pixel-border overflow-hidden">
                <div
                  className="h-full bg-secondary"
                  style={{ width: PROGRESS[i], boxShadow: "inset -4px 0px 0px rgba(0,0,0,0.2)" }}
                />
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="/clubs/new"
          className="w-full bg-tertiary text-on-tertiary-container pixel-border pixel-shadow-lg py-4 flex items-center justify-center gap-2 active-press transition-all mb-8"
        >
          <span className="material-symbols-outlined font-bold">add_circle</span>
          <span className="text-lg font-bold font-[family-name:var(--font-space-mono)] uppercase">+ NEW CLUB</span>
        </Link>

        <div className="bg-surface-container-low pixel-border p-4 mb-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold font-[family-name:var(--font-space-mono)] text-primary uppercase">
              WEEKLY REP
            </span>
            <span className="text-[10px] text-on-surface-variant">+420 XP</span>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className={`h-8 pixel-border ${i < 4 ? "bg-secondary" : "bg-surface-container-highest border-dashed"}`}
              />
            ))}
          </div>
        </div>
      </main>
      <BottomNav active="quests" />
    </>
  );
}

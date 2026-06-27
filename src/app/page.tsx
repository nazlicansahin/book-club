import Link from "next/link";
import Image from "next/image";
import { BottomNav } from "@/components/layout/app-chrome";

export default function LandingPage() {
  return (
    <>
      <header className="bg-surface-container border-b-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex justify-between items-center w-full px-4 h-16 sticky top-0 z-50">
        <div className="text-xl font-bold font-[family-name:var(--font-space-mono)] text-tertiary-fixed-dim uppercase flex items-center gap-2">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            book_2
          </span>
          QUEST LOG
        </div>
        <div className="flex gap-4 items-center">
          <div className="hidden md:flex gap-6">
            <span className="text-primary-fixed font-bold text-xs uppercase tracking-wider">Home</span>
            <span className="text-on-surface-variant text-xs uppercase tracking-wider">Library</span>
            <span className="text-on-surface-variant text-xs uppercase tracking-wider">Quests</span>
          </div>
          <div className="flex gap-2">
            <button type="button" className="pixel-border bg-surface-container p-2 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all duration-75 pixel-shadow">
              <span className="material-symbols-outlined text-primary">local_fire_department</span>
            </button>
            <button type="button" className="pixel-border bg-surface-container p-2 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all duration-75 pixel-shadow">
              <span className="material-symbols-outlined text-primary">military_tech</span>
            </button>
          </div>
        </div>
      </header>

      <main className="relative min-h-screen pb-24">
        <div className="absolute inset-0 bookshelf-pattern opacity-10 pointer-events-none" />

        <section className="relative pt-24 pb-32 px-4 flex flex-col items-center justify-center text-center">
          <div className="relative w-48 h-48 mb-8">
            <div className="absolute inset-0 flex items-center justify-center flicker">
              <Image
                src="/assets/icons/fire-medium.png"
                alt="Pixel campfire"
                width={192}
                height={192}
                className="w-full h-full object-contain pixel-image"
                unoptimized
                priority
              />
            </div>
            <div className="absolute inset-0 bg-tertiary opacity-10 blur-3xl rounded-full" />
          </div>

          <div className="max-w-xl mb-12">
            <h1 className="text-xl md:text-2xl font-bold font-[family-name:var(--font-space-mono)] text-primary uppercase mb-4 tracking-tighter leading-none">
              Read daily.
              <br />
              Keep the streak alive.
            </h1>
            <p className="text-base text-on-surface-variant mb-2">
              Turn your reading list into an epic 16-bit adventure.
            </p>
            <div className="flex justify-center items-center gap-1 text-sm text-on-surface">
              <span>C:\QUEST_LOG\USER\PLAYER_1&gt;</span>
              <span className="italic text-tertiary">ready_to_read</span>
              <span className="cursor-block" />
            </div>
          </div>

          <Link
            href="/character"
            className="pixel-border bg-tertiary text-on-tertiary text-xl font-bold font-[family-name:var(--font-space-mono)] uppercase px-12 py-6 pixel-shadow-lg transition-all duration-75 hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            PRESS START
          </Link>
        </section>

        <section className="max-w-6xl mx-auto px-4 pb-32 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 pixel-border bg-surface-container p-4 pixel-shadow">
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-xs font-bold font-[family-name:var(--font-space-mono)] text-secondary uppercase block mb-1">
                  Current Chapter
                </span>
                <h3 className="text-lg font-bold font-[family-name:var(--font-space-mono)] text-on-surface">
                  The Shadow Over Innsmouth
                </h3>
              </div>
              <div className="bg-secondary-container text-on-secondary-container px-3 py-1 border-2 border-black text-[10px] font-bold font-[family-name:var(--font-space-mono)] uppercase">
                Active
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-xs font-bold font-[family-name:var(--font-space-mono)] uppercase">
                <span>XP Progress</span>
                <span>450 / 1000</span>
              </div>
              <div className="pixel-border bg-background h-8 overflow-hidden">
                <div className="bg-secondary h-full w-[45%] border-r-4 border-black" />
              </div>
            </div>
          </div>

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
              12 <span className="text-lg">DAYS</span>
            </div>
            <p className="mt-4 text-sm text-on-surface-variant">Don&apos;t let the fire go out tonight.</p>
          </div>

          <div className="pixel-border bg-surface-container-high p-4 pixel-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2">
              <span className="material-symbols-outlined text-outline-variant">military_tech</span>
            </div>
            <span className="text-xs font-bold font-[family-name:var(--font-space-mono)] text-primary uppercase block mb-2">
              Next Quest
            </span>
            <p className="text-lg font-bold font-[family-name:var(--font-space-mono)] text-on-surface leading-tight mb-4">
              Finish Chapter 5 to unlock the &apos;Scholar&apos; badge.
            </p>
            <div className="flex gap-2">
              <div className="pixel-border border-2 bg-surface-container px-2 py-1 text-[10px] font-bold font-[family-name:var(--font-space-mono)] uppercase">
                +50 XP
              </div>
              <div className="pixel-border border-2 bg-surface-container px-2 py-1 text-[10px] font-bold font-[family-name:var(--font-space-mono)] uppercase">
                +10 Gold
              </div>
            </div>
          </div>

          <div className="md:col-span-2 pixel-border bg-surface-container-lowest p-4 pixel-shadow">
            <h4 className="text-xs font-bold font-[family-name:var(--font-space-mono)] text-on-surface-variant uppercase mb-4 border-b-4 border-black pb-2">
              Recent Logs
            </h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-4 group">
                <span className="text-secondary material-symbols-outlined transition-transform group-hover:translate-x-0.5">
                  chevron_right
                </span>
                <span className="text-sm flex-1 font-[family-name:var(--font-courier-prime)]">
                  Logged 45 minutes of reading &quot;Meditations&quot;
                </span>
                <span className="text-[10px] font-bold font-[family-name:var(--font-space-mono)] text-on-surface-variant uppercase">
                  2h ago
                </span>
              </li>
              <li className="flex items-center gap-4 group">
                <span className="text-secondary material-symbols-outlined transition-transform group-hover:translate-x-0.5">
                  chevron_right
                </span>
                <span className="text-sm flex-1 font-[family-name:var(--font-courier-prime)]">
                  Completed Daily Quest: &apos;A New World&apos;
                </span>
                <span className="text-[10px] font-bold font-[family-name:var(--font-space-mono)] text-on-surface-variant uppercase">
                  Yesterday
                </span>
              </li>
              <li className="flex items-center gap-4 group opacity-50">
                <span className="text-secondary material-symbols-outlined transition-transform group-hover:translate-x-0.5">
                  chevron_right
                </span>
                <span className="text-sm flex-1 font-[family-name:var(--font-courier-prime)]">
                  Level Up! Reach Lvl 5
                </span>
                <span className="text-[10px] font-bold font-[family-name:var(--font-space-mono)] text-on-surface-variant uppercase">
                  3d ago
                </span>
              </li>
            </ul>
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-4 pb-32">
          <div className="grid grid-cols-4 md:grid-cols-8 gap-4 opacity-30">
            <div className="h-32 pixel-border bg-primary" />
            <div className="h-32 pixel-border bg-tertiary" />
            <div className="h-32 pixel-border bg-secondary" />
            <div className="h-32 pixel-border bg-surface-variant" />
            <div className="h-32 pixel-border bg-error" />
            <div className="h-32 pixel-border bg-primary-container" />
            <div className="h-32 pixel-border bg-secondary-container" />
            <div className="h-32 pixel-border bg-tertiary-container" />
          </div>
        </div>
      </main>
      <BottomNav active="quests" />
    </>
  );
}

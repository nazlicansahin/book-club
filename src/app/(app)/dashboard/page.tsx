"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppHeader, BottomNav } from "@/components/layout/app-chrome";
import { UserMenu } from "@/components/auth/user-menu";
import { useAuth } from "@/components/auth/auth-provider";
import { getUserClubs } from "@/lib/club-service";
import { getUserClubsCached } from "@/lib/clubs-cache";
import type { Club } from "@/lib/clubs";

export default function DashboardPage() {
  const { user } = useAuth();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getUserClubsCached(user.uid, getUserClubs)
      .then(setClubs)
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <>
      <AppHeader right={<UserMenu />} />
      <main className="app-content-pad-top app-content-pad-bottom app-page w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold font-[family-name:var(--font-space-mono)] text-primary uppercase mb-2">
            MY CLUBS
          </h1>
          <div className="h-1 w-24 bg-secondary" />
        </div>

        {loading ? (
          <p className="text-sm font-bold font-[family-name:var(--font-space-mono)] text-on-surface-variant uppercase animate-pulse mb-8">
            Loading clubs...
          </p>
        ) : clubs.length === 0 ? (
          <div className="pixel-border bg-surface-container-low p-6 mb-8 text-center">
            <p className="text-sm text-on-surface-variant font-[family-name:var(--font-courier-prime)] mb-2">
              No clubs yet. Create one or join with an invite code.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 mb-8">
            {clubs.map((club, i) => (
              <Link
                key={club.id}
                href={`/clubs/${club.id}`}
                className="pixel-border pixel-shadow bg-surface-variant p-4 relative overflow-hidden group cursor-pointer active-press transition-all block"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-surface-container-high pixel-border flex items-center justify-center">
                    <span className="material-symbols-outlined text-3xl text-primary">menu_book</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-secondary uppercase tracking-widest mb-1 font-bold font-[family-name:var(--font-space-mono)]">
                      SLOT {(i + 1).toString().padStart(2, "0")}
                    </div>
                    <h3 className="text-lg font-bold font-[family-name:var(--font-space-mono)] text-on-surface truncate">
                      {club.name}
                    </h3>
                    <p className="text-xs text-on-surface-variant font-[family-name:var(--font-courier-prime)] truncate mt-0.5">
                      {club.bookTitle}
                    </p>
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
                      <span className="text-[10px] text-outline">·</span>
                      <span className="text-[10px] font-bold font-[family-name:var(--font-space-mono)] text-on-surface-variant uppercase">
                        {club.members.length} {club.members.length === 1 ? "member" : "members"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 mb-8">
          <Link
            href="/clubs/new"
            className="w-full bg-tertiary text-on-tertiary-container pixel-border pixel-shadow-lg py-4 flex items-center justify-center gap-2 active-press transition-all"
          >
            <span className="material-symbols-outlined font-bold">add_circle</span>
            <span className="text-lg font-bold font-[family-name:var(--font-space-mono)] uppercase">NEW CLUB</span>
          </Link>
          <Link
            href="/clubs/join"
            className="w-full bg-secondary text-on-secondary pixel-border pixel-shadow-lg py-4 flex items-center justify-center gap-2 active-press transition-all"
          >
            <span className="material-symbols-outlined font-bold">key</span>
            <span className="text-lg font-bold font-[family-name:var(--font-space-mono)] uppercase">JOIN WITH CODE</span>
          </Link>
        </div>
      </main>
      <BottomNav />
    </>
  );
}

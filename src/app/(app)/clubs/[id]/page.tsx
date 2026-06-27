"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { BottomNav } from "@/components/layout/app-chrome";
import { SceneSection } from "@/components/club/scene-section";
import { CountdownTimer } from "@/components/club/streak-fire";
import { getClub, type ClubMember } from "@/lib/clubs";
import { getStoredCharacter, hasCheckedInToday } from "@/lib/player-store";
import type { CharacterId } from "@/lib/characters";

function applyPlayerState(members: ClubMember[], playerChar: CharacterId | null, checkedIn: boolean): ClubMember[] {
  if (!playerChar) return members;

  return members.map((m) => {
    if (m.name !== "You") return m;
    if (checkedIn) return { ...m, area: "pool" as const, checkedInToday: true, characterId: playerChar };
    if (m.area === "prison") return { ...m, characterId: playerChar };
    return { ...m, area: "park" as const, checkedInToday: false, characterId: playerChar };
  });
}

export default function ClubMainPage() {
  const params = useParams<{ id: string }>();
  const club = getClub(params.id);
  const [playerChar, setPlayerChar] = useState<CharacterId | null>(null);
  const [checkedIn, setCheckedIn] = useState(false);

  useEffect(() => {
    setPlayerChar(getStoredCharacter());
    if (params.id) setCheckedIn(hasCheckedInToday(params.id));
  }, [params.id]);

  const members = useMemo(() => {
    if (!club) return { pool: [], park: [], prison: [] };
    const updated = applyPlayerState(club.members, playerChar, checkedIn);
    return {
      pool: updated.filter((m) => m.area === "pool"),
      park: updated.filter((m) => m.area === "park"),
      prison: updated.filter((m) => m.area === "prison"),
    };
  }, [club, playerChar, checkedIn]);

  if (!club) {
    return (
      <div className="p-8 text-center">
        <p>Club not found</p>
        <Link href="/dashboard" className="text-primary underline mt-4 inline-block">
          Back to clubs
        </Link>
      </div>
    );
  }

  return (
    <>
      <header className="bg-surface-container border-b-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex justify-between items-center w-full px-4 h-16 fixed top-0 z-50">
        <div className="flex items-center gap-2">
          <Image
            src="/assets/icons/fire-medium.png"
            alt="Quest Log"
            width={40}
            height={40}
            className="w-10 h-10 pixel-border bg-background pixel-image object-contain"
            unoptimized
          />
          <span className="text-xl font-bold font-[family-name:var(--font-space-mono)] text-tertiary-fixed-dim uppercase tracking-tighter">
            QUEST LOG
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold font-[family-name:var(--font-space-mono)] text-primary uppercase">
              DAY {club.currentStreak}
            </span>
            <span className="text-[10px] font-bold font-[family-name:var(--font-space-mono)] text-secondary uppercase">
              BEST: {club.bestStreak}
            </span>
          </div>
          <CountdownTimer />
        </div>
      </header>

      <main className="mt-20 flex-grow px-4 flex flex-col gap-6 pb-32 max-w-md mx-auto w-full">
        <SceneSection area="pool" label="POOL" members={members.pool} />
        <SceneSection area="park" label="PARK" members={members.park} />
        <SceneSection area="prison" label="PRISON" members={members.prison} />
      </main>

      {!checkedIn && (
        <div className="fixed bottom-24 right-4 z-50">
          <Link
            href={`/clubs/${club.id}/check-in`}
            className="flex items-center gap-2 bg-tertiary text-on-tertiary p-4 pixel-border pixel-shadow-lg transition-all duration-75 active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              book
            </span>
            <span className="text-lg font-bold font-[family-name:var(--font-space-mono)] uppercase">
              ADD READING
            </span>
          </Link>
        </div>
      )}

      <BottomNav active="quests" />
    </>
  );
}

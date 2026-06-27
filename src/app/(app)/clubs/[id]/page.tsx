"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { BottomNav } from "@/components/layout/app-chrome";
import { SceneSection } from "@/components/club/scene-section";
import { CountdownTimer } from "@/components/club/streak-fire";
import { StreakCard } from "@/components/club/streak-card";
import { ReadingStoryModal } from "@/components/club/reading-story-modal";
import { useAuth } from "@/components/auth/auth-provider";
import {
  canSubmitReading,
  deleteClub,
  getClubWithMembers,
  isInPrison,
  leaveClub,
  sendToPrison,
} from "@/lib/club-service";
import type { Club, ClubMember } from "@/lib/clubs";

export default function ClubMainPage() {
  const params = useParams<{ id: string }>();
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [inPrison, setInPrison] = useState(false);
  const [showReading, setShowReading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [storyMember, setStoryMember] = useState<ClubMember | null>(null);
  const [sendingToPrison, setSendingToPrison] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [leaving, setLeaving] = useState(false);

  async function refreshClub() {
    if (!params.id) return;
    const data = await getClubWithMembers(params.id);
    setClub(data);
    if (params.id) {
      const [prison, reading] = await Promise.all([
        isInPrison(params.id),
        canSubmitReading(params.id),
      ]);
      setInPrison(prison);
      setShowReading(reading);
    }
    return data;
  }

  useEffect(() => {
    if (!params.id || !user) return;
    setLoading(true);
    refreshClub().finally(() => setLoading(false));
  }, [params.id, user, pathname]);

  const members = useMemo(() => {
    if (!club) return { pool: [], park: [], prison: [] };
    return {
      pool: club.members.filter((m) => m.area === "pool"),
      park: club.members.filter((m) => m.area === "park"),
      prison: club.members.filter((m) => m.area === "prison"),
    };
  }, [club]);

  const allInPoolToday =
    club &&
    club.members.length > 0 &&
    club.members.every((m) => m.area === "pool");

  const isOwner = user?.uid === club?.ownerId;

  async function copyInviteCode() {
    if (!club?.inviteCode) return;
    await navigator.clipboard.writeText(club.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSendToPrison(memberId: string) {
    if (!params.id || sendingToPrison) return;
    setSendingToPrison(memberId);
    try {
      await sendToPrison(params.id, memberId);
      await refreshClub();
    } finally {
      setSendingToPrison(null);
    }
  }

  async function handleDeleteClub() {
    if (!params.id || !club || deleting) return;
    const confirmed = window.confirm(
      `Delete "${club.name}"? This cannot be undone. All members will be removed.`
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      await deleteClub(params.id);
      router.push("/dashboard");
    } catch {
      setDeleting(false);
    }
  }

  async function handleLeaveClub() {
    if (!params.id || !club || leaving) return;
    const confirmed = window.confirm(`Leave "${club.name}"?`);
    if (!confirmed) return;

    setLeaving(true);
    try {
      await leaveClub(params.id);
      router.push("/dashboard");
    } catch {
      setLeaving(false);
    }
  }

  function handleMemberTap(member: ClubMember) {
    setStoryMember(member);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm font-bold font-[family-name:var(--font-space-mono)] text-primary uppercase animate-pulse">
          Loading club...
        </p>
      </div>
    );
  }

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
      <header className="app-shell-header bg-surface-container border-b-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex justify-between items-center w-full px-4 h-16 fixed top-0 z-50">
        <div className="flex items-center gap-2 min-w-0">
          <Image
            src="/assets/icons/fire-medium.png"
            alt="Quest Log"
            width={40}
            height={40}
            className="w-10 h-10 pixel-border bg-background pixel-image object-contain shrink-0"
            unoptimized
          />
          <span className="text-xl font-bold font-[family-name:var(--font-space-mono)] text-tertiary-fixed-dim uppercase tracking-tighter truncate">
            {club.name}
          </span>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <CountdownTimer dayEndsAt={club.dayEndsAt} />
        </div>
      </header>

      <main className="app-content-pad-top app-content-pad-bottom flex-grow px-4 flex flex-col gap-6 max-w-md mx-auto w-full">
        <StreakCard streak={club.currentStreak} />

        {allInPoolToday && club.currentStreak > 0 && (
          <p className="text-xs font-bold font-[family-name:var(--font-space-mono)] text-secondary uppercase text-center -mt-4">
            All readers in the pool — streak secured for today!
          </p>
        )}

        {isOwner && (
          <div className="pixel-border bg-surface-container-high p-4 pixel-shadow space-y-4">
            <div className="flex justify-between items-start gap-2">
              <div>
                <span className="text-[10px] font-bold font-[family-name:var(--font-space-mono)] text-secondary uppercase">
                  Invite Code
                </span>
                <p className="text-2xl font-bold font-[family-name:var(--font-space-mono)] text-primary tracking-widest mt-1">
                  {club.inviteCode}
                </p>
              </div>
              <button
                type="button"
                onClick={copyInviteCode}
                className="pixel-border bg-tertiary text-on-tertiary px-3 py-2 text-[10px] font-bold font-[family-name:var(--font-space-mono)] uppercase shrink-0"
              >
                {copied ? "COPIED!" : "COPY"}
              </button>
            </div>

            <div>
              <span className="text-[10px] font-bold font-[family-name:var(--font-space-mono)] text-error uppercase block mb-2">
                Send to Prison (resets streak)
              </span>
              <div className="flex flex-col gap-2">
                {club.members.map((member) => (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => handleSendToPrison(member.id)}
                    disabled={sendingToPrison === member.id || member.area === "prison"}
                    className="w-full flex justify-between items-center bg-error-container text-on-error-container py-2 px-3 pixel-border text-xs font-bold font-[family-name:var(--font-space-mono)] uppercase disabled:opacity-50 active-press"
                  >
                    <span className="truncate">{member.name}</span>
                    <span className="shrink-0 ml-2">
                      {member.area === "prison"
                        ? "IN PRISON"
                        : sendingToPrison === member.id
                          ? "..."
                          : "SEND"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleDeleteClub}
              disabled={deleting}
              className="w-full bg-surface-container-low text-error py-3 pixel-border text-xs font-bold font-[family-name:var(--font-space-mono)] uppercase disabled:opacity-50 active-press"
            >
              {deleting ? "DELETING..." : "DELETE CLUB"}
            </button>
          </div>
        )}

        {!isOwner && (
          <button
            type="button"
            onClick={handleLeaveClub}
            disabled={leaving}
            className="w-full bg-surface-container-low text-on-surface-variant py-3 pixel-border text-xs font-bold font-[family-name:var(--font-space-mono)] uppercase disabled:opacity-50 active-press"
          >
            {leaving ? "LEAVING..." : "LEAVE CLUB"}
          </button>
        )}

        {club.members.length === 1 && (
          <p className="text-xs text-on-surface-variant font-[family-name:var(--font-courier-prime)] text-center -mt-2">
            Waiting for readers to join with your invite code...
          </p>
        )}

        <SceneSection area="pool" label="POOL" members={members.pool} onMemberTap={handleMemberTap} />
        <SceneSection area="park" label="PARK" members={members.park} />
        <SceneSection area="prison" label="PRISON" members={members.prison} />
      </main>

      {storyMember && (
        <ReadingStoryModal
          clubId={club.id}
          member={storyMember}
          onClose={() => setStoryMember(null)}
          onReaction={() => {
            refreshClub();
          }}
        />
      )}

      <div className="app-fab-bottom fixed right-4 z-50 flex flex-col gap-3 items-end">
        {inPrison ? (
          <Link
            href={`/clubs/${club.id}/punishment`}
            className="flex items-center gap-2 bg-error text-on-error p-4 pixel-border pixel-shadow-lg transition-all duration-75 active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              photo_camera
            </span>
            <span className="text-sm font-bold font-[family-name:var(--font-space-mono)] uppercase">
              Punishment Photo
            </span>
          </Link>
        ) : (
          <span className="flex items-center gap-2 bg-surface-container-high text-on-surface-variant p-4 pixel-border opacity-70 cursor-not-allowed">
            <span className="material-symbols-outlined">photo_camera</span>
            <span className="text-sm font-bold font-[family-name:var(--font-space-mono)] uppercase">
              Punishment Photo
            </span>
          </span>
        )}

        {showReading && (
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
        )}
      </div>

      <BottomNav />
    </>
  );
}

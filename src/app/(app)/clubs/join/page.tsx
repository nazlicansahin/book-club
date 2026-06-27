"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppHeader, BottomNav } from "@/components/layout/app-chrome";
import { useAuth } from "@/components/auth/auth-provider";
import { joinClubByCode } from "@/lib/club-service";

export default function JoinClubPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [code, setCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function join(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setJoining(true);
    setError(null);
    try {
      const clubId = await joinClubByCode(user, code);
      router.push(`/clubs/${clubId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not join club");
      setJoining(false);
    }
  }

  return (
    <>
      <AppHeader title="JOIN CLUB" />
      <main className="app-content-pad-top app-content-pad-bottom app-page w-full">
        <div className="text-center mb-8">
          <span className="material-symbols-outlined text-4xl text-primary mb-2">key</span>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-space-mono)] text-primary uppercase">
            JOIN CLUB
          </h1>
          <p className="text-sm text-on-surface-variant mt-2 font-[family-name:var(--font-courier-prime)]">
            Enter the 6-character invite code from your book club host.
          </p>
        </div>

        <form onSubmit={join} className="space-y-6">
          <div>
            <label className="text-xs font-bold font-[family-name:var(--font-space-mono)] uppercase text-secondary block mb-2">
              Invite Code
            </label>
            <input
              required
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              maxLength={6}
              className="w-full pixel-border bg-background px-4 py-4 text-2xl tracking-[0.3em] text-center font-bold font-[family-name:var(--font-space-mono)] uppercase focus:outline-none"
              placeholder="ABC123"
            />
          </div>

          {error && (
            <p className="text-xs font-bold font-[family-name:var(--font-space-mono)] text-error text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={joining || code.trim().length < 6}
            className="w-full bg-secondary text-on-secondary py-4 pixel-border pixel-shadow uppercase text-lg font-bold font-[family-name:var(--font-space-mono)] active-press disabled:opacity-60"
          >
            {joining ? "JOINING..." : "JOIN CLUB"}
          </button>
        </form>

        <Link href="/dashboard" className="block text-center mt-6 text-sm text-on-surface-variant uppercase">
          Back
        </Link>
      </main>
      <BottomNav />
    </>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppHeader, BottomNav } from "@/components/layout/app-chrome";
import { useAuth } from "@/components/auth/auth-provider";
import { createClub } from "@/lib/club-service";

export default function NewClubPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [book, setBook] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setError(null);
    try {
      const club = await createClub(user, name, book);
      router.push(`/clubs/${club.id}?created=1`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create club");
      setSaving(false);
    }
  }

  return (
    <>
      <AppHeader title="NEW CLUB" />
      <main className="app-content-pad-top app-content-pad-bottom app-page w-full">
        <h1 className="text-2xl font-bold font-[family-name:var(--font-space-mono)] text-primary uppercase mb-8">
          NEW CLUB
        </h1>

        <form onSubmit={create} className="space-y-6">
          <div>
            <label className="text-xs font-bold font-[family-name:var(--font-space-mono)] uppercase text-secondary block mb-2">
              Club Name
            </label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pixel-border bg-background px-4 py-3 text-sm focus:outline-none"
              placeholder="Epic Fantasy Readers"
            />
          </div>
          <div>
            <label className="text-xs font-bold font-[family-name:var(--font-space-mono)] uppercase text-secondary block mb-2">
              Book Title
            </label>
            <input
              required
              value={book}
              onChange={(e) => setBook(e.target.value)}
              className="w-full pixel-border bg-background px-4 py-3 text-sm focus:outline-none"
              placeholder="The Hobbit"
            />
          </div>
          <div>
            <span className="text-xs font-bold font-[family-name:var(--font-space-mono)] uppercase text-secondary block mb-2">
              Punishment Deck
            </span>
            <div className="flex flex-wrap gap-2">
              {["Funny", "Mild Dare", "Custom"].map((deck) => (
                <span
                  key={deck}
                  className="pixel-border bg-surface-container-high px-3 py-1 text-[10px] font-bold font-[family-name:var(--font-space-mono)] uppercase"
                >
                  {deck}
                </span>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-xs font-bold font-[family-name:var(--font-space-mono)] text-error">{error}</p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-tertiary text-on-tertiary py-4 pixel-border pixel-shadow uppercase text-lg font-bold font-[family-name:var(--font-space-mono)] active-press disabled:opacity-60"
          >
            {saving ? "CREATING..." : "CREATE CLUB"}
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

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppHeader, BottomNav } from "@/components/layout/app-chrome";

export default function NewClubPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [book, setBook] = useState("");

  function create(e: React.FormEvent) {
    e.preventDefault();
    // Stub: redirect to demo club until backend exists
    router.push("/clubs/epic-fantasy");
  }

  return (
    <>
      <AppHeader title="NEW CLUB" />
      <main className="pt-24 px-4 max-w-md mx-auto pb-32">
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
          <button
            type="submit"
            className="w-full bg-tertiary text-on-tertiary py-4 pixel-border pixel-shadow uppercase text-lg font-bold font-[family-name:var(--font-space-mono)] active-press"
          >
            CREATE CLUB
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

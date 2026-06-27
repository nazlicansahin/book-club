"use client";

import Image from "next/image";
import { useAuth } from "@/components/auth/auth-provider";
import { getCharacter } from "@/lib/characters";

export function UserMenu() {
  const { user, profile, signOut } = useAuth();

  if (!user) return null;

  const character = profile?.characterId ? getCharacter(profile.characterId) : null;

  return (
    <div className="flex items-center gap-2">
      {character ? (
        <Image
          src={character.image}
          alt={profile?.displayName ?? "User"}
          width={32}
          height={32}
          className="w-8 h-8 pixel-border pixel-image object-contain bg-surface-container-high"
          unoptimized
        />
      ) : (
        <div className="w-8 h-8 pixel-border bg-surface-container-high flex items-center justify-center text-xs font-bold font-[family-name:var(--font-space-mono)]">
          {(profile?.displayName ?? user.displayName ?? "?").charAt(0).toUpperCase()}
        </div>
      )}
      <button
        type="button"
        onClick={() => signOut()}
        className="pixel-border bg-surface-container px-2 py-1 text-[10px] font-bold font-[family-name:var(--font-space-mono)] uppercase hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-75"
      >
        Sign out
      </button>
    </div>
  );
}

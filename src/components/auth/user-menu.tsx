"use client";

import Image from "next/image";
import { useAuth } from "@/components/auth/auth-provider";

export function UserMenu() {
  const { user, signOut } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center gap-2">
      {user.photoURL && (
        <Image
          src={user.photoURL}
          alt={user.displayName ?? "User"}
          width={32}
          height={32}
          className="w-8 h-8 pixel-border pixel-image object-cover"
          unoptimized
        />
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

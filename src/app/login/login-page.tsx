"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { AppHeader } from "@/components/layout/app-chrome";
import { StarField } from "@/components/layout/star-field";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { useAuth } from "@/components/auth/auth-provider";
import { getStoredCharacter } from "@/lib/player-store";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading, configured, signInWithGoogle, profile } = useAuth();
  const configError = searchParams.get("error") === "firebase-not-configured";

  useEffect(() => {
    if (loading || !user) return;

    const hasCharacter = profile?.characterId || getStoredCharacter();
    router.replace(hasCharacter ? "/dashboard" : "/character");
  }, [user, loading, profile, router]);

  return (
    <>
      <StarField />
      <AppHeader showLogo />
      <main className="flex-grow flex flex-col items-center w-full max-w-md px-4 pt-24 pb-16 mx-auto min-h-screen">
        <div className="relative w-32 h-32 mb-8">
          <div className="absolute inset-0 flex items-center justify-center flicker">
            <Image
              src="/assets/icons/fire-medium.png"
              alt="Quest Log"
              width={128}
              height={128}
              className="w-full h-full object-contain pixel-image"
              unoptimized
              priority
            />
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold font-[family-name:var(--font-space-mono)] text-primary uppercase mb-2 tracking-wider">
            Start Your Adventure
          </h1>
          <p className="text-sm text-on-surface-variant italic font-[family-name:var(--font-courier-prime)]">
            Sign in to create clubs, invite readers, and keep the streak alive.
          </p>
        </div>

        {configError || !configured ? (
          <div className="pixel-border bg-error-container text-on-error-container p-4 text-sm font-[family-name:var(--font-courier-prime)]">
            Firebase is not configured yet. Add your <code>NEXT_PUBLIC_FIREBASE_*</code> env vars
            in Vercel and enable Google sign-in in the Firebase console.
          </div>
        ) : (
          <div className="w-full px-2">
            <GoogleSignInButton onClick={signInWithGoogle} />
            <p className="mt-6 text-center text-[10px] font-bold font-[family-name:var(--font-space-mono)] text-outline uppercase tracking-widest">
              Google sign-in only
            </p>
          </div>
        )}
      </main>
    </>
  );
}

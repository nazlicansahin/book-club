"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./auth-provider";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading, configured } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!configured) {
      router.replace("/login?error=firebase-not-configured");
      return;
    }
    if (!user) router.replace("/login");
  }, [user, loading, configured, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm font-bold font-[family-name:var(--font-space-mono)] text-primary uppercase animate-pulse">
          Loading quest data...
        </p>
      </div>
    );
  }

  if (!configured || !user) return null;

  return <>{children}</>;
}

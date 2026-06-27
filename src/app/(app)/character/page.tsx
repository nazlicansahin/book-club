"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AppHeader, BottomNav } from "@/components/layout/app-chrome";
import { StarField } from "@/components/layout/star-field";
import { useAuth } from "@/components/auth/auth-provider";
import { CHARACTERS, type CharacterId } from "@/lib/characters";
import { saveUserCharacter } from "@/lib/users";

export default function CharacterSelectPage() {
  const router = useRouter();
  const { user, refreshProfile } = useAuth();
  const [selected, setSelected] = useState<CharacterId>("wizard");
  const [saving, setSaving] = useState(false);

  async function confirm() {
    if (!user) return;
    setSaving(true);
    try {
      await saveUserCharacter(selected);
      await refreshProfile();
      router.push("/dashboard");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <StarField />
      <AppHeader />
      <main className="flex-grow flex flex-col items-center w-full max-w-md px-4 app-content-pad-top app-content-pad-bottom mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold font-[family-name:var(--font-space-mono)] text-primary uppercase mb-1 tracking-wider">
            CHOOSE YOUR READER
          </h1>
          <p className="text-sm text-on-surface-variant italic font-[family-name:var(--font-courier-prime)]">
            The chronicles await your presence...
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 w-full mb-8">
          {CHARACTERS.map((char) => {
            const isSelected = selected === char.id;
            return (
              <button
                key={char.id}
                type="button"
                onClick={() => setSelected(char.id)}
                className={`text-left bg-surface-container-high border-4 p-1 cursor-pointer transition-all duration-75 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none ${
                  isSelected
                    ? "gold-border pixel-card-shadow-active active-selection"
                    : "border-black pixel-card-shadow"
                }`}
              >
                <div className="bg-surface-dim p-2 flex items-center justify-center relative overflow-hidden h-40">
                  <Image
                    src={char.image}
                    alt={char.name}
                    width={96}
                    height={96}
                    className="w-24 h-24 object-contain pixel-image"
                    unoptimized
                  />
                  <span className="absolute bottom-1 right-1 opacity-20 text-on-surface-variant material-symbols-outlined text-[40px]">
                    {char.icon}
                  </span>
                  {isSelected && (
                    <div className="absolute top-2 left-2 w-4 h-4 bg-tertiary-container animate-pulse" />
                  )}
                </div>
                <div className={`p-2 text-center mt-1 ${isSelected ? "bg-tertiary-container" : "bg-black/20"}`}>
                  <span
                    className={`text-xs font-bold font-[family-name:var(--font-space-mono)] uppercase block ${
                      isSelected ? "text-on-tertiary-container" : "text-on-surface"
                    }`}
                  >
                    {char.name}
                  </span>
                  <span
                    className={`text-[10px] font-bold font-[family-name:var(--font-space-mono)] uppercase block mt-1 ${
                      isSelected ? "text-on-tertiary-fixed-variant" : "text-secondary"
                    }`}
                  >
                    {char.subtitle}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="w-full mt-4 px-4">
          <button
            type="button"
            onClick={confirm}
            disabled={saving}
            className="w-full bg-tertiary text-on-tertiary py-4 px-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all duration-75 uppercase text-lg font-bold font-[family-name:var(--font-space-mono)] disabled:opacity-60"
          >
            {saving ? "SAVING..." : "CONFIRM SELECTION"}
          </button>
          <div className="mt-4 text-center">
            <span className="text-[10px] font-bold font-[family-name:var(--font-space-mono)] text-outline uppercase tracking-widest flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-outline rotate-45" />
              Press Start to Begin
              <span className="w-2 h-2 bg-outline rotate-45" />
            </span>
          </div>
        </div>
      </main>
      <BottomNav active="stats" />
    </>
  );
}

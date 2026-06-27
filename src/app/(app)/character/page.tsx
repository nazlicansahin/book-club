"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AppHeader, BottomNav } from "@/components/layout/app-chrome";
import { StarField } from "@/components/layout/star-field";
import { useAuth } from "@/components/auth/auth-provider";
import { CHARACTERS, type CharacterId } from "@/lib/characters";
import { saveUserProfile } from "@/lib/users";

export default function CharacterSelectPage() {
  const router = useRouter();
  const { user, profile, refreshProfile } = useAuth();
  const [nickname, setNickname] = useState("");
  const [selected, setSelected] = useState<CharacterId>("wizard");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setNickname(profile.displayName ?? "");
      if (profile.characterId) setSelected(profile.characterId);
    }
  }, [profile]);

  async function confirm() {
    if (!user) return;
    const name = nickname.trim();
    if (!name) return;

    setSaving(true);
    setSaved(false);
    try {
      await saveUserProfile({ displayName: name, characterId: selected });
      await refreshProfile();
      setSaved(true);
      setTimeout(() => router.push("/dashboard"), 600);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <StarField />
      <AppHeader title="CONFIG" />
      <main className="flex-grow flex flex-col items-center w-full app-page app-content-pad-top app-content-pad-bottom">
        <div className="text-center mb-6 w-full">
          <h1 className="text-2xl font-bold font-[family-name:var(--font-space-mono)] text-primary uppercase mb-1 tracking-wider">
            SETTINGS
          </h1>
          <p className="text-sm text-on-surface-variant italic font-[family-name:var(--font-courier-prime)]">
            Update your nickname and reader avatar
          </p>
        </div>

        <div className="w-full mb-6">
          <label className="text-xs font-bold font-[family-name:var(--font-space-mono)] uppercase text-secondary block mb-2">
            Nickname
          </label>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={32}
            placeholder="Your display name"
            className="w-full pixel-border bg-background px-4 py-3 text-sm font-[family-name:var(--font-courier-prime)] focus:outline-none focus:border-primary-container"
          />
        </div>

        <div className="text-center mb-4 w-full">
          <span className="text-xs font-bold font-[family-name:var(--font-space-mono)] uppercase text-secondary">
            Reader Avatar
          </span>
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
            disabled={saving || !nickname.trim()}
            className="w-full bg-tertiary text-on-tertiary py-4 px-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all duration-75 uppercase text-lg font-bold font-[family-name:var(--font-space-mono)] disabled:opacity-60"
          >
            {saving ? "SAVING..." : saved ? "SAVED!" : "SAVE"}
          </button>
        </div>
      </main>
      <BottomNav />
    </>
  );
}

"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AppHeader, BottomNav } from "@/components/layout/app-chrome";
import { markPunishmentSubmitted } from "@/lib/club-service";

export default function PunishmentPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  }

  async function submit() {
    setUploading(true);
    await markPunishmentSubmitted(params.id);
    router.push(`/clubs/${params.id}`);
  }

  return (
    <>
      <AppHeader title="PUNISHMENT" />
      <main className="app-content-pad-top app-content-pad-bottom px-4 max-w-md mx-auto">
        <div className="text-center mb-8">
          <span
            className="material-symbols-outlined text-4xl text-error mb-2"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            videocam
          </span>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-space-mono)] text-error uppercase">
            Send Punishment
          </h1>
          <p className="text-sm text-on-surface-variant mt-2 font-[family-name:var(--font-courier-prime)]">
            Record your punishment video to leave prison and return to the park.
          </p>
        </div>

        <label className="block pixel-border bg-surface-container-high h-64 mb-6 cursor-pointer overflow-hidden relative">
          {preview ? (
            <video src={preview} className="w-full h-full object-cover" controls playsInline />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center border-4 border-dashed border-error m-2">
              <span className="material-symbols-outlined text-5xl text-error mb-2">videocam</span>
              <span className="text-xs font-bold font-[family-name:var(--font-space-mono)] uppercase text-on-surface-variant">
                Tap to add video
              </span>
            </div>
          )}
          <input type="file" accept="video/*" capture="environment" className="hidden" onChange={handleFile} />
        </label>

        <button
          type="button"
          onClick={submit}
          disabled={!preview || uploading}
          className="w-full bg-error-container text-on-error-container py-4 pixel-border pixel-shadow uppercase text-lg font-bold font-[family-name:var(--font-space-mono)] disabled:opacity-50 active-press transition-all"
        >
          {uploading ? "RELEASED!" : "SEND PUNISHMENT"}
        </button>

        <Link
          href={`/clubs/${params.id}`}
          className="block text-center mt-4 text-sm text-on-surface-variant uppercase font-bold font-[family-name:var(--font-space-mono)]"
        >
          Cancel
        </Link>
      </main>
      <BottomNav />
    </>
  );
}

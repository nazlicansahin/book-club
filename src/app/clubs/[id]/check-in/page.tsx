"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AppHeader, BottomNav } from "@/components/layout/app-chrome";
import { markCheckedInToday } from "@/lib/player-store";

export default function CheckInPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [note, setNote] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
  }

  function submit() {
    setUploading(true);
    markCheckedInToday(params.id);
    setTimeout(() => {
      router.push(`/clubs/${params.id}`);
    }, 600);
  }

  return (
    <>
      <AppHeader title="ADD READING" />
      <main className="pt-24 px-4 max-w-md mx-auto pb-32">
        <div className="text-center mb-8">
          <span className="material-symbols-outlined text-4xl text-tertiary mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>
            menu_book
          </span>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-space-mono)] text-primary uppercase">
            ADD READING
          </h1>
          <p className="text-sm text-on-surface-variant mt-2">Upload today&apos;s reading photo</p>
        </div>

        <label className="block pixel-border bg-surface-container-high h-64 mb-6 cursor-pointer overflow-hidden relative">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center border-4 border-dashed border-outline m-2">
              <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-2">photo_camera</span>
              <span className="text-xs font-bold font-[family-name:var(--font-space-mono)] uppercase text-on-surface-variant">
                Tap to add photo
              </span>
            </div>
          )}
          <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />
        </label>

        <input
          type="text"
          placeholder="Page number or note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full pixel-border bg-background text-on-surface px-4 py-3 mb-6 text-sm font-[family-name:var(--font-courier-prime)] placeholder:text-on-surface-variant focus:outline-none focus:border-primary-container"
        />

        <button
          type="button"
          onClick={submit}
          disabled={!preview || uploading}
          className="w-full bg-tertiary text-on-tertiary py-4 pixel-border pixel-shadow uppercase text-lg font-bold font-[family-name:var(--font-space-mono)] disabled:opacity-50 active-press transition-all"
        >
          {uploading ? "+1 READ!" : "UPLOAD"}
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

"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AppHeader, BottomNav } from "@/components/layout/app-chrome";
import { submitPunishmentPhoto } from "@/lib/club-service";

export default function PunishmentPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (preview) URL.revokeObjectURL(preview);
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  async function submit() {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      await submitPunishmentPhoto(params.id, file);
      router.push(`/clubs/${params.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setUploading(false);
    }
  }

  return (
    <>
      <AppHeader title="PUNISHMENT" />
      <main className="app-content-pad-top app-content-pad-bottom app-page w-full">
        <div className="text-center mb-8">
          <span
            className="material-symbols-outlined text-4xl text-error mb-2"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            photo_camera
          </span>
          <h1 className="text-2xl font-bold font-[family-name:var(--font-space-mono)] text-error uppercase">
            Send Punishment
          </h1>
          <p className="text-sm text-on-surface-variant mt-2 font-[family-name:var(--font-courier-prime)]">
            Upload your punishment photo to leave prison and return to the park.
          </p>
        </div>

        <label className="block pixel-border bg-surface-container-high h-64 mb-6 cursor-pointer overflow-hidden relative">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center border-4 border-dashed border-error m-2">
              <span className="material-symbols-outlined text-5xl text-error mb-2">photo_camera</span>
              <span className="text-xs font-bold font-[family-name:var(--font-space-mono)] uppercase text-on-surface-variant">
                Tap to add photo
              </span>
            </div>
          )}
          <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFile} />
        </label>

        {error && (
          <p className="text-xs font-bold font-[family-name:var(--font-space-mono)] text-error mb-4">{error}</p>
        )}

        <button
          type="button"
          onClick={submit}
          disabled={!file || uploading}
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

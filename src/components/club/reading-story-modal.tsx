"use client";

import { useState } from "react";
import Image from "next/image";
import type { ClubMember } from "@/lib/clubs";
import { reactToPost } from "@/lib/club-service";
import { useAuth } from "@/components/auth/auth-provider";

const EMOJI_OPTIONS = ["🔥", "📖", "👏", "😂", "❤️"] as const;

type ReadingStoryModalProps = {
  clubId: string;
  member: ClubMember;
  onClose: () => void;
  onReaction?: (memberId: string, emoji: string) => void;
};

export function ReadingStoryModal({ clubId, member, onClose, onReaction }: ReadingStoryModalProps) {
  const { user, profile } = useAuth();
  const post = member.todayPost;
  const [reactions, setReactions] = useState(post?.reactions ?? []);
  const [sending, setSending] = useState(false);

  if (!post) {
    return (
      <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
        <div
          className="pixel-border bg-surface-container p-6 max-w-sm text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <p className="text-sm font-[family-name:var(--font-courier-prime)] text-on-surface-variant mb-4">
            {member.name} hasn&apos;t shared a reading photo today.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="pixel-border bg-tertiary text-on-tertiary px-4 py-2 text-xs font-bold font-[family-name:var(--font-space-mono)] uppercase"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const myReaction = reactions.find((r) => r.userId === user?.uid);

  async function handleReact(emoji: string) {
    if (sending) return;
    setSending(true);
    try {
      await reactToPost(clubId, post!.id, emoji);
      setReactions((prev) => {
        const without = prev.filter((r) => r.userId !== user?.uid);
        return [...without, { emoji, userId: user!.uid, name: profile?.displayName || "You" }];
      });
      onReaction?.(member.id, emoji);
    } finally {
      setSending(false);
    }
  }

  const counts = EMOJI_OPTIONS.map((emoji) => ({
    emoji,
    count: reactions.filter((r) => r.emoji === emoji).length,
  })).filter((c) => c.count > 0);

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col" onClick={onClose}>
      <div className="flex justify-between items-center p-4 shrink-0" onClick={(e) => e.stopPropagation()}>
        <span className="text-sm font-bold font-[family-name:var(--font-space-mono)] text-white uppercase">
          {member.name}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="material-symbols-outlined text-white text-2xl"
          aria-label="Close"
        >
          close
        </button>
      </div>

      <div className="flex-1 relative min-h-0 mx-4 mb-4" onClick={(e) => e.stopPropagation()}>
        <Image
          src={post.photoUrl}
          alt={`${member.name}'s reading`}
          fill
          className="object-contain pixel-image"
          unoptimized
        />
      </div>

      {post.note && (
        <p
          className="px-4 pb-2 text-sm text-white/90 font-[family-name:var(--font-courier-prime)] text-center"
          onClick={(e) => e.stopPropagation()}
        >
          {post.note}
        </p>
      )}

      {counts.length > 0 && (
        <div
          className="flex flex-wrap justify-center gap-2 px-4 pb-2"
          onClick={(e) => e.stopPropagation()}
        >
          {counts.map(({ emoji, count }) => (
            <span
              key={emoji}
              className="pixel-border bg-surface-container-high px-2 py-1 text-sm"
            >
              {emoji} {count}
            </span>
          ))}
        </div>
      )}

      <div
        className="flex justify-around items-center p-4 pb-8 bg-black/50 shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        {EMOJI_OPTIONS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => handleReact(emoji)}
            disabled={sending}
            className={`text-3xl p-2 transition-transform active:scale-125 ${
              myReaction?.emoji === emoji ? "scale-125 ring-2 ring-tertiary rounded-full" : ""
            }`}
            aria-label={`React ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}

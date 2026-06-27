import Image from "next/image";
import type { ClubMember } from "@/lib/clubs";
import { CharacterSprite } from "./character-sprite";

const SCENE_IMAGES = {
  pool: "/assets/scenes/scene-pool.png",
  park: "/assets/scenes/scene-park.png",
  prison: "/assets/scenes/scene-prison.png",
} as const;

const LABEL_STYLES = {
  pool: "bg-primary-container text-on-primary-container",
  park: "bg-secondary-container text-on-secondary-container",
  prison: "bg-error-container text-on-error-container",
} as const;

function MemberLabel({ name }: { name: string }) {
  return (
    <span className="mt-1 text-[10px] font-bold font-[family-name:var(--font-space-mono)] uppercase bg-black/70 text-white px-2 py-0.5 pixel-border text-center max-w-[88px] truncate">
      {name}
    </span>
  );
}

type SceneSectionProps = {
  area: keyof typeof SCENE_IMAGES;
  label: string;
  members: ClubMember[];
};

export function SceneSection({ area, label, members }: SceneSectionProps) {
  return (
    <section className="pixel-border bg-surface-container-high overflow-hidden pixel-shadow relative h-48 md:h-64">
      <div className="absolute inset-0 z-0">
        <Image
          src={SCENE_IMAGES[area]}
          alt={`${label} scene`}
          fill
          className="object-cover pixel-image"
          unoptimized
        />
      </div>
      <div className="absolute top-2 left-2 z-10">
        <div
          className={`${LABEL_STYLES[area]} px-3 py-1 pixel-border text-xs font-bold font-[family-name:var(--font-space-mono)] uppercase`}
        >
          {label}
        </div>
      </div>

      {area === "prison" ? (
        <div className="absolute inset-0 flex items-center justify-center gap-8 z-20 pt-8">
          {members.map((member) => (
            <div key={member.id} className="relative flex flex-col items-center">
              {member.punishment && (
                <div className="character-bubble text-[10px] font-bold font-[family-name:var(--font-space-mono)] mb-2 max-w-[160px] text-center">
                  {member.punishment}
                </div>
              )}
              <div className="relative">
                <CharacterSprite characterId={member.characterId} area="prison" size={80} grayscale />
                <div className="absolute inset-0 flex justify-around pointer-events-none">
                  <div className="w-1 bg-black/40 h-full" />
                  <div className="w-1 bg-black/40 h-full" />
                  <div className="w-1 bg-black/40 h-full" />
                </div>
              </div>
              <MemberLabel name={member.name} />
            </div>
          ))}
          {members.length === 0 && (
            <p className="text-xs font-[family-name:var(--font-space-mono)] text-on-surface-variant uppercase">
              No prisoners
            </p>
          )}
        </div>
      ) : (
        <div
          className={`absolute bottom-4 left-0 w-full flex items-end px-4 z-20 ${
            area === "park" ? "justify-center gap-8" : "justify-around"
          }`}
        >
          {members.map((member, i) => (
            <div
              key={member.id}
              className="flex flex-col items-center"
              style={{ transform: i === 1 && area === "pool" ? "translateY(8px)" : undefined }}
            >
              <CharacterSprite characterId={member.characterId} area={area} delay={i * 0.2} />
              <MemberLabel name={member.name} />
            </div>
          ))}
          {members.length === 0 && (
            <p className="text-xs font-[family-name:var(--font-space-mono)] text-on-surface-variant uppercase w-full text-center pb-2">
              Empty
            </p>
          )}
        </div>
      )}
    </section>
  );
}

import Image from "next/image";
import type { CharacterId } from "@/lib/characters";
import { characterImage } from "@/lib/characters";

type CharacterSpriteProps = {
  characterId: CharacterId;
  area?: "pool" | "park" | "prison";
  size?: number;
  className?: string;
  grayscale?: boolean;
  delay?: number;
};

export function CharacterSprite({
  characterId,
  area = "park",
  size = 64,
  className = "",
  grayscale = false,
  delay = 0,
}: CharacterSpriteProps) {
  const src = characterImage(characterId, area);

  return (
    <Image
      src={src}
      alt={characterId}
      width={size}
      height={size}
      className={`pixel-image sprite-idle object-contain ${grayscale ? "opacity-80 grayscale" : ""} ${className}`}
      style={{ animationDelay: `${delay}s` }}
      unoptimized
    />
  );
}

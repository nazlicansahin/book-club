export type CharacterId = "bookworm" | "ninja" | "wizard" | "cat";

export type MemberArea = "pool" | "park" | "prison";

export type Character = {
  id: CharacterId;
  name: string;
  subtitle: string;
  icon: string;
  image: string;
};

export const CHARACTERS: Character[] = [
  {
    id: "bookworm",
    name: "Bookworm",
    subtitle: "LVL 01 Scholar",
    icon: "menu_book",
    image: "/assets/characters/char-1-bookworm-park.png",
  },
  {
    id: "ninja",
    name: "Ninja",
    subtitle: "LVL 01 Scout",
    icon: "visibility_off",
    image: "/assets/characters/char-2-ninja-park.png",
  },
  {
    id: "wizard",
    name: "Wizard",
    subtitle: "LVL 01 Mage",
    icon: "auto_awesome",
    image: "/assets/characters/char-3-wizard-park.png",
  },
  {
    id: "cat",
    name: "The Cat",
    subtitle: "LVL 01 Familiar",
    icon: "pets",
    image: "/assets/characters/char-4-cat-park.png",
  },
];

export function getCharacter(id: CharacterId) {
  return CHARACTERS.find((c) => c.id === id) ?? CHARACTERS[0];
}

export function characterImage(id: CharacterId, area: MemberArea = "park") {
  const index = CHARACTERS.findIndex((c) => c.id === id) + 1;
  const slug = id === "cat" ? "cat" : id === "bookworm" ? "bookworm" : id;
  // Pool/prison poses reuse park until dedicated assets exist
  void area;
  return `/assets/characters/char-${index}-${slug}-park.png`;
}

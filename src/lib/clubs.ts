import type { CharacterId, MemberArea } from "./characters";

export type ClubMember = {
  id: string;
  name: string;
  characterId: CharacterId;
  area: MemberArea;
  punishment?: string;
  checkedInToday?: boolean;
};

export type Club = {
  id: string;
  name: string;
  bookTitle: string;
  currentStreak: number;
  bestStreak: number;
  members: ClubMember[];
  slotLabel: string;
};

export const DEMO_CLUBS: Club[] = [
  {
    id: "epic-fantasy",
    name: "EPIC FANTASY",
    bookTitle: "The Shadow Over Innsmouth",
    currentStreak: 14,
    bestStreak: 30,
    slotLabel: "SLOT 01",
    members: [
      { id: "m1", name: "You", characterId: "wizard", area: "park", checkedInToday: false },
      { id: "m2", name: "Alex", characterId: "ninja", area: "pool", checkedInToday: true },
      { id: "m3", name: "Sam", characterId: "bookworm", area: "pool", checkedInToday: true },
      { id: "m4", name: "Riley", characterId: "wizard", area: "pool", checkedInToday: true },
      { id: "m5", name: "Jordan", characterId: "cat", area: "park", checkedInToday: false },
      {
        id: "m6",
        name: "Casey",
        characterId: "wizard",
        area: "prison",
        checkedInToday: false,
        punishment: "Read the next page out loud to your pet",
      },
    ],
  },
  {
    id: "cyber-readers",
    name: "CYBER-READERS",
    bookTitle: "Neuromancer",
    currentStreak: 8,
    bestStreak: 12,
    slotLabel: "SLOT 02",
    members: [],
  },
  {
    id: "mystery-mania",
    name: "MYSTERY MANIA",
    bookTitle: "The Hound of the Baskervilles",
    currentStreak: 22,
    bestStreak: 22,
    slotLabel: "SLOT 03",
    members: [],
  },
];

export function getClub(id: string): Club | undefined {
  return DEMO_CLUBS.find((c) => c.id === id);
}

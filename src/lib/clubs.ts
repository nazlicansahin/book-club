import type { CharacterId, MemberArea } from "./characters";

export type ClubMember = {
  id: string;
  uid: string;
  name: string;
  characterId: CharacterId;
  area: MemberArea;
  punishment?: string;
  checkedInToday?: boolean;
  isCurrentUser?: boolean;
};

export type Club = {
  id: string;
  name: string;
  bookTitle: string;
  ownerId: string;
  inviteCode: string;
  currentStreak: number;
  bestStreak: number;
  members: ClubMember[];
};

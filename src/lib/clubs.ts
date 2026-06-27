import type { CharacterId, MemberArea } from "./characters";

export type ReadingReaction = {
  emoji: string;
  userId: string;
  name: string;
};

export type TodayPost = {
  id: string;
  photoUrl: string;
  note?: string;
  reactions: ReadingReaction[];
};

export type ClubMember = {
  id: string;
  uid: string;
  name: string;
  characterId: CharacterId;
  area: MemberArea;
  punishment?: string;
  checkedInToday?: boolean;
  isCurrentUser?: boolean;
  todayPost?: TodayPost;
};

export type Club = {
  id: string;
  name: string;
  bookTitle: string;
  ownerId: string;
  inviteCode: string;
  timezone: string;
  dayEndsAt: string;
  currentStreak: number;
  bestStreak: number;
  members: ClubMember[];
};

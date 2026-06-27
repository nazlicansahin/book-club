import type { User } from "firebase/auth";
import type { CharacterId } from "./characters";
import type { Club } from "./clubs";
import { authFetch } from "./api-client";
import type { MemberArea } from "./characters";

export type ClubPlayerState = {
  area: MemberArea;
  checkInDate?: string | null;
  punishmentDate?: string | null;
};

export async function createClub(user: User, name: string, bookTitle: string): Promise<Club> {
  void user;
  return authFetch("/api/clubs", {
    method: "POST",
    body: JSON.stringify({ name, bookTitle }),
  }) as Promise<Club>;
}

export async function joinClubByCode(user: User, rawCode: string): Promise<string> {
  void user;
  const data = (await authFetch("/api/clubs/join", {
    method: "POST",
    body: JSON.stringify({ code: rawCode }),
  })) as { clubId: string };
  return data.clubId;
}

export async function getClubWithMembers(clubId: string): Promise<Club | null> {
  try {
    return (await authFetch(`/api/clubs/${clubId}`)) as Club;
  } catch {
    return null;
  }
}

export async function getUserClubs(): Promise<Club[]> {
  const data = (await authFetch("/api/clubs")) as { clubs: Club[] };
  return data.clubs;
}

export async function getClubPlayerState(clubId: string): Promise<ClubPlayerState> {
  const data = (await authFetch(`/api/clubs/${clubId}/member-state`)) as ClubPlayerState;
  return data;
}

export async function markPunishmentSubmitted(clubId: string) {
  await authFetch(`/api/clubs/${clubId}/member-state`, {
    method: "PATCH",
    body: JSON.stringify({ action: "punishment" }),
  });
}

export async function markCheckedInToday(clubId: string) {
  await authFetch(`/api/clubs/${clubId}/member-state`, {
    method: "PATCH",
    body: JSON.stringify({ action: "check-in" }),
  });
}

export async function needsPunishmentVideo(clubId: string): Promise<boolean> {
  const state = await getClubPlayerState(clubId);
  return state.area === "prison";
}

export async function canSubmitReading(clubId: string): Promise<boolean> {
  const state = await getClubPlayerState(clubId);
  return state.area === "park";
}

export function getStoredCharacter(): CharacterId | null {
  return null;
}

export function setStoredCharacter(_id: CharacterId) {
  void _id;
}

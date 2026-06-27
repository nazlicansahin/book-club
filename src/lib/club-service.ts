import type { User } from "firebase/auth";
import type { CharacterId } from "./characters";
import type { Club } from "./clubs";
import { authFetch } from "./api-client";
import type { MemberArea } from "./characters";
import { invalidateClubsCache } from "./clubs-cache";

export type ClubPlayerState = {
  area: MemberArea;
  checkInDate?: string | null;
  punishmentDate?: string | null;
};

export async function createClub(
  user: User,
  name: string,
  bookTitle: string,
  timezone?: string
): Promise<Club> {
  void user;
  invalidateClubsCache();
  return authFetch("/api/clubs", {
    method: "POST",
    body: JSON.stringify({
      name,
      bookTitle,
      timezone: timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
    }),
  }) as Promise<Club>;
}

export async function joinClubByCode(user: User, rawCode: string): Promise<string> {
  void user;
  invalidateClubsCache();
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

export async function submitCheckIn(clubId: string, photo: File, note?: string) {
  const formData = new FormData();
  formData.append("photo", photo);
  if (note) formData.append("note", note);

  const { authFetchForm } = await import("./api-client");
  return authFetchForm(`/api/clubs/${clubId}/check-in`, {
    method: "POST",
    body: formData,
  });
}

export async function reactToPost(clubId: string, postId: string, emoji: string) {
  await authFetch(`/api/clubs/${clubId}/posts/${postId}/reactions`, {
    method: "POST",
    body: JSON.stringify({ emoji }),
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

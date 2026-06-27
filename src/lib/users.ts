import type { CharacterId } from "./characters";

export type UserProfile = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  characterId: CharacterId | null;
};

export async function syncUserProfile(): Promise<UserProfile> {
  const { authFetch } = await import("./api-client");
  return authFetch("/api/me", { method: "POST" }) as Promise<UserProfile>;
}

export async function getUserProfile(): Promise<UserProfile | null> {
  const { authFetch } = await import("./api-client");
  try {
    return (await authFetch("/api/me")) as UserProfile;
  } catch {
    return null;
  }
}

export async function saveUserCharacter(characterId: CharacterId) {
  const { authFetch } = await import("./api-client");
  return authFetch("/api/me", {
    method: "PATCH",
    body: JSON.stringify({ characterId }),
  });
}

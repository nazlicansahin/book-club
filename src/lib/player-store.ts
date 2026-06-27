"use client";

import type { CharacterId } from "./characters";

const CHARACTER_KEY = "quest-log-character";
const CHECKINS_KEY = "quest-log-checkins";

export function getStoredCharacter(): CharacterId | null {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(CHARACTER_KEY);
  return v as CharacterId | null;
}

export function setStoredCharacter(id: CharacterId) {
  localStorage.setItem(CHARACTER_KEY, id);
}

export function hasCheckedInToday(clubId: string): boolean {
  if (typeof window === "undefined") return false;
  const raw = localStorage.getItem(CHECKINS_KEY);
  if (!raw) return false;
  const data = JSON.parse(raw) as Record<string, string>;
  const today = new Date().toISOString().slice(0, 10);
  return data[clubId] === today;
}

export function markCheckedInToday(clubId: string) {
  const raw = localStorage.getItem(CHECKINS_KEY);
  const data = raw ? (JSON.parse(raw) as Record<string, string>) : {};
  data[clubId] = new Date().toISOString().slice(0, 10);
  localStorage.setItem(CHECKINS_KEY, JSON.stringify(data));
}

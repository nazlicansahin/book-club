"use client";

import type { CharacterId, MemberArea } from "./characters";

const CHARACTER_KEY = "quest-log-character";
const CLUB_STATE_KEY = "quest-log-club-state";

export type ClubPlayerState = {
  area: MemberArea;
  checkInDate?: string;
  punishmentDate?: string;
};

type ClubStateMap = Record<string, ClubPlayerState>;

function today() {
  return new Date().toISOString().slice(0, 10);
}

function readClubStates(): ClubStateMap {
  if (typeof window === "undefined") return {};
  const raw = localStorage.getItem(CLUB_STATE_KEY);
  return raw ? (JSON.parse(raw) as ClubStateMap) : {};
}

function writeClubStates(states: ClubStateMap) {
  localStorage.setItem(CLUB_STATE_KEY, JSON.stringify(states));
}

export function getStoredCharacter(): CharacterId | null {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(CHARACTER_KEY);
  return v as CharacterId | null;
}

export function setStoredCharacter(id: CharacterId) {
  localStorage.setItem(CHARACTER_KEY, id);
}

export function getClubPlayerState(clubId: string, fallbackArea: MemberArea = "park"): ClubPlayerState {
  const stored = readClubStates()[clubId];
  if (!stored) return { area: fallbackArea };

  const todayStr = today();
  if (stored.checkInDate === todayStr) {
    return { ...stored, area: "pool" };
  }

  if (stored.punishmentDate === todayStr && stored.area !== "pool") {
    return { ...stored, area: "park" };
  }

  return stored;
}

export function markPunishmentSubmitted(clubId: string) {
  const states = readClubStates();
  states[clubId] = {
    area: "park",
    punishmentDate: today(),
    checkInDate: states[clubId]?.checkInDate,
  };
  writeClubStates(states);
}

export function markCheckedInToday(clubId: string) {
  const states = readClubStates();
  const todayStr = today();
  states[clubId] = {
    area: "pool",
    checkInDate: todayStr,
    punishmentDate: states[clubId]?.punishmentDate,
  };
  writeClubStates(states);
}

export function hasCheckedInToday(clubId: string): boolean {
  return getClubPlayerState(clubId).area === "pool" && getClubPlayerState(clubId).checkInDate === today();
}

export function needsPunishmentVideo(clubId: string): boolean {
  const state = getClubPlayerState(clubId);
  return state.area === "prison";
}

export function canSubmitReading(clubId: string): boolean {
  const state = getClubPlayerState(clubId);
  return state.area === "park";
}

import {
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import type { User } from "firebase/auth";
import type { CharacterId } from "./characters";
import { getFirebaseDb } from "./firebase";
import type { Club, ClubMember } from "./clubs";
import { getUserProfile } from "./users";

const DEFAULT_CHARACTER: CharacterId = "wizard";

function generateInviteCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

async function resolveCharacterId(user: User): Promise<CharacterId> {
  const profile = await getUserProfile(user.uid);
  return profile?.characterId ?? DEFAULT_CHARACTER;
}

export async function createClub(user: User, name: string, bookTitle: string): Promise<Club> {
  const db = getFirebaseDb();
  const clubRef = doc(collection(db, "clubs"));
  const inviteCode = generateInviteCode();
  const characterId = await resolveCharacterId(user);
  const displayName = user.displayName || user.email?.split("@")[0] || "Reader";

  const batch = writeBatch(db);

  batch.set(clubRef, {
    name: name.trim(),
    bookTitle: bookTitle.trim(),
    ownerId: user.uid,
    inviteCode,
    currentStreak: 0,
    bestStreak: 0,
    createdAt: serverTimestamp(),
  });

  batch.set(doc(db, "inviteCodes", inviteCode), {
    clubId: clubRef.id,
    ownerId: user.uid,
    createdAt: serverTimestamp(),
  });

  batch.set(doc(db, "clubs", clubRef.id, "members", user.uid), {
    uid: user.uid,
    displayName,
    characterId,
    area: "park",
    joinedAt: serverTimestamp(),
  });

  batch.set(doc(db, "users", user.uid, "memberships", clubRef.id), {
    role: "owner",
    joinedAt: serverTimestamp(),
  });

  await batch.commit();

  return {
    id: clubRef.id,
    name: name.trim(),
    bookTitle: bookTitle.trim(),
    ownerId: user.uid,
    inviteCode,
    currentStreak: 0,
    bestStreak: 0,
    members: [
      {
        id: user.uid,
        uid: user.uid,
        name: displayName,
        characterId,
        area: "park",
        isCurrentUser: true,
      },
    ],
  };
}

export async function joinClubByCode(user: User, rawCode: string): Promise<string> {
  const code = rawCode.trim().toUpperCase();
  const db = getFirebaseDb();

  const inviteSnap = await getDoc(doc(db, "inviteCodes", code));
  if (!inviteSnap.exists()) {
    throw new Error("Invalid invite code. Check the code and try again.");
  }

  const { clubId } = inviteSnap.data() as { clubId: string };
  const memberRef = doc(db, "clubs", clubId, "members", user.uid);
  const existing = await getDoc(memberRef);
  if (existing.exists()) {
    return clubId;
  }

  const characterId = await resolveCharacterId(user);
  const displayName = user.displayName || user.email?.split("@")[0] || "Reader";

  const batch = writeBatch(db);
  batch.set(memberRef, {
    uid: user.uid,
    displayName,
    characterId,
    area: "park",
    joinedAt: serverTimestamp(),
  });
  batch.set(doc(db, "users", user.uid, "memberships", clubId), {
    role: "member",
    joinedAt: serverTimestamp(),
  });
  await batch.commit();

  return clubId;
}

export async function getUserClubIds(uid: string): Promise<string[]> {
  const snap = await getDocs(collection(getFirebaseDb(), "users", uid, "memberships"));
  return snap.docs.map((d) => d.id);
}

export async function getClubWithMembers(clubId: string, currentUid?: string): Promise<Club | null> {
  const db = getFirebaseDb();
  const clubSnap = await getDoc(doc(db, "clubs", clubId));
  if (!clubSnap.exists()) return null;

  const data = clubSnap.data();
  const membersSnap = await getDocs(collection(db, "clubs", clubId, "members"));

  const members: ClubMember[] = membersSnap.docs.map((memberDoc) => {
    const m = memberDoc.data();
    const uid = memberDoc.id;
    return {
      id: uid,
      uid,
      name: (m.displayName as string) || "Reader",
      characterId: (m.characterId as CharacterId) || DEFAULT_CHARACTER,
      area: (m.area as ClubMember["area"]) || "park",
      punishment: m.punishment as string | undefined,
      checkedInToday: m.area === "pool",
      isCurrentUser: uid === currentUid,
    };
  });

  return {
    id: clubSnap.id,
    name: data.name as string,
    bookTitle: data.bookTitle as string,
    ownerId: data.ownerId as string,
    inviteCode: data.inviteCode as string,
    currentStreak: (data.currentStreak as number) ?? 0,
    bestStreak: (data.bestStreak as number) ?? 0,
    members,
  };
}

export async function getUserClubs(uid: string): Promise<Club[]> {
  const clubIds = await getUserClubIds(uid);
  const clubs = await Promise.all(clubIds.map((id) => getClubWithMembers(id, uid)));
  return clubs.filter((c): c is Club => c !== null);
}

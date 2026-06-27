import { and, eq } from "drizzle-orm";
import type { CharacterId, MemberArea } from "@/lib/characters";
import type { Club, ClubMember } from "@/lib/clubs";
import { getDb } from "@/db";
import { clubMembers, clubs, users } from "@/db/schema";

const DEFAULT_CHARACTER: CharacterId = "wizard";

function generateInviteCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function effectiveArea(
  area: string,
  checkInDate: string | null,
  punishmentDate: string | null
): MemberArea {
  const todayStr = today();
  if (checkInDate === todayStr) return "pool";
  if (punishmentDate === todayStr && area === "prison") return "park";
  return (area as MemberArea) || "park";
}

function toMember(
  row: {
    userId: string;
    area: string;
    punishment: string | null;
    checkInDate: string | null;
    punishmentDate: string | null;
    displayName: string | null;
    characterId: string | null;
  },
  currentUid?: string
): ClubMember {
  const area = effectiveArea(row.area, row.checkInDate, row.punishmentDate);
  return {
    id: row.userId,
    uid: row.userId,
    name: row.displayName || "Reader",
    characterId: (row.characterId as CharacterId) || DEFAULT_CHARACTER,
    area,
    punishment: row.punishment ?? undefined,
    checkedInToday: area === "pool",
    isCurrentUser: row.userId === currentUid,
  };
}

export async function ensureUser(
  uid: string,
  email: string | null,
  displayName: string | null,
  photoURL: string | null
) {
  const db = getDb();
  const existing = await db.query.users.findFirst({ where: eq(users.id, uid) });
  if (existing) {
    await db
      .update(users)
      .set({
        email,
        displayName,
        photoUrl: photoURL,
        updatedAt: new Date(),
      })
      .where(eq(users.id, uid));
    return existing;
  }

  const [created] = await db
    .insert(users)
    .values({
      id: uid,
      email,
      displayName,
      photoUrl: photoURL,
    })
    .returning();
  return created;
}

export async function getUserById(uid: string) {
  const db = getDb();
  return db.query.users.findFirst({ where: eq(users.id, uid) });
}

export async function updateUserCharacter(uid: string, characterId: CharacterId) {
  const db = getDb();
  await db
    .update(users)
    .set({ characterId, updatedAt: new Date() })
    .where(eq(users.id, uid));
}

export async function createClubRecord(
  ownerId: string,
  name: string,
  bookTitle: string,
  displayName: string,
  characterId: CharacterId
): Promise<Club> {
  const db = getDb();
  const inviteCode = generateInviteCode();

  const [club] = await db
    .insert(clubs)
    .values({
      name: name.trim(),
      bookTitle: bookTitle.trim(),
      ownerId,
      inviteCode,
    })
    .returning();

  await db.insert(clubMembers).values({
    clubId: club.id,
    userId: ownerId,
    role: "owner",
    area: "park",
  });

  return {
    id: club.id,
    name: club.name,
    bookTitle: club.bookTitle,
    ownerId: club.ownerId,
    inviteCode: club.inviteCode,
    currentStreak: club.currentStreak,
    bestStreak: club.bestStreak,
    members: [
      {
        id: ownerId,
        uid: ownerId,
        name: displayName,
        characterId,
        area: "park",
        isCurrentUser: true,
      },
    ],
  };
}

export async function joinClubByInviteCode(
  userId: string,
  rawCode: string,
  displayName: string,
  characterId: CharacterId
): Promise<string> {
  const db = getDb();
  const code = rawCode.trim().toUpperCase();

  const club = await db.query.clubs.findFirst({ where: eq(clubs.inviteCode, code) });
  if (!club) throw new Error("Invalid invite code. Check the code and try again.");

  const existing = await db.query.clubMembers.findFirst({
    where: and(eq(clubMembers.clubId, club.id), eq(clubMembers.userId, userId)),
  });

  if (!existing) {
    await db.insert(clubMembers).values({
      clubId: club.id,
      userId,
      role: "member",
      area: "park",
    });
  }

  return club.id;
}

export async function getClubWithMembers(clubId: string, currentUid?: string): Promise<Club | null> {
  const db = getDb();
  const club = await db.query.clubs.findFirst({ where: eq(clubs.id, clubId) });
  if (!club) return null;

  const rows = await db
    .select({
      userId: clubMembers.userId,
      area: clubMembers.area,
      punishment: clubMembers.punishment,
      checkInDate: clubMembers.checkInDate,
      punishmentDate: clubMembers.punishmentDate,
      displayName: users.displayName,
      characterId: users.characterId,
    })
    .from(clubMembers)
    .innerJoin(users, eq(clubMembers.userId, users.id))
    .where(eq(clubMembers.clubId, clubId));

  return {
    id: club.id,
    name: club.name,
    bookTitle: club.bookTitle,
    ownerId: club.ownerId,
    inviteCode: club.inviteCode,
    currentStreak: club.currentStreak,
    bestStreak: club.bestStreak,
    members: rows.map((row) => toMember(row, currentUid)),
  };
}

export async function getUserClubs(uid: string): Promise<Club[]> {
  const db = getDb();
  const memberships = await db
    .select({ clubId: clubMembers.clubId })
    .from(clubMembers)
    .where(eq(clubMembers.userId, uid));

  const result: Club[] = [];
  for (const { clubId } of memberships) {
    const club = await getClubWithMembers(clubId, uid);
    if (club) result.push(club);
  }
  return result;
}

export async function getMemberState(clubId: string, userId: string) {
  const db = getDb();
  const member = await db.query.clubMembers.findFirst({
    where: and(eq(clubMembers.clubId, clubId), eq(clubMembers.userId, userId)),
  });
  if (!member) return null;

  const area = effectiveArea(member.area, member.checkInDate, member.punishmentDate);
  return {
    area,
    checkInDate: member.checkInDate,
    punishmentDate: member.punishmentDate,
  };
}

export async function markPunishmentSubmitted(clubId: string, userId: string) {
  const db = getDb();
  const todayStr = today();
  await db
    .update(clubMembers)
    .set({ area: "park", punishmentDate: todayStr })
    .where(and(eq(clubMembers.clubId, clubId), eq(clubMembers.userId, userId)));
}

export async function markCheckedInToday(clubId: string, userId: string) {
  const db = getDb();
  const todayStr = today();
  await db
    .update(clubMembers)
    .set({ area: "pool", checkInDate: todayStr })
    .where(and(eq(clubMembers.clubId, clubId), eq(clubMembers.userId, userId)));
}

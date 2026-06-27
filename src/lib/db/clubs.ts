import { and, eq, inArray, lt } from "drizzle-orm";
import { del } from "@vercel/blob";
import type { CharacterId, MemberArea } from "@/lib/characters";
import type { Club, ClubMember, TodayPost } from "@/lib/clubs";
import { getClubLocalDate, getDayEndIso, getPreviousDate, normalizeTimezone } from "@/lib/club-day";
import { getDb } from "@/db";
import { clubMembers, clubs, readingPosts, readingReactions, users } from "@/db/schema";

const DEFAULT_CHARACTER: CharacterId = "wizard";

function generateInviteCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

function effectiveArea(
  area: string,
  checkInDate: string | null,
  punishmentDate: string | null,
  clubToday: string
): MemberArea {
  if (normalizeDate(checkInDate) === clubToday) return "pool";
  if (normalizeDate(punishmentDate) === clubToday && area === "prison") return "park";
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
  clubToday: string,
  currentUid?: string,
  todayPost?: TodayPost
): ClubMember {
  const area = effectiveArea(row.area, row.checkInDate, row.punishmentDate, clubToday);
  return {
    id: row.userId,
    uid: row.userId,
    name: row.displayName || "Reader",
    characterId: (row.characterId as CharacterId) || DEFAULT_CHARACTER,
    area,
    punishment: row.punishment ?? undefined,
    checkedInToday: area === "pool",
    isCurrentUser: row.userId === currentUid,
    todayPost,
  };
}

function clubToResponse(
  club: typeof clubs.$inferSelect,
  members: ClubMember[],
  timezone: string
): Club {
  return {
    id: club.id,
    name: club.name,
    bookTitle: club.bookTitle,
    ownerId: club.ownerId,
    inviteCode: club.inviteCode,
    timezone,
    dayEndsAt: getDayEndIso(timezone),
    currentStreak: club.currentStreak,
    bestStreak: club.bestStreak,
    members,
  };
}

async function cleanupExpiredPosts(clubId: string, clubToday: string) {
  const db = getDb();
  const expired = await db
    .select({ id: readingPosts.id, photoUrl: readingPosts.photoUrl })
    .from(readingPosts)
    .where(and(eq(readingPosts.clubId, clubId), lt(readingPosts.checkInDate, clubToday)));

  if (expired.length === 0) return;

  const ids = expired.map((p) => p.id);
  await db.delete(readingReactions).where(inArray(readingReactions.postId, ids));
  await db.delete(readingPosts).where(inArray(readingPosts.id, ids));

  await Promise.allSettled(
    expired.map((p) => {
      if (p.photoUrl) return del(p.photoUrl);
    })
  );
}

function normalizeDate(value: string | Date | null | undefined): string | null {
  if (!value) return null;
  if (typeof value === "string") return value.slice(0, 10);
  return value.toISOString().slice(0, 10);
}

async function evaluateClubDayRollover(clubId: string) {
  const db = getDb();
  let club = await db.query.clubs.findFirst({ where: eq(clubs.id, clubId) });
  if (!club) return;

  const timezone = normalizeTimezone(club.timezone);
  const clubToday = getClubLocalDate(timezone);
  const yesterday = getPreviousDate(clubToday);

  await cleanupExpiredPosts(clubId, clubToday);

  const lastEval = normalizeDate(club.lastStreakEvaluatedDate);
  const clubCreatedDate = getClubLocalDate(timezone, club.createdAt);

  if (!lastEval || lastEval < yesterday) {
    if (clubCreatedDate <= yesterday) {
      const lastStreakDay = normalizeDate(club.lastStreakDay);
      if (lastStreakDay !== yesterday) {
        await db.update(clubs).set({ currentStreak: 0 }).where(eq(clubs.id, clubId));
      }
    }

    await db
      .update(clubs)
      .set({ lastStreakEvaluatedDate: yesterday })
      .where(eq(clubs.id, clubId));

    club = (await db.query.clubs.findFirst({ where: eq(clubs.id, clubId) }))!;
  }

  const memberRows = await db
    .select({ checkInDate: clubMembers.checkInDate })
    .from(clubMembers)
    .where(eq(clubMembers.clubId, clubId));

  if (memberRows.length === 0) return;

  const allCheckedInToday = memberRows.every(
    (m) => normalizeDate(m.checkInDate) === clubToday
  );

  const lastStreakDay = normalizeDate(club.lastStreakDay);
  if (!allCheckedInToday || lastStreakDay === clubToday) return;

  let newStreak = 1;
  if (lastStreakDay === yesterday) {
    newStreak = club.currentStreak + 1;
  }

  await db
    .update(clubs)
    .set({
      currentStreak: newStreak,
      bestStreak: Math.max(club.bestStreak, newStreak),
      lastStreakDay: clubToday,
    })
    .where(eq(clubs.id, clubId));

  for (const member of await db
    .select({
      userId: clubMembers.userId,
      checkInDate: clubMembers.checkInDate,
      area: clubMembers.area,
      joinedAt: clubMembers.joinedAt,
    })
    .from(clubMembers)
    .where(eq(clubMembers.clubId, clubId))) {
    const joinedDate = getClubLocalDate(timezone, member.joinedAt);
    if (
      joinedDate <= yesterday &&
      normalizeDate(member.checkInDate) !== yesterday &&
      member.area !== "prison"
    ) {
      await db
        .update(clubMembers)
        .set({ area: "prison" })
        .where(and(eq(clubMembers.clubId, clubId), eq(clubMembers.userId, member.userId)));
    }
  }
}

async function getTodayPostsForClub(clubId: string, clubToday: string): Promise<Map<string, TodayPost>> {
  const db = getDb();
  const posts = await db
    .select({
      id: readingPosts.id,
      userId: readingPosts.userId,
      photoUrl: readingPosts.photoUrl,
      note: readingPosts.note,
    })
    .from(readingPosts)
    .where(and(eq(readingPosts.clubId, clubId), eq(readingPosts.checkInDate, clubToday)));

  if (posts.length === 0) return new Map();

  const postIds = posts.map((p) => p.id);
  const reactions = await db
    .select({
      postId: readingReactions.postId,
      userId: readingReactions.userId,
      emoji: readingReactions.emoji,
      displayName: users.displayName,
    })
    .from(readingReactions)
    .innerJoin(users, eq(readingReactions.userId, users.id))
    .where(inArray(readingReactions.postId, postIds));

  const reactionsByPost = new Map<string, TodayPost["reactions"]>();
  for (const r of reactions) {
    const list = reactionsByPost.get(r.postId) ?? [];
    list.push({ emoji: r.emoji, userId: r.userId, name: r.displayName || "Reader" });
    reactionsByPost.set(r.postId, list);
  }

  const map = new Map<string, TodayPost>();
  for (const post of posts) {
    map.set(post.userId, {
      id: post.id,
      photoUrl: post.photoUrl,
      note: post.note ?? undefined,
      reactions: reactionsByPost.get(post.id) ?? [],
    });
  }
  return map;
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

export async function updateUserDisplayName(uid: string, displayName: string) {
  const db = getDb();
  await db
    .update(users)
    .set({ displayName: displayName.trim(), updatedAt: new Date() })
    .where(eq(users.id, uid));
}

export async function createClubRecord(
  ownerId: string,
  name: string,
  bookTitle: string,
  displayName: string,
  characterId: CharacterId,
  timezone?: string
): Promise<Club> {
  const db = getDb();
  const inviteCode = generateInviteCode();
  const tz = normalizeTimezone(timezone);

  const [club] = await db
    .insert(clubs)
    .values({
      name: name.trim(),
      bookTitle: bookTitle.trim(),
      ownerId,
      inviteCode,
      timezone: tz,
    })
    .returning();

  await db.insert(clubMembers).values({
    clubId: club.id,
    userId: ownerId,
    role: "owner",
    area: "park",
  });

  return clubToResponse(club, [
    {
      id: ownerId,
      uid: ownerId,
      name: displayName,
      characterId,
      area: "park",
      isCurrentUser: true,
    },
  ], tz);
}

export async function joinClubByInviteCode(
  userId: string,
  rawCode: string,
  _displayName: string,
  _characterId: CharacterId
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
  await evaluateClubDayRollover(clubId);

  const db = getDb();
  const club = await db.query.clubs.findFirst({ where: eq(clubs.id, clubId) });
  if (!club) return null;

  const timezone = normalizeTimezone(club.timezone);
  const clubToday = getClubLocalDate(timezone);
  const todayPosts = await getTodayPostsForClub(clubId, clubToday);

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

  const members = rows.map((row) =>
    toMember(row, clubToday, currentUid, todayPosts.get(row.userId))
  );

  return clubToResponse(club, members, timezone);
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
  const club = await db.query.clubs.findFirst({ where: eq(clubs.id, clubId) });
  const timezone = normalizeTimezone(club?.timezone);
  const clubToday = getClubLocalDate(timezone);

  const member = await db.query.clubMembers.findFirst({
    where: and(eq(clubMembers.clubId, clubId), eq(clubMembers.userId, userId)),
  });
  if (!member) return null;

  const area = effectiveArea(member.area, member.checkInDate, member.punishmentDate, clubToday);
  return {
    area,
    checkInDate: member.checkInDate,
    punishmentDate: member.punishmentDate,
  };
}

export async function markPunishmentSubmitted(
  clubId: string,
  userId: string,
  photoUrl?: string
) {
  const db = getDb();
  const club = await db.query.clubs.findFirst({ where: eq(clubs.id, clubId) });
  const clubToday = getClubLocalDate(normalizeTimezone(club?.timezone));
  await db
    .update(clubMembers)
    .set({
      area: "park",
      punishmentDate: clubToday,
      punishmentPhotoUrl: photoUrl ?? null,
    })
    .where(and(eq(clubMembers.clubId, clubId), eq(clubMembers.userId, userId)));
}

export async function sendMemberToPrison(clubId: string, userId: string) {
  const db = getDb();
  await db
    .update(clubMembers)
    .set({ area: "prison", punishmentDate: null })
    .where(and(eq(clubMembers.clubId, clubId), eq(clubMembers.userId, userId)));
}

export async function deleteClub(clubId: string, ownerId: string) {
  const db = getDb();
  const club = await db.query.clubs.findFirst({ where: eq(clubs.id, clubId) });
  if (!club) throw new Error("Club not found");
  if (club.ownerId !== ownerId) throw new Error("Only the club owner can delete this club");

  const posts = await db
    .select({ photoUrl: readingPosts.photoUrl })
    .from(readingPosts)
    .where(eq(readingPosts.clubId, clubId));

  await db.delete(clubs).where(eq(clubs.id, clubId));

  await Promise.allSettled(posts.map((p) => (p.photoUrl ? del(p.photoUrl) : undefined)));
}

export async function markCheckedInToday(clubId: string, userId: string) {
  const db = getDb();
  const club = await db.query.clubs.findFirst({ where: eq(clubs.id, clubId) });
  const clubToday = getClubLocalDate(normalizeTimezone(club?.timezone));
  await db
    .update(clubMembers)
    .set({ area: "pool", checkInDate: clubToday })
    .where(and(eq(clubMembers.clubId, clubId), eq(clubMembers.userId, userId)));
}

export async function createReadingPost(
  clubId: string,
  userId: string,
  photoUrl: string,
  note?: string
) {
  const db = getDb();
  const club = await db.query.clubs.findFirst({ where: eq(clubs.id, clubId) });
  const clubToday = getClubLocalDate(normalizeTimezone(club?.timezone));

  const existing = await db.query.readingPosts.findFirst({
    where: and(
      eq(readingPosts.clubId, clubId),
      eq(readingPosts.userId, userId),
      eq(readingPosts.checkInDate, clubToday)
    ),
  });

  if (existing) {
    await db
      .update(readingPosts)
      .set({ photoUrl, note: note ?? null })
      .where(eq(readingPosts.id, existing.id));
    await markCheckedInToday(clubId, userId);
    return existing.id;
  }

  const [post] = await db
    .insert(readingPosts)
    .values({
      clubId,
      userId,
      checkInDate: clubToday,
      photoUrl,
      note: note ?? null,
    })
    .returning();

  await markCheckedInToday(clubId, userId);
  return post.id;
}

export async function upsertReadingReaction(postId: string, userId: string, emoji: string) {
  const db = getDb();
  await db
    .insert(readingReactions)
    .values({ postId, userId, emoji })
    .onConflictDoUpdate({
      target: [readingReactions.postId, readingReactions.userId],
      set: { emoji },
    });
}

export async function getReadingPostForReaction(postId: string) {
  const db = getDb();
  return db.query.readingPosts.findFirst({ where: eq(readingPosts.id, postId) });
}

export async function isClubMember(clubId: string, userId: string) {
  const db = getDb();
  const member = await db.query.clubMembers.findFirst({
    where: and(eq(clubMembers.clubId, clubId), eq(clubMembers.userId, userId)),
  });
  return !!member;
}

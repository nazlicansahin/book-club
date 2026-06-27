import { date, integer, pgTable, primaryKey, text, timestamp, unique, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email"),
  displayName: text("display_name"),
  photoUrl: text("photo_url"),
  characterId: text("character_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const clubs = pgTable("clubs", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  bookTitle: text("book_title").notNull(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id),
  inviteCode: text("invite_code").notNull().unique(),
  timezone: text("timezone").default("UTC").notNull(),
  currentStreak: integer("current_streak").default(0).notNull(),
  bestStreak: integer("best_streak").default(0).notNull(),
  lastStreakEvaluatedDate: date("last_streak_evaluated_date"),
  lastStreakDay: date("last_streak_day"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const clubMembers = pgTable(
  "club_members",
  {
    clubId: uuid("club_id")
      .notNull()
      .references(() => clubs.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    role: text("role").notNull(),
    area: text("area").default("park").notNull(),
    punishment: text("punishment"),
    punishmentPhotoUrl: text("punishment_photo_url"),
    checkInDate: date("check_in_date"),
    punishmentDate: date("punishment_date"),
    joinedAt: timestamp("joined_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.clubId, table.userId] })]
);

export const readingPosts = pgTable(
  "reading_posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clubId: uuid("club_id")
      .notNull()
      .references(() => clubs.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    checkInDate: date("check_in_date").notNull(),
    photoUrl: text("photo_url").notNull(),
    note: text("note"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [unique().on(table.clubId, table.userId, table.checkInDate)]
);

export const readingReactions = pgTable(
  "reading_reactions",
  {
    postId: uuid("post_id")
      .notNull()
      .references(() => readingPosts.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id),
    emoji: text("emoji").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [primaryKey({ columns: [table.postId, table.userId] })]
);

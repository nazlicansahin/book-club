import { put } from "@vercel/blob";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-server";
import { getClubLocalDate, normalizeTimezone } from "@/lib/club-day";
import { parseUploadPhoto } from "@/lib/parse-upload-photo";
import { isClubMember, markPunishmentSubmitted } from "@/lib/db/clubs";
import { getDb } from "@/db";
import { clubMembers, clubs } from "@/db/schema";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

function normalizeDate(value: string | Date | null | undefined): string | null {
  if (!value) return null;
  if (typeof value === "string") return value.slice(0, 10);
  return value.toISOString().slice(0, 10);
}

export async function POST(request: Request, { params }: Params) {
  try {
    const auth = await requireAuth(request);
    const { id: clubId } = await params;

    const member = await isClubMember(clubId, auth.uid);
    if (!member) return NextResponse.json({ error: "Not a member" }, { status: 403 });

    const db = getDb();
    const club = await db.query.clubs.findFirst({ where: eq(clubs.id, clubId) });
    const timezone = normalizeTimezone(club?.timezone);
    const clubToday = getClubLocalDate(timezone);

    const row = await db.query.clubMembers.findFirst({
      where: and(eq(clubMembers.clubId, clubId), eq(clubMembers.userId, auth.uid)),
    });

    if (!row || row.area !== "prison") {
      return NextResponse.json({ error: "You must be in prison to submit punishment" }, { status: 400 });
    }

    if (normalizeDate(row.punishmentDate) === clubToday) {
      return NextResponse.json({ error: "Punishment already submitted today" }, { status: 400 });
    }

    const { buffer: photoBuffer } = await parseUploadPhoto(request);
    if (photoBuffer.length === 0) {
      return NextResponse.json({ error: "Photo required" }, { status: 400 });
    }

    const blob = await put(`clubs/${clubId}/${auth.uid}/punishment-${clubToday}.jpg`, photoBuffer, {
      access: "public",
      contentType: "image/jpeg",
      addRandomSuffix: true,
    });

    await markPunishmentSubmitted(clubId, auth.uid, blob.url);

    return NextResponse.json({ photoUrl: blob.url });
  } catch (e) {
    if (e instanceof Response) return e;
    console.error("punishment error:", e);
    const message = e instanceof Error ? e.message : "Server error";
    const status = message === "Photo required" ? 400 : 500;
    return NextResponse.json({ error: status === 400 ? message : "Upload failed. Try again." }, { status });
  }
}

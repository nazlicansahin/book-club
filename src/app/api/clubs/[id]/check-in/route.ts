import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-server";
import {
  createReadingPost,
  getMemberState,
  isClubMember,
} from "@/lib/db/clubs";
import { getClubLocalDate, normalizeTimezone } from "@/lib/club-day";
import { parseUploadPhoto } from "@/lib/parse-upload-photo";
import { getDb } from "@/db";
import { clubs } from "@/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  try {
    const auth = await requireAuth(request);
    const { id: clubId } = await params;

    const member = await isClubMember(clubId, auth.uid);
    if (!member) return NextResponse.json({ error: "Not a member" }, { status: 403 });

    const state = await getMemberState(clubId, auth.uid);
    if (!state || state.area !== "park") {
      return NextResponse.json({ error: "You can only check in from the park" }, { status: 400 });
    }

    const { buffer: photoBuffer, note } = await parseUploadPhoto(request);
    if (photoBuffer.length === 0) {
      return NextResponse.json({ error: "Photo required" }, { status: 400 });
    }

    const db = getDb();
    const club = await db.query.clubs.findFirst({ where: eq(clubs.id, clubId) });
    const timezone = normalizeTimezone(club?.timezone);
    const clubToday = getClubLocalDate(timezone);

    const blob = await put(`clubs/${clubId}/${auth.uid}/${clubToday}.jpg`, photoBuffer, {
      access: "public",
      contentType: "image/jpeg",
      addRandomSuffix: true,
    });

    const postId = await createReadingPost(clubId, auth.uid, blob.url, note);

    return NextResponse.json({ postId, photoUrl: blob.url });
  } catch (e) {
    if (e instanceof Response) return e;
    console.error("check-in error:", e);
    const message = e instanceof Error ? e.message : "Server error";
    const status = message === "Photo required" ? 400 : 500;
    return NextResponse.json({ error: status === 400 ? message : "Upload failed. Try again." }, { status });
  }
}

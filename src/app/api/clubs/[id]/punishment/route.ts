import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-server";
import { getMemberState, isClubMember, markPunishmentSubmitted } from "@/lib/db/clubs";
import { getClubLocalDate, normalizeTimezone } from "@/lib/club-day";
import { getDb } from "@/db";
import { clubs } from "@/db/schema";
import { eq } from "drizzle-orm";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  try {
    const auth = await requireAuth(request);
    const { id: clubId } = await params;

    const member = await isClubMember(clubId, auth.uid);
    if (!member) return NextResponse.json({ error: "Not a member" }, { status: 403 });

    const state = await getMemberState(clubId, auth.uid);
    if (!state || state.area !== "prison") {
      return NextResponse.json({ error: "You must be in prison to submit punishment" }, { status: 400 });
    }

    const formData = await request.formData();
    const photo = formData.get("photo");

    if (!photo || !(photo instanceof Blob)) {
      return NextResponse.json({ error: "Photo required" }, { status: 400 });
    }

    const db = getDb();
    const club = await db.query.clubs.findFirst({ where: eq(clubs.id, clubId) });
    const timezone = normalizeTimezone(club?.timezone);
    const clubToday = getClubLocalDate(timezone);

    const blob = await put(`clubs/${clubId}/${auth.uid}/punishment-${clubToday}.jpg`, photo, {
      access: "public",
      contentType: photo.type || "image/jpeg",
    });

    await markPunishmentSubmitted(clubId, auth.uid, blob.url);

    return NextResponse.json({ photoUrl: blob.url });
  } catch (e) {
    if (e instanceof Response) return e;
    console.error("punishment error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

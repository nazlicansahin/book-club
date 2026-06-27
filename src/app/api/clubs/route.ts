import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-server";
import {
  createClubRecord,
  ensureUser,
  getUserById,
  getUserClubs,
} from "@/lib/db/clubs";
import type { CharacterId } from "@/lib/characters";

export async function GET(request: Request) {
  try {
    const auth = await requireAuth(request);
    const clubs = await getUserClubs(auth.uid);
    return NextResponse.json({ clubs });
  } catch (e) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAuth(request);
    const body = (await request.json()) as { name?: string; bookTitle?: string };
    if (!body.name?.trim() || !body.bookTitle?.trim()) {
      return NextResponse.json({ error: "Name and book title required" }, { status: 400 });
    }

    await ensureUser(auth.uid, auth.email, auth.displayName, auth.photoURL);
    const profile = await getUserById(auth.uid);
    const characterId = (profile?.characterId as CharacterId) || "wizard";
    const displayName = profile?.displayName || auth.displayName || "Reader";

    const club = await createClubRecord(
      auth.uid,
      body.name,
      body.bookTitle,
      displayName,
      characterId
    );

    return NextResponse.json(club);
  } catch (e) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

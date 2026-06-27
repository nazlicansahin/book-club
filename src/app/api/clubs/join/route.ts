import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-server";
import {
  ensureUser,
  getUserById,
  joinClubByInviteCode,
} from "@/lib/db/clubs";
import type { CharacterId } from "@/lib/characters";

export async function POST(request: Request) {
  try {
    const auth = await requireAuth(request);
    const body = (await request.json()) as { code?: string };
    if (!body.code?.trim()) {
      return NextResponse.json({ error: "Invite code required" }, { status: 400 });
    }

    await ensureUser(auth.uid, auth.email, auth.displayName, auth.photoURL);
    const profile = await getUserById(auth.uid);
    const characterId = (profile?.characterId as CharacterId) || "wizard";
    const displayName = profile?.displayName || auth.displayName || "Reader";

    const clubId = await joinClubByInviteCode(auth.uid, body.code, displayName, characterId);
    return NextResponse.json({ clubId });
  } catch (e) {
    if (e instanceof Response) return e;
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

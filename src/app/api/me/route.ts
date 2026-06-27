import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-server";
import { ensureUser, getUserById, updateUserCharacter } from "@/lib/db/clubs";
import type { CharacterId } from "@/lib/characters";

export async function GET(request: Request) {
  try {
    const auth = await requireAuth(request);
    const user = await getUserById(auth.uid);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json({
      uid: user.id,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoUrl,
      characterId: user.characterId,
    });
  } catch (e) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await requireAuth(request);
    await ensureUser(auth.uid, auth.email, auth.displayName, auth.photoURL);
    const user = await getUserById(auth.uid);

    return NextResponse.json({
      uid: user!.id,
      email: user!.email,
      displayName: user!.displayName,
      photoURL: user!.photoUrl,
      characterId: user!.characterId,
    });
  } catch (e) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const auth = await requireAuth(request);
    const body = (await request.json()) as { characterId?: CharacterId };
    if (!body.characterId) {
      return NextResponse.json({ error: "characterId required" }, { status: 400 });
    }

    await ensureUser(auth.uid, auth.email, auth.displayName, auth.photoURL);
    await updateUserCharacter(auth.uid, body.characterId);
    const user = await getUserById(auth.uid);

    return NextResponse.json({
      uid: user!.id,
      email: user!.email,
      displayName: user!.displayName,
      photoURL: user!.photoUrl,
      characterId: user!.characterId,
    });
  } catch (e) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

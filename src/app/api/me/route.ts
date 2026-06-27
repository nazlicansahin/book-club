import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-server";
import { ensureUser, getUserById, updateUserCharacter, updateUserDisplayName } from "@/lib/db/clubs";
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
    const body = (await request.json()) as { characterId?: CharacterId; displayName?: string };

    if (!body.characterId && body.displayName === undefined) {
      return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
    }

    await ensureUser(auth.uid, auth.email, auth.displayName, auth.photoURL);

    if (body.displayName !== undefined) {
      const name = body.displayName.trim();
      if (!name || name.length > 32) {
        return NextResponse.json({ error: "Nickname must be 1–32 characters" }, { status: 400 });
      }
      await updateUserDisplayName(auth.uid, name);
    }

    if (body.characterId) {
      await updateUserCharacter(auth.uid, body.characterId);
    }

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

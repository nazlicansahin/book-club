import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-server";
import { deleteClub, getClubWithMembers } from "@/lib/db/clubs";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
  try {
    const auth = await requireAuth(request);
    const { id } = await params;
    const club = await getClubWithMembers(id, auth.uid);
    if (!club) return NextResponse.json({ error: "Club not found" }, { status: 404 });
    return NextResponse.json(club);
  } catch (e) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const auth = await requireAuth(request);
    const { id } = await params;
    await deleteClub(id, auth.uid);
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof Response) return e;
    const message = e instanceof Error ? e.message : "Server error";
    const status = message.includes("owner") ? 403 : message.includes("not found") ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-server";
import { getClubWithMembers } from "@/lib/db/clubs";

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

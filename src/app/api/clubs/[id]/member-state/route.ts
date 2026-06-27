import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-server";
import {
  getClubWithMembers,
  getMemberState,
  leaveClub,
  markCheckedInToday,
  markPunishmentSubmitted,
  sendMemberToPrison,
} from "@/lib/db/clubs";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
  try {
    const auth = await requireAuth(request);
    const { id } = await params;
    const state = await getMemberState(id, auth.uid);
    if (!state) return NextResponse.json({ error: "Not a member" }, { status: 404 });
    return NextResponse.json(state);
  } catch (e) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const auth = await requireAuth(request);
    const { id } = await params;
    const body = (await request.json()) as { action?: string; userId?: string };

    if (body.action === "punishment") {
      await markPunishmentSubmitted(id, auth.uid);
    } else if (body.action === "check-in") {
      await markCheckedInToday(id, auth.uid);
    } else if (body.action === "send-to-prison") {
      const club = await getClubWithMembers(id, auth.uid);
      if (!club) return NextResponse.json({ error: "Club not found" }, { status: 404 });

      const targetId = body.userId ?? auth.uid;
      const isOwner = club.ownerId === auth.uid;
      if (targetId !== auth.uid && !isOwner) {
        return NextResponse.json({ error: "Only the owner can send others to prison" }, { status: 403 });
      }

      await sendMemberToPrison(id, targetId);
    } else if (body.action === "leave") {
      await leaveClub(id, auth.uid);
      return NextResponse.json({ ok: true });
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const state = await getMemberState(id, auth.uid);
    return NextResponse.json(state);
  } catch (e) {
    if (e instanceof Response) return e;
    const message = e instanceof Error ? e.message : "Server error";
    const status = message.includes("owners must delete") ? 403 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

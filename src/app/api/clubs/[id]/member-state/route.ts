import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-server";
import {
  getMemberState,
  markCheckedInToday,
  markPunishmentSubmitted,
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
    const body = (await request.json()) as { action?: string };

    if (body.action === "punishment") {
      await markPunishmentSubmitted(id, auth.uid);
    } else if (body.action === "check-in") {
      await markCheckedInToday(id, auth.uid);
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const state = await getMemberState(id, auth.uid);
    return NextResponse.json(state);
  } catch (e) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

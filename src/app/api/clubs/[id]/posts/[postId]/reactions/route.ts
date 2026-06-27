import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-server";
import {
  getReadingPostForReaction,
  isClubMember,
  upsertReadingReaction,
} from "@/lib/db/clubs";

const ALLOWED_EMOJI = ["🔥", "📖", "👏", "😂", "❤️"];

type Params = { params: Promise<{ id: string; postId: string }> };

export async function POST(request: Request, { params }: Params) {
  try {
    const auth = await requireAuth(request);
    const { id: clubId, postId } = await params;

    const member = await isClubMember(clubId, auth.uid);
    if (!member) return NextResponse.json({ error: "Not a member" }, { status: 403 });

    const post = await getReadingPostForReaction(postId);
    if (!post || post.clubId !== clubId) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const body = (await request.json()) as { emoji?: string };
    if (!body.emoji || !ALLOWED_EMOJI.includes(body.emoji)) {
      return NextResponse.json({ error: "Invalid emoji" }, { status: 400 });
    }

    await upsertReadingReaction(postId, auth.uid, body.emoji);

    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof Response) return e;
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

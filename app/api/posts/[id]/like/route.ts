import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Post from "@/lib/models/Post";
import { getCurrentUser } from "@/lib/auth/session";
import { isReactionType, ReactionType } from "@/lib/reactions";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    let type: ReactionType = "like";
    try {
      const body = await req.json();
      if (isReactionType(body?.type)) type = body.type;
    } catch {
    }

    await connectDB();

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    const userId = currentUser.userId;
    const existing = post.reactions.find((r) => r.user.toString() === userId);

    let myReaction: ReactionType | null;
    if (existing) {
      if (existing.type === type) {
        post.reactions = post.reactions.filter((r) => r.user.toString() !== userId);
        myReaction = null;
      } else {
        existing.type = type;
        myReaction = type;
      }
    } else {
      post.reactions.push({ user: userId, type } as never);
      myReaction = type;
    }

    await post.save();

    const updated = await Post.findById(id)
      .populate("reactions.user", "firstName lastName")
      .lean();

    return NextResponse.json(
      { reactions: updated?.reactions ?? [], myReaction },
      { status: 200 }
    );
  } catch (err) {
    console.error("[posts:react]", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

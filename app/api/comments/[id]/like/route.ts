import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Comment from "@/lib/models/Comment";
import { getCurrentUser } from "@/lib/auth/session";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await connectDB();

    const comment = await Comment.findById(id);
    if (!comment) {
      return NextResponse.json({ message: "Comment not found" }, { status: 404 });
    }

    const userId = currentUser.userId;
    const alreadyLiked = comment.likes.some((u) => u.toString() === userId);

    if (alreadyLiked) {
      comment.likes = comment.likes.filter((u) => u.toString() !== userId);
    } else {
      comment.likes.push(userId as never);
    }

    await comment.save();

    const updated = await Comment.findById(id)
      .populate("likes", "firstName lastName")
      .lean();

    return NextResponse.json(
      {
        likes: updated?.likes ?? [],
        likedByMe: !alreadyLiked,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[comments:like]", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

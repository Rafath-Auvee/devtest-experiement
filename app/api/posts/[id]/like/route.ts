import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Post from "@/lib/models/Post";
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

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    const userId = currentUser.userId;
    const alreadyLiked = post.likes.some((u) => u.toString() === userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((u) => u.toString() !== userId);
    } else {
      post.likes.push(userId as never);
    }

    await post.save();

    const updated = await Post.findById(id)
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
    console.error("[posts:like]", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Comment from "@/lib/models/Comment";
import Post from "@/lib/models/Post";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    const { id } = await params;

    await connectDB();

    const comments = await Comment.find({ post: id })
      .sort({ createdAt: 1 })
      .populate("author", "firstName lastName")
      .populate("likes", "firstName lastName")
      .lean();

    const shaped = comments.map((c) => ({
      ...c,
      likedByMe: currentUser
        ? c.likes.some((u) => u._id.toString() === currentUser.userId)
        : false,
    }));

    return NextResponse.json({ comments: shaped }, { status: 200 });
  } catch (err) {
    console.error("[comments:GET]", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { text, parentId } = await req.json();

    if (!text || !text.trim()) {
      return NextResponse.json({ message: "Comment text is required" }, { status: 400 });
    }

    await connectDB();

    const post = await Post.findById(id).select("_id").lean();
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    if (parentId) {
      const parent = await Comment.findOne({ _id: parentId, post: id }).select("_id").lean();
      if (!parent) {
        return NextResponse.json({ message: "Parent comment not found" }, { status: 404 });
      }
    }

    const comment = await Comment.create({
      post: id,
      author: currentUser.userId,
      parent: parentId || null,
      text: text.trim(),
    });

    const populated = await Comment.findById(comment._id)
      .populate("author", "firstName lastName")
      .lean();

    return NextResponse.json(
      { comment: { ...populated, likes: [], likedByMe: false } },
      { status: 201 }
    );
  } catch (err) {
    console.error("[comments:POST]", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

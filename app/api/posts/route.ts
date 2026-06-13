import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongoose";
import Post from "@/lib/models/Post";
import { getCurrentUser } from "@/lib/auth/session";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    await connectDB();

    const visibilityFilter = currentUser
      ? { $or: [{ visibility: "public" as const }, { author: currentUser.userId }] }
      : { visibility: "public" as const };

    const posts = await Post.find(visibilityFilter)
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("author", "firstName lastName")
      .lean();

    return NextResponse.json({ posts }, { status: 200 });
  } catch (err) {
    console.error("[posts:GET]", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { text, image, visibility } = await req.json();

    if (!text || !text.trim()) {
      return NextResponse.json({ message: "Post text is required" }, { status: 400 });
    }

    await connectDB();

    const post = await Post.create({
      author: currentUser.userId,
      text: text.trim(),
      image: image?.trim() || "",
      visibility: visibility === "private" ? "private" : "public",
    });

    const populated = await Post.findById(post._id)
      .populate("author", "firstName lastName")
      .lean();

    return NextResponse.json({ post: populated }, { status: 201 });
  } catch (err) {
    console.error("[posts:POST]", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

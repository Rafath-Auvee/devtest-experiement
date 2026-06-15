import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { connectDB } from "@/lib/db/mongoose";
import Post from "@/lib/models/Post";
import Comment from "@/lib/models/Comment";
import { getCurrentUser } from "@/lib/auth/session";

const PAGE_SIZE = 5;

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    const cursor = req.nextUrl.searchParams.get("cursor");

    await connectDB();

    const visibilityFilter = currentUser
      ? { $or: [{ visibility: "public" as const }, { author: currentUser.userId }] }
      : { visibility: "public" as const };

    const query = cursor
      ? { ...visibilityFilter, _id: { $lt: cursor } }
      : visibilityFilter;

    const posts = await Post.find(query)
      .sort({ _id: -1 })
      .limit(PAGE_SIZE + 1)
      .populate("author", "firstName lastName")
      .populate("reactions.user", "firstName lastName")
      .lean();

    const hasMore = posts.length > PAGE_SIZE;
    const page = hasMore ? posts.slice(0, PAGE_SIZE) : posts;

    const postIds = page.map((p) => new Types.ObjectId(p._id.toString()));
    const counts = await Comment.aggregate<{ _id: Types.ObjectId; count: number }>([
      { $match: { post: { $in: postIds } } },
      { $group: { _id: "$post", count: { $sum: 1 } } },
    ]);
    const countByPost = new Map(counts.map((c) => [c._id.toString(), c.count]));

    const shaped = page.map((post) => {
      const reactions = post.reactions ?? [];
      return {
        ...post,
        reactions,
        commentCount: countByPost.get(post._id.toString()) ?? 0,
        myReaction: currentUser
          ? reactions.find((r) => r.user?._id?.toString() === currentUser.userId)?.type ?? null
          : null,
      };
    });

    const nextCursor = hasMore ? page[page.length - 1]._id.toString() : null;

    return NextResponse.json({ posts: shaped, nextCursor }, { status: 200 });
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

    return NextResponse.json(
      { post: { ...populated, reactions: [], myReaction: null, commentCount: 0 } },
      { status: 201 }
    );
  } catch (err) {
    console.error("[posts:POST]", err);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

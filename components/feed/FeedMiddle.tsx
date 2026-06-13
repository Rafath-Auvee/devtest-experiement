"use client";

import { useEffect, useState } from "react";
import PostCreator from "./PostCreator";
import PostCard from "./PostCard";
import { FeedPost } from "./types";

export default function FeedMiddle() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data.posts ?? []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  function handleCreated(post: FeedPost) {
    setPosts((prev) => [post, ...prev]);
  }

  return (
    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
      <div className="_layout_middle_wrap">
        <div className="_layout_middle_inner">
          <PostCreator onCreated={handleCreated} />

          {loading ? (
            <p style={{ padding: "1rem", color: "var(--color6)" }}>Loading posts…</p>
          ) : posts.length === 0 ? (
            <p style={{ padding: "1rem", color: "var(--color6)" }}>
              No posts yet. Be the first to post something.
            </p>
          ) : (
            posts.map((post) => <PostCard key={post._id} post={post} />)
          )}
        </div>
      </div>
    </div>
  );
}

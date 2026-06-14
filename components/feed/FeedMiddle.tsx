"use client";

import { useEffect, useState, useCallback } from "react";
import Stories from "./Stories";
import PostCreator from "./PostCreator";
import PostCard from "./PostCard";
import { FeedPost } from "./types";

export default function FeedMiddle() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const loadPosts = useCallback(async (cursor?: string) => {
    const url = cursor ? `/api/posts?cursor=${cursor}` : "/api/posts";
    const res = await fetch(url);
    const data = await res.json();
    return data as { posts: FeedPost[]; nextCursor: string | null };
  }, []);

  useEffect(() => {
    loadPosts()
      .then((data) => {
        setPosts(data.posts ?? []);
        setNextCursor(data.nextCursor ?? null);
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [loadPosts]);

  async function handleLoadMore() {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const data = await loadPosts(nextCursor);
      setPosts((prev) => [...prev, ...(data.posts ?? [])]);
      setNextCursor(data.nextCursor ?? null);
    } finally {
      setLoadingMore(false);
    }
  }

  function handleCreated(post: FeedPost) {
    setPosts((prev) => [post, ...prev]);
  }

  return (
    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
      <div className="_layout_middle_wrap">
        <div className="_layout_middle_inner">
          <Stories />
          <PostCreator onCreated={handleCreated} />

          {loading ? (
            <p style={{ padding: "1rem", color: "var(--color6)" }}>Loading posts…</p>
          ) : posts.length === 0 ? (
            <p style={{ padding: "1rem", color: "var(--color6)" }}>
              No posts yet. Be the first to post something.
            </p>
          ) : (
            <>
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
              {nextCursor && (
                <div style={{ textAlign: "center", padding: "8px 0 24px" }}>
                  <button
                    type="button"
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="_feed_inner_text_area_btn_link"
                    style={{ padding: "10px 28px" }}
                  >
                    {loadingMore ? "Loading…" : "Load more"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

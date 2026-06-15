"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Stories from "./Stories";
import PostCreator from "./PostCreator";
import PostCard from "./PostCard";
import { FeedPost } from "./types";

export default function FeedMiddle() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingMoreRef = useRef(false);

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

  const handleLoadMore = useCallback(async () => {
    if (loadingMoreRef.current || !nextCursor) return;
    loadingMoreRef.current = true;
    setLoadingMore(true);
    try {
      const [data] = await Promise.all([
        loadPosts(nextCursor),
        new Promise((resolve) => setTimeout(resolve, 2000)),
      ]);
      setPosts((prev) => [...prev, ...(data.posts ?? [])]);
      setNextCursor(data.nextCursor ?? null);
    } finally {
      setLoadingMore(false);
      loadingMoreRef.current = false;
    }
  }, [nextCursor, loadPosts]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !nextCursor) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) handleLoadMore();
      },
      { rootMargin: "300px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [nextCursor, handleLoadMore]);

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

              <div ref={sentinelRef} aria-hidden style={{ height: 1 }} />

              {loadingMore && (
                <p style={{ textAlign: "center", padding: "8px 0 24px", color: "var(--color6)" }}>
                  Loading more…
                </p>
              )}

              {!nextCursor && (
                <p style={{ textAlign: "center", padding: "8px 0 24px", color: "var(--color6)", fontSize: 13 }}>
                  You&apos;re all caught up.
                </p>
              )}

              {nextCursor && !loadingMore && (
                <div style={{ textAlign: "center", padding: "8px 0 24px" }}>
                  <button
                    type="button"
                    onClick={handleLoadMore}
                    className="_feed_inner_text_area_btn_link"
                    style={{ padding: "10px 28px" }}
                  >
                    Load more
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

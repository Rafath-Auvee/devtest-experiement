"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { images } from "@/lib/assets/images";
import { FeedComment } from "./types";
import CommentItem from "./CommentItem";

interface CommentSectionProps {
  postId: string;
  onCountChange?: (count: number) => void;
}

export default function CommentSection({ postId, onCountChange }: CommentSectionProps) {
  const [comments, setComments] = useState<FeedComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    fetch(`/api/posts/${postId}/comments`)
      .then((res) => res.json())
      .then((data) => {
        setComments(data.comments ?? []);
      })
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, [postId]);

  // Keep the parent's comment count in sync — runs after render, so the
  // updater below stays pure (no setState-in-render).
  useEffect(() => {
    if (!loading) onCountChange?.(comments.length);
  }, [comments.length, loading, onCountChange]);

  async function postComment(value: string, parentId?: string) {
    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: value, parentId }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.message ?? "Failed to comment");
      return;
    }
    setComments((prev) => [...prev, data.comment]);
  }

  async function handleSubmit() {
    if (!text.trim()) return;
    setPending(true);
    try {
      await postComment(text);
      setText("");
    } finally {
      setPending(false);
    }
  }

  const topLevel = comments.filter((c) => c.parent === null);
  const repliesByParent = comments.reduce<Record<string, FeedComment[]>>((acc, c) => {
    if (c.parent) {
      (acc[c.parent] ??= []).push(c);
    }
    return acc;
  }, {});

  return (
    <div className="_feed_inner_timeline_cooment_area">
      <div className="_feed_inner_comment_box">
        <div className="_feed_inner_comment_box_form">
          <div className="_feed_inner_comment_box_content">
            <div className="_feed_inner_comment_box_content_image">
              <Image src={images.defaultAvatar} alt="" width={36} height={36} className="_comment_img" />
            </div>
            <div className="_feed_inner_comment_box_content_txt">
              <textarea
                className="form-control _comment_textarea"
                placeholder="Write a comment"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
                disabled={pending}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="_timline_comment_main">
        {loading ? (
          <p style={{ padding: "0.5rem 0", color: "var(--color6)", fontSize: "13px" }}>Loading comments…</p>
        ) : (
          topLevel.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              replies={repliesByParent[comment._id] ?? []}
              onReply={(parentId, value) => postComment(value, parentId)}
            />
          ))
        )}
      </div>
    </div>
  );
}

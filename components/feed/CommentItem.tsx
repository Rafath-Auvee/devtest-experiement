"use client";

import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { images } from "@/lib/assets/images";
import { FeedComment, PostAuthor } from "./types";
import { timeAgo, likedByText } from "./format";

interface CommentItemProps {
  comment: FeedComment;
  replies?: FeedComment[];
  onReply?: (parentId: string, text: string) => Promise<void>;
}

export default function CommentItem({ comment, replies = [], onReply }: CommentItemProps) {
  const [likes, setLikes] = useState<PostAuthor[]>(comment.likes);
  const [likedByMe, setLikedByMe] = useState(comment.likedByMe);
  const [pending, setPending] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyPending, setReplyPending] = useState(false);

  const authorName = `${comment.author.firstName} ${comment.author.lastName}`;
  const isReply = comment.parent !== null;

  async function toggleLike() {
    if (pending) return;
    setPending(true);
    try {
      const res = await fetch(`/api/comments/${comment._id}/like`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message ?? "Failed to update like");
        return;
      }
      setLikes(data.likes);
      setLikedByMe(data.likedByMe);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  async function submitReply() {
    if (!replyText.trim() || !onReply) return;
    setReplyPending(true);
    try {
      await onReply(comment._id, replyText);
      setReplyText("");
      setShowReply(false);
    } finally {
      setReplyPending(false);
    }
  }

  return (
    <div className="_comment_main">
      <div className="_comment_image">
        <span className="_comment_image_link">
          <Image src={images.txtImg} alt="" width={36} height={36} className="_comment_img1" />
        </span>
      </div>
      <div className="_comment_area">
        <div className="_comment_details">
          <div className="_comment_details_top">
            <div className="_comment_name">
              <h4 className="_comment_name_title">{authorName}</h4>
            </div>
          </div>
          <div className="_comment_status">
            <p className="_comment_status_text">
              <span>{comment.text}</span>
            </p>
          </div>
          <div className="_total_reactions" title={likedByText(likes)}>
            <div className="_total_react">
              <span className="_reaction_like">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                </svg>
              </span>
            </div>
            <span className="_total">{likes.length}</span>
          </div>
          <div className="_comment_reply">
            <div className="_comment_reply_num">
              <ul className="_comment_reply_list">
                <li>
                  <span
                    onClick={toggleLike}
                    style={{ cursor: "pointer", color: likedByMe ? "#1890FF" : undefined }}
                  >
                    {likedByMe ? "Liked" : "Like"}.
                  </span>
                </li>
                {!isReply && onReply && (
                  <li>
                    <span onClick={() => setShowReply((s) => !s)} style={{ cursor: "pointer" }}>
                      Reply.
                    </span>
                  </li>
                )}
                <li>
                  <span className="_time_link">.{timeAgo(comment.createdAt)}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {replies.map((reply) => (
          <CommentItem key={reply._id} comment={reply} />
        ))}

        {showReply && (
          <div className="_feed_inner_comment_box">
            <div className="_feed_inner_comment_box_form">
              <div className="_feed_inner_comment_box_content">
                <div className="_feed_inner_comment_box_content_image">
                  <Image src={images.commentImg} alt="" width={32} height={32} className="_comment_img" />
                </div>
                <div className="_feed_inner_comment_box_content_txt">
                  <textarea
                    className="form-control _comment_textarea"
                    placeholder="Write a reply"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        submitReply();
                      }
                    }}
                    disabled={replyPending}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

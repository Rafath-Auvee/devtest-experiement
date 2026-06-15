"use client";

import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { images } from "@/lib/assets/images";
import { ReactionType } from "@/lib/reactions";
import { FeedComment, Reaction } from "./types";
import { timeAgo, reactedByText } from "./format";
import { ReactionSummary } from "./reactions";
import ReactionControl from "./ReactionControl";

interface CommentItemProps {
  comment: FeedComment;
  replies?: FeedComment[];
  onReply?: (parentId: string, text: string) => Promise<void>;
}

export default function CommentItem({ comment, replies = [], onReply }: CommentItemProps) {
  const [reactions, setReactions] = useState<Reaction[]>(comment.reactions ?? []);
  const [myReaction, setMyReaction] = useState<ReactionType | null>(comment.myReaction ?? null);
  const [pending, setPending] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replyPending, setReplyPending] = useState(false);

  const authorName = `${comment.author.firstName} ${comment.author.lastName}`;
  const isReply = comment.parent !== null;

  async function react(type: ReactionType) {
    if (pending) return;
    setPending(true);
    try {
      const res = await fetch(`/api/comments/${comment._id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message ?? "Failed to update reaction");
        return;
      }
      setReactions(data.reactions);
      setMyReaction(data.myReaction);
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
          <Image src={images.defaultAvatar} alt="" width={36} height={36} className="_comment_img1" />
        </span>
      </div>
      <div className="_comment_area">
        <div
          className="_comment_details"
          style={{ marginBottom: reactions.length > 0 ? 22 : 8 }}
        >
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
          <ReactionSummary
            reactions={reactions}
            title={reactedByText(reactions)}
            size={16}
            className="_total_reactions"
            countClassName="_total"
            style={{ position: "absolute", top: "auto", bottom: -12, right: 8 }}
          />
        </div>

        <div className="_comment_reply">
          <div className="_comment_reply_num">
            <ul className="_comment_reply_list">
              <li>
                <ReactionControl
                  myReaction={myReaction}
                  onReact={react}
                  variant="comment"
                  disabled={pending}
                />
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

        {replies.map((reply) => (
          <CommentItem key={reply._id} comment={reply} />
        ))}

        {showReply && (
          <div className="_feed_inner_comment_box">
            <div className="_feed_inner_comment_box_form">
              <div className="_feed_inner_comment_box_content">
                <div className="_feed_inner_comment_box_content_image">
                  <Image src={images.defaultAvatar} alt="" width={32} height={32} className="_comment_img" />
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

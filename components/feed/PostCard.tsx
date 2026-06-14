"use client";

import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { images } from "@/lib/assets/images";
import { ReactionType } from "@/lib/reactions";
import { FeedPost, Reaction } from "./types";
import { timeAgo, reactedByText } from "./format";
import { ReactionSummary } from "./reactions";
import ReactionControl from "./ReactionControl";
import CommentSection from "./CommentSection";

interface PostCardProps {
  post: FeedPost;
}

export default function PostCard({ post }: PostCardProps) {
  const [reactions, setReactions] = useState<Reaction[]>(post.reactions ?? []);
  const [myReaction, setMyReaction] = useState<ReactionType | null>(post.myReaction ?? null);
  const [pending, setPending] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState<number>(post.commentCount ?? 0);

  const authorName = `${post.author.firstName} ${post.author.lastName}`;

  async function react(type: ReactionType) {
    if (pending) return;
    setPending(true);
    try {
      const res = await fetch(`/api/posts/${post._id}/like`, {
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

  return (
    <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
      <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
        <div className="_feed_inner_timeline_post_top">
          <div className="_feed_inner_timeline_post_box">
            <div className="_feed_inner_timeline_post_box_image">
              <Image src={images.defaultAvatar} alt="" width={44} height={44} className="_post_img" />
            </div>
            <div className="_feed_inner_timeline_post_box_txt">
              <h4 className="_feed_inner_timeline_post_box_title">{authorName}</h4>
              <p className="_feed_inner_timeline_post_box_para">
                {timeAgo(post.createdAt)} . <span>{post.visibility === "private" ? "Private" : "Public"}</span>
              </p>
            </div>
          </div>
          <div className="_feed_inner_timeline_post_box_dropdown">
            <div className="_feed_timeline_post_dropdown">
              <button type="button" className="_feed_timeline_post_dropdown_link">
                <svg xmlns="http://www.w3.org/2000/svg" width="4" height="17" fill="none" viewBox="0 0 4 17">
                  <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
                  <circle cx="2" cy="8" r="2" fill="#C4C4C4" />
                  <circle cx="2" cy="15" r="2" fill="#C4C4C4" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <h4 className="_feed_inner_timeline_post_title" style={{ whiteSpace: "pre-wrap" }}>
          {post.text}
        </h4>

        {post.image && (
          <div className="_feed_inner_timeline_image">
            <Image src={post.image} alt="" width={600} height={400} className="_time_img" />
          </div>
        )}
      </div>

      {(reactions.length > 0 || commentCount > 0) && (
        <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
          <ReactionSummary reactions={reactions} title={reactedByText(reactions)} />
          <div className="_feed_inner_timeline_total_reacts_txt">
            {commentCount > 0 && (
              <p className="_feed_inner_timeline_total_reacts_para2">
                <span>{commentCount}</span> Comment{commentCount === 1 ? "" : "s"}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="_feed_inner_timeline_reaction">
        <ReactionControl myReaction={myReaction} onReact={react} variant="post" disabled={pending} />
        <button
          type="button"
          onClick={() => setShowComments((s) => !s)}
          className="_feed_inner_timeline_reaction_comment _feed_reaction"
        >
          <span className="_feed_inner_timeline_reaction_link">
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="none" viewBox="0 0 21 21">
                <path stroke="#000" d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z" />
                <path stroke="#000" strokeLinecap="round" strokeLinejoin="round" d="M6.938 9.313h7.125M10.5 14.063h3.563" />
              </svg>
              Comment
            </span>
          </span>
        </button>
        <button type="button" className="_feed_inner_timeline_reaction_share _feed_reaction">
          <span className="_feed_inner_timeline_reaction_link">
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="24" height="21" fill="none" viewBox="0 0 24 21">
                <path stroke="#000" strokeLinejoin="round" d="M23 10.5L12.917 1v5.429C3.267 6.429 1 13.258 1 20c2.785-3.52 5.248-5.429 11.917-5.429V20L23 10.5z" />
              </svg>
              Share
            </span>
          </span>
        </button>
      </div>

      {showComments && (
        <CommentSection postId={post._id} onCountChange={setCommentCount} />
      )}
    </div>
  );
}

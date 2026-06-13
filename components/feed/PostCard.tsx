import Image from "next/image";
import { images } from "@/lib/assets/images";
import { FeedPost } from "./types";

interface PostCardProps {
  post: FeedPost;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} minute${mins > 1 ? "s" : ""} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

export default function PostCard({ post }: PostCardProps) {
  const authorName = `${post.author.firstName} ${post.author.lastName}`;

  return (
    <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
      <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
        <div className="_feed_inner_timeline_post_top">
          <div className="_feed_inner_timeline_post_box">
            <div className="_feed_inner_timeline_post_box_image">
              <Image src={images.postImg} alt="" width={44} height={44} className="_post_img" />
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

      <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
        <div className="_feed_inner_timeline_total_reacts_image">
          <Image src={images.reactImg1} alt="" width={20} height={20} className="_react_img1" />
          <Image src={images.reactImg2} alt="" width={20} height={20} className="_react_img" />
          <p className="_feed_inner_timeline_total_reacts_para">{post.likes.length}</p>
        </div>
        <div className="_feed_inner_timeline_total_reacts_txt">
          <p className="_feed_inner_timeline_total_reacts_para1">
            <span>0</span> Comment
          </p>
        </div>
      </div>

      <div className="_feed_inner_timeline_reaction">
        <button className="_feed_inner_timeline_reaction_emoji _feed_reaction">
          <span className="_feed_inner_timeline_reaction_link">
            <span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
              </svg>
              Like
            </span>
          </span>
        </button>
        <button className="_feed_inner_timeline_reaction_comment _feed_reaction">
          <span className="_feed_inner_timeline_reaction_link">
            <span>
              <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="none" viewBox="0 0 21 21">
                <path stroke="#000" d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z" />
                <path stroke="#000" strokeLinecap="round" strokeLinejoin="round" d="M6.938 9.313h7.125M10.5 14.063h3.563" />
              </svg>
              Comment
            </span>
          </span>
        </button>
        <button className="_feed_inner_timeline_reaction_share _feed_reaction">
          <span className="_feed_inner_timeline_reaction_link">
            <span>
              <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="24" height="21" fill="none" viewBox="0 0 24 21">
                <path stroke="#000" strokeLinejoin="round" d="M23 10.5L12.917 1v5.429C3.267 6.429 1 13.258 1 20c2.785-3.52 5.248-5.429 11.917-5.429V20L23 10.5z" />
              </svg>
              Share
            </span>
          </span>
        </button>
      </div>

      <div className="_feed_inner_timeline_cooment_area">
        <div className="_feed_inner_comment_box">
          <form className="_feed_inner_comment_box_form">
            <div className="_feed_inner_comment_box_content">
              <div className="_feed_inner_comment_box_content_image">
                <Image src={images.commentImg} alt="" width={36} height={36} className="_comment_img" />
              </div>
              <div className="_feed_inner_comment_box_content_txt">
                <textarea className="form-control _comment_textarea" placeholder="Write a comment" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

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
        <div className="_feed_inner_timeline_total_reacts_txt">
          <p className="_feed_inner_timeline_total_reacts_para1">
            <span>{post.likes.length}</span> Likes
          </p>
        </div>
      </div>
    </div>
  );
}

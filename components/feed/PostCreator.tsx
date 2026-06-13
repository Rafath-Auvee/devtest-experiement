"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { images } from "@/lib/assets/images";
import { FeedPost } from "./types";

interface PostCreatorProps {
  onCreated: (post: FeedPost) => void;
}

export default function PostCreator({ onCreated }: PostCreatorProps) {
  const [text, setText] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!text.trim()) {
      toast.error("Write something first");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, visibility }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message ?? "Failed to create post");
        return;
      }

      onCreated(data.post);
      setText("");
      setVisibility("public");
      toast.success("Post published");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="_feed_inner_text_area _b_radious6 _padd_b24 _padd_t24 _padd_r24 _padd_l24 _mar_b16">
      <form onSubmit={handleSubmit}>
        <div className="_feed_inner_text_area_box">
          <div className="_feed_inner_text_area_box_image">
            <Image src={images.txtImg} alt="" width={40} height={40} className="_txt_img" />
          </div>
          <div className="form-floating _feed_inner_text_area_box_form">
            <textarea
              className="form-control _textarea"
              placeholder="Write something ..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              style={{ height: "120px" }}
            />
          </div>
        </div>

        <div className="_feed_inner_text_area_bottom" style={{ alignItems: "center" }}>
          <div className="_feed_inner_text_area_item">
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as "public" | "private")}
              className="form-select"
              style={{ width: "auto", fontSize: "14px" }}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
          <div className="_feed_inner_text_area_btn">
            <button type="submit" className="_feed_inner_text_area_btn_link" disabled={loading}>
              <span>{loading ? "Posting..." : "Post"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

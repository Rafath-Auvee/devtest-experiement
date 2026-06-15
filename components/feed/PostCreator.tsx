"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { images } from "@/lib/assets/images";
import { FeedPost } from "./types";

interface PostCreatorProps {
  onCreated: (post: FeedPost) => void;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 10 * 1024 * 1024;

export default function PostCreator({ onCreated }: PostCreatorProps) {
  const [text, setText] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  function clearImage() {
    setImageFile(null);
    setImagePreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return "";
    });
    setImageLoading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Unsupported file type. Use JPEG, PNG, WebP or GIF.");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("File too large (max 10MB).");
      return;
    }

    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setImageLoading(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!text.trim()) {
      toast.error("Write something first");
      return;
    }
    if (imageLoading) return;

    setLoading(true);
    const toastId = toast.loading(imageFile ? "Uploading image…" : "Publishing post…");

    try {
      let imageUrl = "";
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const upRes = await fetch("/api/upload", { method: "POST", body: formData });
        const upData = await upRes.json();
        if (!upRes.ok) {
          toast.error(upData.message ?? "Image upload failed", { id: toastId });
          return;
        }
        imageUrl = upData.url;
        toast.loading("Publishing post…", { id: toastId });
      }

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, visibility, image: imageUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message ?? "Failed to create post", { id: toastId });
        return;
      }

      onCreated(data.post);
      setText("");
      setVisibility("public");
      clearImage();
      toast.success("Post published", { id: toastId });
    } catch {
      toast.error("Something went wrong. Please try again.", { id: toastId });
    } finally {
      setLoading(false);
    }
  }

  const postDisabled = loading || imageLoading;

  return (
    <div className="_feed_inner_text_area _b_radious6 _padd_b24 _padd_t24 _padd_r24 _padd_l24 _mar_b16">
      <form onSubmit={handleSubmit}>
        <div className="_feed_inner_text_area_box">
          <div className="_feed_inner_text_area_box_image">
            <Image src={images.defaultAvatar} alt="" width={40} height={40} className="_txt_img" />
          </div>
          <div className="form-floating _feed_inner_text_area_box_form" style={{ position: "relative" }}>
            <textarea
              className="form-control _textarea"
              aria-label="Write something"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            {text.length === 0 && (
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  top: 16,
                  left: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  pointerEvents: "none",
                  color: "var(--color7)",
                  fontSize: 16,
                }}
              >
                <span>Write something ...</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {imagePreview && (
          <div className="_feed_inner_timeline_image" style={{ position: "relative", marginBottom: "16px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagePreview}
              alt="Selected"
              className="_time_img"
              style={{ maxWidth: "100%", borderRadius: 6, opacity: imageLoading ? 0.6 : 1 }}
              onLoad={() => setImageLoading(false)}
              onError={() => {
                toast.error("Couldn't load that image. Try another.");
                clearImage();
              }}
            />
            {imageLoading && (
              <span
                style={{
                  position: "absolute", top: 8, left: 8, background: "rgba(0,0,0,0.6)",
                  color: "#fff", borderRadius: 12, padding: "2px 10px", fontSize: 12,
                }}
              >
                Loading…
              </span>
            )}
            <button
              type="button"
              onClick={clearImage}
              aria-label="Remove image"
              style={{
                position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.6)",
                color: "#fff", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />

        <div className="_feed_inner_text_area_bottom">
          <div className="_feed_inner_text_area_item">
            <div className="_feed_inner_text_area_bottom_photo _feed_common">
              <button
                type="button"
                className="_feed_inner_text_area_bottom_photo_link"
                onClick={() => fileInputRef.current?.click()}
              >
                <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20">
                    <path fill="#666" d="M13.916 0c3.109 0 5.18 2.429 5.18 5.914v8.17c0 3.486-2.072 5.916-5.18 5.916H5.999C2.89 20 .827 17.572.827 14.085v-8.17C.827 2.43 2.897 0 6 0h7.917zm0 1.504H5.999c-2.321 0-3.799 1.735-3.799 4.41v8.17c0 2.68 1.472 4.412 3.799 4.412h7.917c2.328 0 3.807-1.734 3.807-4.411v-8.17c0-2.678-1.478-4.411-3.807-4.411zm.65 8.68l.12.125 1.9 2.147a.803.803 0 01-.016 1.063.642.642 0 01-.894.058l-.076-.074-1.9-2.148a.806.806 0 00-1.205-.028l-.074.087-2.04 2.717c-.722.963-2.02 1.066-2.86.26l-.111-.116-.814-.91a.562.562 0 00-.793-.07l-.075.073-1.4 1.617a.645.645 0 01-.97.029.805.805 0 01-.09-.977l.064-.086 1.4-1.617c.736-.852 1.95-.897 2.734-.137l.114.12.81.905a.587.587 0 00.861.033l.07-.078 2.04-2.718c.81-1.08 2.27-1.19 3.205-.275zM6.831 4.64c1.265 0 2.292 1.125 2.292 2.51 0 1.386-1.027 2.511-2.292 2.511S4.54 8.537 4.54 7.152c0-1.386 1.026-2.51 2.291-2.51zm0 1.504c-.507 0-.918.451-.918 1.007 0 .555.411 1.006.918 1.006.507 0 .919-.451.919-1.006 0-.556-.412-1.007-.919-1.007z" />
                  </svg>
                </span>
                Photo
              </button>
            </div>
            <div className="_feed_inner_text_area_bottom_video _feed_common">
              <button type="button" className="_feed_inner_text_area_bottom_photo_link">
                <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" fill="none" viewBox="0 0 22 24">
                    <path fill="#666" d="M11.485 4.5c2.213 0 3.753 1.534 3.917 3.784l2.418-1.082c1.047-.468 2.188.327 2.271 1.533l.005.141v6.64c0 1.237-1.103 2.093-2.155 1.72l-.121-.047-2.418-1.083c-.164 2.25-1.708 3.785-3.917 3.785H5.76c-2.343 0-3.932-1.72-3.932-4.188V8.688c0-2.47 1.589-4.188 3.932-4.188h5.726zm0 1.5H5.76C4.169 6 3.197 7.05 3.197 8.688v7.015c0 1.636.972 2.688 2.562 2.688h5.726c1.586 0 2.562-1.054 2.562-2.688v-.686-6.329c0-1.636-.973-2.688-2.562-2.688zM18.4 8.57l-.062.02-2.921 1.306v4.596l2.921 1.307c.165.073.343-.036.38-.215l.008-.07V8.876c0-.195-.16-.334-.326-.305z" />
                  </svg>
                </span>
                Video
              </button>
            </div>
            <div className="_feed_inner_text_area_bottom_event _feed_common">
              <button type="button" className="_feed_inner_text_area_bottom_photo_link">
                <span className="_feed_inner_text_area_bottom_photo_iamge _mar_img">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" fill="none" viewBox="0 0 22 24">
                    <path fill="#666" d="M14.371 2c.32 0 .585.262.627.603l.005.095v.788c2.598.195 4.188 2.033 4.18 5v8.488c0 3.145-1.786 5.026-4.656 5.026H7.395C4.53 22 2.74 20.087 2.74 16.904V8.486c0-2.966 1.596-4.804 4.187-5v-.788c0-.386.283-.698.633-.698.32 0 .584.262.626.603l.006.095v.771h5.546v-.771c0-.386.284-.698.633-.698z" />
                  </svg>
                </span>
                Event
              </button>
            </div>
          </div>
          <div className="_feed_inner_text_area_item" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as "public" | "private")}
              className="form-select"
              style={{ width: "auto", fontSize: "14px" }}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
            <div className="_feed_inner_text_area_btn">
              <button type="submit" className="_feed_inner_text_area_btn_link" disabled={postDisabled}>
                <svg className="_mar_img" xmlns="http://www.w3.org/2000/svg" width="14" height="13" fill="none" viewBox="0 0 14 13">
                  <path fill="#fff" fillRule="evenodd" d="M6.37 7.879l2.438 3.955a.335.335 0 00.34.162c.068-.01.23-.05.289-.247l3.049-10.297a.348.348 0 00-.09-.35.341.341 0 00-.34-.088L1.75 4.03a.34.34 0 00-.247.289.343.343 0 00.16.347L5.666 7.17 9.2 3.597a.5.5 0 01.712.703L6.37 7.88z" clipRule="evenodd" />
                </svg>
                <span>{loading ? "Posting..." : imageLoading ? "Loading image..." : "Post"}</span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

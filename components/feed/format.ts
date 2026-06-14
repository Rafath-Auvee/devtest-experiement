import { PostAuthor } from "./types";

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} minute${mins > 1 ? "s" : ""} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

export function likedByText(likes: PostAuthor[]): string {
  if (likes.length === 0) return "";
  const names = likes.map((u) => `${u.firstName} ${u.lastName}`);
  if (names.length === 1) return `Liked by ${names[0]}`;
  if (names.length === 2) return `Liked by ${names[0]} and ${names[1]}`;
  return `Liked by ${names[0]}, ${names[1]} and ${names.length - 2} other${
    names.length - 2 > 1 ? "s" : ""
  }`;
}

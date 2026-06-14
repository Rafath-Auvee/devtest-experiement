import { Reaction } from "./types";

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

export function reactedByText(reactions: Reaction[]): string {
  if (reactions.length === 0) return "";
  const names = reactions.map((r) => `${r.user.firstName} ${r.user.lastName}`);
  if (names.length === 1) return `${names[0]}`;
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names[0]}, ${names[1]} and ${names.length - 2} other${
    names.length - 2 > 1 ? "s" : ""
  }`;
}

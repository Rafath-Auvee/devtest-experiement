import { ReactionType } from "@/lib/reactions";

export interface PostAuthor {
  _id: string;
  firstName: string;
  lastName: string;
}

export interface Reaction {
  user: PostAuthor;
  type: ReactionType;
}

export interface FeedPost {
  _id: string;
  author: PostAuthor;
  text: string;
  image?: string;
  visibility: "public" | "private";
  reactions: Reaction[];
  myReaction: ReactionType | null;
  commentCount: number;
  createdAt: string;
}

export interface FeedComment {
  _id: string;
  post: string;
  author: PostAuthor;
  parent: string | null;
  text: string;
  reactions: Reaction[];
  myReaction: ReactionType | null;
  createdAt: string;
}

export interface PostAuthor {
  _id: string;
  firstName: string;
  lastName: string;
}

export interface FeedPost {
  _id: string;
  author: PostAuthor;
  text: string;
  image?: string;
  visibility: "public" | "private";
  likes: PostAuthor[];
  likedByMe: boolean;
  createdAt: string;
}

export interface FeedComment {
  _id: string;
  post: string;
  author: PostAuthor;
  parent: string | null;
  text: string;
  likes: PostAuthor[];
  likedByMe: boolean;
  createdAt: string;
}

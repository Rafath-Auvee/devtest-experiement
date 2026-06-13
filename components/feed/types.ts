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
  likes: string[];
  createdAt: string;
}

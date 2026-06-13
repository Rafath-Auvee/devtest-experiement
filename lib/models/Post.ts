import mongoose, { Document, Model, Schema, Types } from "mongoose";

export type PostVisibility = "public" | "private";

export interface IPost extends Document {
  author: Types.ObjectId;
  text: string;
  image?: string;
  visibility: PostVisibility;
  likes: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true, maxlength: 5000 },
    image: { type: String, default: "" },
    visibility: { type: String, enum: ["public", "private"], default: "public" },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

postSchema.index({ createdAt: -1 });
postSchema.index({ author: 1, createdAt: -1 });

const Post: Model<IPost> =
  mongoose.models.Post ?? mongoose.model<IPost>("Post", postSchema);

export default Post;

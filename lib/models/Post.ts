import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { REACTION_TYPES, ReactionType } from "@/lib/reactions";
// Ensure the referenced User model is registered before any populate("author"/"reactions.user").
import "@/lib/models/User";

export type PostVisibility = "public" | "private";

export interface IReaction {
  user: Types.ObjectId;
  type: ReactionType;
}

export interface IPost extends Document {
  author: Types.ObjectId;
  text: string;
  image?: string;
  visibility: PostVisibility;
  reactions: IReaction[];
  createdAt: Date;
  updatedAt: Date;
}

export const reactionSchema = new Schema<IReaction>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: REACTION_TYPES, required: true },
  },
  { _id: false }
);

const postSchema = new Schema<IPost>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true, maxlength: 5000 },
    image: { type: String, default: "" },
    visibility: { type: String, enum: ["public", "private"], default: "public" },
    reactions: { type: [reactionSchema], default: [] },
  },
  { timestamps: true }
);

postSchema.index({ createdAt: -1 });
postSchema.index({ author: 1, createdAt: -1 });

const Post: Model<IPost> =
  mongoose.models.Post ?? mongoose.model<IPost>("Post", postSchema);

export default Post;

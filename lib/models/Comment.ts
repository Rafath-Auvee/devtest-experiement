import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IComment extends Document {
  post: Types.ObjectId;
  author: Types.ObjectId;
  parent: Types.ObjectId | null;
  text: string;
  likes: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    post: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    parent: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
    text: { type: String, required: true, trim: true, maxlength: 2000 },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

commentSchema.index({ post: 1, createdAt: 1 });
commentSchema.index({ parent: 1, createdAt: 1 });

const Comment: Model<IComment> =
  mongoose.models.Comment ?? mongoose.model<IComment>("Comment", commentSchema);

export default Comment;

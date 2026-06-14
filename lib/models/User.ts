import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  googleId?: string;
  avatar?: string;
  provider: "local" | "google";
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, trim: true, maxlength: 50 },
    lastName:  { type: String, required: true, trim: true, maxlength: 50 },
    email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
    // Optional: Google-authenticated accounts have no local password.
    password:  { type: String, minlength: 8, select: false },
    googleId:  { type: String, sparse: true },
    avatar:    { type: String },
    provider:  { type: String, enum: ["local", "google"], default: "local" },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>("User", userSchema);

export default User;

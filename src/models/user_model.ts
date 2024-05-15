import mongoose from "mongoose";

export interface IUser {
  name: string;
  bio: string;
  email: string;
  password: string;
  imgUrl: string;
  tokens: string[];
  postCount: number;
  followers: string[];
  following: string[];
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  postCount: {
    type: Number,
    default: 0,
  },
  bio: {
    type: String,
    default: "You can set the bio in the edit profile section.",
  },
  followers: {
    type: [String],
    default: [],
  },
  following: {
    type: [String],
    default: [],
  },
  imgUrl: {
    type: String,
  },
  tokens: {
    type: [String],
  },
});

export default mongoose.model<IUser>("User", userSchema);

import { model, Schema } from "mongoose";
import { IUser } from "./user.interface";

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, lowercase: true },
    password: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const User = model<IUser>("User", userSchema);

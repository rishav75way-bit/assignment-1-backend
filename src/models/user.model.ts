import mongoose, { Schema, Document } from "mongoose";

export type UserRole = "admin" | "user";

export interface IUser extends Document {
  email: string;
  password: string;
  role: UserRole;

  refreshToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
      required: true,
    },
    refreshToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);

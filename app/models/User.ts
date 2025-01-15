// models/User.ts
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true, // Store emails in lowercase
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"], // Basic email validation
    },
    password: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      enum: ["credentials", "google", "github"],
      default: "credentials",
    },
    image: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // Use mongoose timestamps
  }
);

export const User = mongoose.models.User || mongoose.model("User", UserSchema);

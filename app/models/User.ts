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
      default:
        "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1737843955~exp=1737847555~hmac=47968cdf3a6e5b75617ea517be7e07e28789dd2052540707470c583ad0757fb8&w=740",
    },
  },
  {
    timestamps: true, // Use mongoose timestamps
  }
);

export const User = mongoose.models.User || mongoose.model("User", UserSchema);

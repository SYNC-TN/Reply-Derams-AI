// models/User.ts
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    profileName: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    Followers: [
      {
        username: {
          type: String,
          required: true,
        },
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
    Following: [
      {
        username: {
          type: String,
          required: true,
        },
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],

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
    banner: {
      type: String,
      trim: true,
      default:
        "https://t3.ftcdn.net/jpg/04/67/96/14/360_F_467961418_UnS1ZAwAqbvVVMKExxqUNi0MUFTEJI83.jpg",
    },
  },
  {
    timestamps: true, // Use mongoose timestamps
  }
);

UserSchema.pre("save", function (next) {
  if (this.profileName) {
    this.profileName = this.profileName.toLowerCase().replaceAll(/\s+/g, "-");
  }
  next();
});
UserSchema.index({ "Followers.id": 1, "Followers.username": 1 });
UserSchema.index({ "Following.id": 1, "Following.username": 1 });

export const User = mongoose.models.User || mongoose.model("User", UserSchema);

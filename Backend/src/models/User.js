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
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      match: /.+\@.+\..+/,
    },
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9_]+$/, "Username can only contain alphanumeric characters and underscores."],
      minlength: [3, "Username must be at least 3 characters long."],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "Password must be at least 6 characters long."],
    },
    role: {
      type: String,
      enum: ["user", "moderator", "admin"],
      default: "user",
    },
    bio: {
      type: String,
      default: "",
    },
    headline: {
      type: String,
      default: "",
      maxlength: [60, "Headline cannot exceed 60 characters."],
      trim: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    bannedAt: {
      type: Date,
      default: null,
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// Index for user search
UserSchema.index({ name: 1 });

export default mongoose.model("User", UserSchema);

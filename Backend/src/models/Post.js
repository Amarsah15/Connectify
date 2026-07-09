import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: [10, "Content must be at least 10 character long."],
      maxlength: [2500, "Content must not exceed 2500 characters."],
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// Virtual: likes count
PostSchema.virtual("likesCount").get(function () {
  return this.likes ? this.likes.length : 0;
});

// Ensure virtuals are included in JSON/Object output
PostSchema.set("toJSON", { virtuals: true });
PostSchema.set("toObject", { virtuals: true });

export default mongoose.model("Post", PostSchema);

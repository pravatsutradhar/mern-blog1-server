// backend/models/Post.js
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const postSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true }, // SEO-friendly URL
    content: { type: String, required: true }, // rich text
    excerpt: { type: String }, // preview text
    featuredImage: { type: String }, // image URL

    author: { type: Schema.Types.ObjectId, ref: "User", required: true },

    categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },

    views: { type: Number, default: 0 },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],

    publishedAt: { type: Date },
  },
  { timestamps: true }
);

// Auto-generate slug from title if not provided
postSchema.pre("save", function (next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }
  next();
});

export default model("Post", postSchema);

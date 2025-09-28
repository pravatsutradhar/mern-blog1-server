// backend/models/Tag.js
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const tagSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, unique: true, index: true },
  },
  { timestamps: true }
);

// Auto-generate slug from name if not provided
tagSchema.pre("save", function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }
  next();
});

export default model("Tag", tagSchema);

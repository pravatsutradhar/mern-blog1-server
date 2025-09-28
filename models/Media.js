// backend/models/Media.js
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const mediaSchema = new Schema(
  {
    url: { type: String, required: true }, // file path or cloud URL
    fileName: { type: String, required: true },
    fileType: { type: String, required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default model("Media", mediaSchema);

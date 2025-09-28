// backend/models/User.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const socialLinksSchema = new Schema({
  website: { type: String },
  twitter: { type: String },
  github: { type: String },
}, { _id: false });

const userSchema = new Schema({
  name: { type: String, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["User", "Editor", "Admin"], default: "User" },
  bio: { type: String, default: "" },
  avatar: { type: String, default: "" },
  socialLinks: { type: socialLinksSchema, default: {} },
}, {
  timestamps: true,
});

// Hash password before save if modified
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 10);
  const salt = await bcrypt.genSalt(saltRounds);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Instance method to check password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password when converting to JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default model("User", userSchema);

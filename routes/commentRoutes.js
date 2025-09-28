// backend/routes/commentRoutes.js
import express from "express";
import {
  addComment,
  getCommentsByPost,
  moderateComment,
  deleteComment,
} from "../controllers/commentController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public: get approved comments for a post
router.get("/:postId", getCommentsByPost);

// Authenticated: add comment
router.post("/:postId", protect, addComment);

// Admin/Editor: approve or reject comment
router.put("/:id/status", protect, authorizeRoles("Admin", "Editor"), moderateComment);

// Authenticated: delete comment (author or Admin/Editor)
router.delete("/:id", protect, deleteComment);

export default router;

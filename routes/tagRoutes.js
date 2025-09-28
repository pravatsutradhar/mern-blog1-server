// backend/routes/tagRoutes.js
import express from "express";
import {
  createTag,
  getTags,
  getTagBySlug,
  updateTag,
  deleteTag,
} from "../controllers/tagController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getTags);
router.get("/:slug", getTagBySlug);

router.post("/", protect, authorizeRoles("Admin"), createTag);
router.put("/:id", protect, authorizeRoles("Admin"), updateTag);
router.delete("/:id", protect, authorizeRoles("Admin"), deleteTag);

export default router;

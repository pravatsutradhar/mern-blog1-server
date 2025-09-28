// backend/routes/categoryRoutes.js
import express from "express";
import {
  createCategory,
  getCategories,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getCategories);
router.get("/:slug", getCategoryBySlug);

router.post("/", protect, authorizeRoles("Admin"), createCategory);
router.put("/:id", protect, authorizeRoles("Admin"), updateCategory);
router.delete("/:id", protect, authorizeRoles("Admin"), deleteCategory);

export default router;

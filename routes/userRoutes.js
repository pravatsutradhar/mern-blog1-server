// backend/routes/userRoutes.js
import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { getAllUsers, getUserById, updateUserRole, deleteUser } from "../controllers/userController.js";

const router = express.Router();

// All routes protected & Admin only
router.use(protect);
router.use(authorizeRoles("Admin"));

router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id/role", updateUserRole);
router.delete("/:id", deleteUser);

export default router;

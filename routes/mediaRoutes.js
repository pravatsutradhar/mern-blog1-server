// backend/routes/mediaRoutes.js
import express from "express";
import multer from "multer";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { uploadMedia, getMediaByUser, deleteMedia } from "../controllers/mediaController.js";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Setup multer storage
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads/"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Routes
router.post("/", protect, upload.single("file"), uploadMedia);
router.get("/", protect, getMediaByUser);
router.delete("/:id", protect, deleteMedia);

export default router;

// backend/controllers/mediaController.js
import Media from "../models/Media.js";

// Upload media (file is handled by multer)
export const uploadMedia = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const media = new Media({
      url: `/uploads/${req.file.filename}`,
      fileName: req.file.originalname,
      fileType: req.file.mimetype,
      uploadedBy: req.user.id,
    });

    await media.save();
    res.status(201).json(media);
  } catch (err) {
    console.error("UploadMedia error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all media uploaded by user
export const getMediaByUser = async (req, res) => {
  try {
    const media = await Media.find({ uploadedBy: req.user.id }).sort({ createdAt: -1 });
    res.json(media);
  } catch (err) {
    console.error("GetMedia error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete media
export const deleteMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ message: "Media not found" });

    // Only uploader or Admin can delete
    if (media.uploadedBy.toString() !== req.user.id && req.user.role !== "Admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await media.deleteOne();
    res.json({ message: "Media deleted successfully" });
  } catch (err) {
    console.error("DeleteMedia error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// backend/controllers/tagController.js
import Tag from "../models/Tag.js";

// Create a tag (Admin only)
export const createTag = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const exists = await Tag.findOne({ name });
    if (exists) return res.status(409).json({ message: "Tag already exists" });

    const tag = new Tag({ name });
    await tag.save();
    res.status(201).json(tag);
  } catch (err) {
    console.error("CreateTag error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all tags
export const getTags = async (req, res) => {
  try {
    const tags = await Tag.find().sort({ createdAt: -1 });
    res.json(tags);
  } catch (err) {
    console.error("GetTags error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get tag by slug
export const getTagBySlug = async (req, res) => {
  try {
    const tag = await Tag.findOne({ slug: req.params.slug });
    if (!tag) return res.status(404).json({ message: "Tag not found" });
    res.json(tag);
  } catch (err) {
    console.error("GetTagBySlug error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update tag (Admin only)
export const updateTag = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) return res.status(404).json({ message: "Tag not found" });

    const { name } = req.body;
    if (name) tag.name = name;

    await tag.save();
    res.json(tag);
  } catch (err) {
    console.error("UpdateTag error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete tag (Admin only)
export const deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) return res.status(404).json({ message: "Tag not found" });

    await tag.deleteOne();
    res.json({ message: "Tag deleted successfully" });
  } catch (err) {
    console.error("DeleteTag error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

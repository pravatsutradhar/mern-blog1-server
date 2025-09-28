// backend/controllers/categoryController.js
import Category from "../models/Category.js";

// Create a category (Admin only)
export const createCategory = async (req, res) => {
  console.log("CreateCategory called with body:", req.body);
  try {
    const { name, description, slug } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });
    
    const exists = await Category.findOne({ name });
    if (exists) return res.status(409).json({ message: "Category already exists" });

    const category = new Category({ name, description });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    console.error("CreateCategory error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (err) {
    console.error("GetCategories error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get category by slug
export const getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (err) {
    console.error("GetCategoryBySlug error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update category (Admin only)
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    const { name, description } = req.body;
    if (name) category.name = name;
    if (description) category.description = description;

    await category.save();
    res.json(category);
  } catch (err) {
    console.error("UpdateCategory error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete category (Admin only)
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    await category.deleteOne();
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error("DeleteCategory error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

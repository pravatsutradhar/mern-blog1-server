// backend/controllers/userController.js
import User from "../models/User.js";

// @desc Get all users (Admin only)
// @route GET /api/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error("GetAllUsers error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Get single user by ID (Admin only)
// @route GET /api/users/:id
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("GetUserById error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Update user role (Admin only)
// @route PUT /api/users/:id/role
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!["User", "Editor", "Admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = role;
    await user.save();
    res.json(user);
  } catch (err) {
    console.error("UpdateUserRole error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Delete a user (Admin only)
// @route DELETE /api/users/:id
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("DeleteUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

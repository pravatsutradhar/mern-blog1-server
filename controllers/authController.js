import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// Register a new user
export const register = async (req, res) => {
  console.log("Register request body:", req.body);
  try {
    const { name, email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: "Email already in use." });

    const user = new User({
      name: name || email.split("@")[0],
      email,
      password,
      role: role || "User",
    });

    await user.save();

    const token = generateToken({ id: user._id, role: user.role });

    return res.status(201).json({
      user: user.toJSON(),
      token,
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// Login an existing user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required." });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials." });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials." });

    const token = generateToken({ id: user._id, role: user.role });

    return res.json({
      user: user.toJSON(),
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// get current user profile
export const getProfile = async (req, res) => {
  try {
    // authMiddleware attaches req.user (id and role) and optionally full user
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json(user);
  } catch (err) {
    console.error("GetProfile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, password } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password;
    await user.save();
    return res.json(user.toJSON());
  } catch (err) {
    console.error("UpdateProfile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Logout user (for JWT, this is mostly handled on client-side by deleting token)
export const logout = (req, res) => {
  // For JWT, logout is handled on client-side by deleting the token.
  return res.json({ message: "Logout successful on client side by deleting the token." });
};


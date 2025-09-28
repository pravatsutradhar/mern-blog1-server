// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // attach user info: id and role (lightweight). If you need full user: load from DB
    req.user = { id: decoded.id, role: decoded.role };

    // Optionally, attach full user document:
    // req.currentUser = await User.findById(decoded.id).select("-password");

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};


/**
 * authorizeRoles(...roles) -> middleware to restrict route to given roles
 * usage: router.get('/admin', protect, authorizeRoles('Admin'), adminController)
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Not authorized" });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: insufficient permissions" });
    }
    next();
  };
};

// Usage example for role-based access control
// app.get('/admin', protect, authorize('Admin'), adminController);
// app.get('/editor', protect, authorize('Admin', 'Editor'), editorController);
// app.get('/user', protect, authorize('Admin', 'Editor', 'User'), userController);
// You can customize roles as per your application needs

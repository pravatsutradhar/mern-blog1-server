import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import tagRoutes from "./routes/tagRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import mediaRoutes from "./routes/mediaRoutes.js";
import path from "path";


// Initialize Express app
const app = express();

// Security headers
app.use(helmet());

// Node Environment based logging
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// CORS configuration
app.use(cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:7173",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));


// Middlewares to parse JSON and cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Database connection
connectDB();

// Main route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Auth routes
app.use('/api/auth', authRoutes);
// User routes (Admin only)
app.use('/api/users', userRoutes);
// Post routes
app.use('/api/posts', postRoutes);
// Category routes
app.use('/api/categories', categoryRoutes);
// Tag routes
app.use('/api/tags', tagRoutes);
app.use("/api/comments", commentRoutes);


// Serve uploaded files statically
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));
// Media routes
app.use("/api/media", mediaRoutes);


// Start server with PORT from .env or default to 5000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
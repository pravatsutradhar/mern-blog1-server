import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from "./routes/postRoutes.js";

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
// Post routes
app.use('/api/posts', postRoutes);

// Start server with PORT from .env or default to 5000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
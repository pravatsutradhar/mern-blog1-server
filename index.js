import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Database connection
connectDB();

// Middleware
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173', 'https://your-production-domain.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Example route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
/**
 * Server Entry Point
 * ------------------
 * 1. Loads environment variables from .env
 * 2. Connects to MongoDB
 * 3. Starts the Express HTTP server
 *
 * Run with: node src/server.js
 */

import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/db.js';
import app from './app.js';

const PORT = process.env.PORT || 5000;

const start = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
};

start();

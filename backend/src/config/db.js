/**
 * Database Configuration
 * ---------------------
 * Establishes a connection to MongoDB Atlas using Mongoose.
 * Called once at server startup (server.js) before Express begins listening.
 */

import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

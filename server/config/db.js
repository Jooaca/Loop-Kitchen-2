const mongoose = require('mongoose');

// Disable buffering so Mongoose calls fail fast if DB is offline, enabling fallback store
mongoose.set('bufferCommands', false);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/loopkitchen', {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[MongoDB Notice]: Running with in-memory fallback store (${error.message}). To connect to MongoDB, ensure service is running.`);
  }
};

module.exports = connectDB;

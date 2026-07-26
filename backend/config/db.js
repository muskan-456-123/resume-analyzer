const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.warn("⚠️ MONGODB_URI not set. Running with in-memory fallback storage.");
    return false;
  }
  try {
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (err) {
    console.error(`❌ MongoDB Connection Error: ${err.message}`);
    console.warn("⚠️ Continuing with in-memory fallback storage.");
    return false;
  }
};

module.exports = connectDB;

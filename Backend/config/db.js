const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI);
    isConnected = db.connections[0].readyState;
    console.log('✅ Connected to MongoDB via Mongoose (Cached)');
    
    // Seed fixed categories if DB is empty
    const Category = require('../models/Category');
    const FIXED_CATEGORIES = require('../constants/categories');
    const count = await Category.countDocuments();
    if (count === 0) {
      await Category.insertMany(FIXED_CATEGORIES);
      console.log('📦 Categories seeded successfully!');
    }
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    throw err;
  }
};

module.exports = connectDB;

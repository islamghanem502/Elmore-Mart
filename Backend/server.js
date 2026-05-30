const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: true, 
  credentials: true,
}));
app.use(express.json());

// Import Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const categoryRoutes = require('./routes/categories');

// Route Middlewares
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(async () => {
  console.log('✅ Connected to MongoDB via Mongoose');
  
  // Seed fixed categories if DB is empty
  const Category = require('./models/Category');
  const FIXED_CATEGORIES = require('./constants/categories');
  const count = await Category.countDocuments();
  if (count === 0) {
    await Category.insertMany(FIXED_CATEGORIES);
    console.log('📦 Categories seeded successfully!');
  }
})
.catch((err) => console.error('❌ MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

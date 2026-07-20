const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Middleware to ensure DB connection is ready (lazy connection)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

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
const chatRoutes = require('./routes/chat');

// Route Middlewares
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/chat', chatRoutes);

module.exports = app;

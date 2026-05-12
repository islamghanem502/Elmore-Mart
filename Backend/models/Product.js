const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    ar: { type: String, required: true },
    en: { type: String, required: true }
  },
  description: {
    ar: { type: String },
    en: { type: String }
  },
  price: { type: Number, required: true },
  image: { type: String, required: true }, // Cloudinary URL
  category: { type: String, required: true },
  stock: { type: Number, default: 0 },
  available: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

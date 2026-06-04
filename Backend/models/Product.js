const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  available: { type: Boolean, default: true },
  image: { type: String },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  
  tags: { type: [String], default: [] }, 

  embedding: { type: [Number] },
  searchText: { type: String }
}, { timestamps: true });

productSchema.index(
  { name: 'text', tags: 'text' },
  { weights: { name: 10, tags: 5 }, default_language: 'arabic' }
);

module.exports = mongoose.model('Product', productSchema);

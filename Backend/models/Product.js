const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  available: { type: Boolean, default: true },
  image: { type: String },

  // الربط الذكي مع الأقسام
  categoryId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category', 
    required: true 
  },
  
  // الحقل السحري للـ Vector Search
  // (هنا سنخزن المتجه الرقمي الذي يعبر عن معنى المنتج)
  embedding: { type: [Number] }, 
  
  // حقل السياق الكامل (لن يظهر للمستخدم، لكنه سيستخدمه الـ AI للبحث)
  // يسهل عملية الـ Embedding لاحقاً
  searchText: { type: String } 
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

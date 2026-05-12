const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  qty: { type: Number, required: true },
  price: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'delivering', 'done'], default: 'pending' },
  paymentMethod: { type: String, enum: ['online', 'cash'], required: true },
  address: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);

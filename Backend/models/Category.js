const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    ar: { type: String, required: true },
    en: { type: String, required: true }
  },
  image: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);

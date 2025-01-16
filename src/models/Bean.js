const mongoose = require('mongoose');

const PriceSchema = new mongoose.Schema({
  size: { type: String, required: true },
  price: { type: String, required: true },
  currency: { type: String, required: true },
});

const BeanSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  roasted: { type: String, required: true },
  imagelink_square: { type: String, required: true },
  imagelink_portrait: { type: String, required: true },
  ingredients: { type: String, required: true },
  special_ingredient: { type: String, required: true },
  prices: [PriceSchema],
  average_rating: { type: Number, required: true },
  ratings_count: { type: String, required: true },
  favourite: { type: Boolean, required: true },
  type: { type: String, required: true },
  index: { type: Number, required: true },
});

module.exports = mongoose.model('Bean', BeanSchema);

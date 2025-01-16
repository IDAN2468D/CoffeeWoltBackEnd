const mongoose = require("mongoose");

const coffeeSchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  roasted: String,
  imagelink_square: String,
  imagelink_portrait: String,
  ingredients: String,
  special_ingredient: String,
  prices: [
    {
      size: String,
      price: String,
      currency: String,
    },
  ],
  average_rating: Number,
  ratings_count: String,
  favourite: Boolean,
  type: String,
  index: Number,
});

const Coffee = mongoose.model("Coffee", coffeeSchema);

module.exports = Coffee;

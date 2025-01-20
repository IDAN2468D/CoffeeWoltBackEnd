const mongoose = require("mongoose"); // ייבוא Mongoose

// יצירת הסכמה להזמנות
const orderSchema = new mongoose.Schema({
  CartList: [
    {
      id: { type: String, required: true },
      index: { type: Number, required: true },
      name: { type: String, required: true },
      roasted: { type: String },
      imagelink_square: { type: Number },
      special_ingredient: { type: String },
      type: { type: String },
      prices: { type: Array },
      ItemPrice: { type: String, required: true },
    },
  ],
  CartListPrice: { type: Number, required: true },
  OrderDate: { type: Date, required: true },
});

// יצירת מודל המבוסס על הסכמה
const Order = mongoose.model("Order", orderSchema);

module.exports = Order;

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  CartList: {
    type: [String], // רשימה של פריטים בעגלה
    required: true,
  },
  CartListPrice: {
    type: Number, // המחיר הכולל של העגלה
    required: true,
  },
  OrderDate: {
    type: Date, // תאריך ההזמנה
    default: Date.now, // ברירת מחדל: התאריך הנוכחי
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;

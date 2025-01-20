const mongoose = require("mongoose"); // ייבוא Mongoose

const orderSchema = new mongoose.Schema({
  CartList: {
    type: [Object], // רשימה של פריטים בעגלה
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

// יצירת מודל המבוסס על הסכמה
const Order = mongoose.model("Order", orderSchema);

module.exports = Order; // ייצוא המודל לשימוש בקבצים אחרים

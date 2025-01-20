const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    CartList: {
        type: [String], // אם זה מערך של מחרוזות
        required: true,
    },
    CartListPrice: {
        type: Number,
        required: true,
    },
    OrderDate: {
        type: Date,
        required: true,
    }
});

const Order = mongoose.model('Order', OrderSchema);
module.exports = Order;

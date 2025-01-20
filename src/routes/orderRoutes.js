const express = require("express");
const Order = require("../models/orderSchema");
const router = express.Router();

// מסלול ה-POST לקבלת הזמנות
router.post('/', async (req, res) => {
    try {
        const { orders } = req.body;
        console.log("Orders received:", orders);

        if (!orders || !Array.isArray(orders)) {
            return res.status(400).json({ message: 'Invalid orders data' });
        }

        // נסה להוסיף למסד הנתונים
        const addedOrders = await Order.insertMany(orders);
        console.log("Orders added to database:", addedOrders);

        if (!addedOrders || addedOrders.length === 0) {
            return res.status(500).json({ message: 'Failed to add order history' });
        }

        res.status(200).json({ message: 'Order history added successfully' });
    } catch (error) {
        console.error("Error adding orders:", error.message);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
});
  
module.exports = router;

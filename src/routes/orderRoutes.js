const express = require("express");
const Order = require("../models/orderSchema");
const router = express.Router();

// מסלול ה-POST לקבלת הזמנות
router.post('/', async (req, res) => {
    try {
      const orders = req.body.orders; // קבלת רשימת הזמנות מהבקשה
  
      if (!orders || orders.length === 0) {
        return res.status(400).json({ message: 'No orders provided' });
      }
  
      // ניהול הוספת הזמנות למסד הנתונים
      const addedOrders = await Order.insertMany(orders);
      
      // אם לא הצלחנו להוסיף את ההזמנות
      if (!addedOrders || addedOrders.length === 0) {
        return res.status(500).json({ message: 'Failed to add order history' });
      }
  
      res.status(201).json({
        message: 'Order history added successfully',
        data: addedOrders,
      });
    } catch (error) {
      console.error('Error adding order history:', error);
      res.status(500).json({ message: 'Failed to add order history' });
    }
  });
  
module.exports = router;

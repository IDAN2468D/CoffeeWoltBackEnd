const express = require("express");
const Order = require("../models/orderSchema");
const router = express.Router();

// מסלול ה-POST לקבלת הזמנות
router.post('/', async (req, res) => {
    try {
        const { orders } = req.body;

        // מיפוי והמרת ההזמנות לפורמט תקין
        const formattedOrders = orders.map(order => {
            const formattedDate = new Date(order.OrderDate);  // המרת המחרוזת לתאריך

            // אם התאריך לא חוקי, נזרוק שגיאה
            if (isNaN(formattedDate.getTime())) {
                throw new Error(`Invalid date format for OrderDate: ${order.OrderDate}`);
            }

            // טיפול בפריטים חסרים
            const fixedCartList = order.CartList.map(item => {
                if (!item.id) item.id = "default-id";
                if (!item.index) item.index = 0;
                if (!item.name) item.name = "Unnamed Item";
                if (!item.ItemPrice) item.ItemPrice = "0.00";

                return item;
            });

            return {
                CartList: fixedCartList,
                CartListPrice: order.CartListPrice,
                OrderDate: formattedDate, // שימוש בתאריך המפורמט
            };
        });

        // הוספת ההזמנות למסד הנתונים
        const addedOrders = await Order.insertMany(formattedOrders);

        res.status(200).json({ message: 'Order history added successfully', addedOrders });
    } catch (error) {
        console.error("Error adding orders:", error.message);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
});

module.exports = router;

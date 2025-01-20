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

            return {
                CartList: order.CartList.map(item => ({
                    id: item.id,
                    index: item.index,
                    name: item.name,
                    roasted: item.roasted,
                    imagelink_square: item.imagelink_square,
                    special_ingredient: item.special_ingredient,
                    type: item.type,
                    prices: item.prices,
                    ItemPrice: item.ItemPrice,
                })),
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

const express = require("express");
const Order = require("../models/orderSchema");
const nodemailer = require("nodemailer"); // ייבוא nodemailer
const router = express.Router();

// הגדרת transporter עבור nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail", // לדוגמה, Gmail
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS,
    },
});

// מסלול ה-POST לקבלת הזמנות
router.post('/', async (req, res) => {
    try {
        const { orders, email } = req.body; // כולל כתובת אימייל במידה וסופקה

        // מיפוי והמרת ההזמנות לפורמט תקין
        const formattedOrders = orders.map(order => {
            const fixedCartList = order.CartList.map(item => {
                if (typeof item !== 'object') {
                    console.error(`Expected item to be an object, got ${typeof item}`);
                    throw new Error(`Invalid item format in CartList: expected object, got ${typeof item}`);
                }

                if (!item.id) item.id = "default-id";
                if (!item.index) item.index = 0;
                if (!item.name) item.name = "Unnamed Item";
                if (!item.ItemPrice) item.ItemPrice = "0.00";

                return item;
            });

            const formattedDate = new Date(order.OrderDate);
            if (isNaN(formattedDate.getTime())) {
                console.error(`Invalid date format for OrderDate: ${order.OrderDate}`);
                throw new Error(`Invalid date format for OrderDate`);
            }

            return {
                CartList: fixedCartList,
                CartListPrice: order.CartListPrice,
                OrderDate: formattedDate,
            };
        });

        // הוספת ההזמנות למסד הנתונים
        const addedOrders = await Order.insertMany(formattedOrders);

        // בניית תוכן האימייל
        const emailContent = `
            <h1>Order History</h1>
            <p>The following orders were added successfully:</p>
            <ul>
                ${addedOrders.map(order => `
                    <li>
                        <strong>Date:</strong> ${order.OrderDate}<br>
                        <strong>Total Price:</strong> ${order.CartListPrice}<br>
                        <strong>Items:</strong>
                        <ul>
                            ${order.CartList.map(item => `
                                <li>
                                    ${item.name} - ${item.ItemPrice}
                                </li>
                            `).join('')}
                        </ul>
                    </li>
                `).join('')}
            </ul>
        `;

        // שליחת האימייל
        if (email) {
            await transporter.sendMail({
                from: process.env.EMAIL_USER, // שולח
                to: email, // כתובת הנמען
                subject: "Order History Confirmation",
                html: emailContent, // תוכן HTML
            });
        }

        res.status(200).json({ message: 'Order history added successfully', addedOrders });
    } catch (error) {
        console.error("Error adding orders:", error.message);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
});

module.exports = router;
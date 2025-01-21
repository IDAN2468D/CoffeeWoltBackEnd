const express = require("express");
const Order = require("../models/orderSchema");
const nodemailer = require("nodemailer"); // ייבוא nodemailer
const router = express.Router();

// הגדרת transporter עבור nodemailer עם מצב debug פעיל
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
        const { orders } = req.body; // כולל כתובת אימייל במידה וסופקה

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
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h1 style="color: #007BFF; text-align: center;">Order History</h1>
            <p style="font-size: 16px;">The following orders were added successfully:</p>
            <ul style="list-style: none; padding: 0;">
                ${addedOrders.map(order => `
                    <li style="margin-bottom: 20px; border: 1px solid #ddd; border-radius: 8px; padding: 15px; background-color: #f9f9f9;">
                        <p style="margin: 0; font-size: 14px;">
                            <strong>Date:</strong> ${order.OrderDate}<br>
                            <strong>Total Price:</strong> ${order.CartListPrice}
                        </p>
                        <strong>Items:</strong>
                        <ul style="list-style: none; padding-left: 15px; margin-top: 10px;">
                            ${order.CartList.map(item => `
                                <li style="margin-bottom: 5px; font-size: 14px;">
                                    ${item.name} - <strong>${item.ItemPrice}</strong>
                                </li>
                            `).join('')}
                        </ul>
                    </li>
                `).join('')}
            </ul>
        </div>
    `;
    
    // שליחת האימייל
    // שלח את המייל עם טיפול בשגיאות
    try {
        await transporter.sendMail({
        from: process.env.EMAIL_ORDER,
        to:  "idankzm@gmail.com",
        subject: "Order History Confirmation",
        html: emailContent, 
    });
    console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: `Email sending failed: ${error.message}` });
    }

        
        res.status(200).json({ message: 'Order history added successfully', addedOrders });
    } catch (error) {
        console.error("Error adding orders:", error.message);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
});

module.exports = router;
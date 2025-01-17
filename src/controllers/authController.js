const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AppError } = require('../utils/errorHandler');

// הגדרת Nodemailer לשליחת אימיילים
const transporter = nodemailer.createTransport({
  service: 'gmail', // אפשר להחליף לשירות אימייל אחר אם תרצה
  auth: {
    user: process.env.EMAIL_USER, // כתובת האימייל שלך
    pass: process.env.EMAIL_PASS, // הסיסמא שלך (מומלץ להשתמש ב-OAuth2 לצורך אבטחה טובה יותר)
  }
});

// פונקציה לשליחת אימייל אחרי התחברות
const sendLoginEmail = async (email, username) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER, // כתובת המייל ממנה נשלח ההודעה
      to: email, // כתובת המייל של המשתמש
      subject: 'Login Notification', // נושא ההודעה
      text: `Hello ${username},\n\nYou have successfully logged into your account.`, // תוכן ההודעה
    };

    await transporter.sendMail(mailOptions); // שליחת האימייל
  } catch (error) {
    console.error('Error sending email:', error); // אם יש שגיאה במהלך שליחת האימייל
  }
};

// פונקציית רישום משתמש
const register = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;

    if (!username) {
      // ניתן לייצר שם משתמש מתוך האימייל או ליצור אחד ברירת מחדל
      username = email.split('@')[0]; // לדוגמה: שם משתמש מתוך האימייל לפני ה- '@'
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email already exists', 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      email,
      password: hashedPassword,
      username
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      status: 'success',
      message: 'User created successfully',
      data: {
        user: { email: user.email, username: user.username },
        token
      }
    });
  } catch (err) {
    next(err);
  }
};

// פונקציית התחברות
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new AppError('Invalid credentials', 401);
    }

    // שליחת אימייל לאחר התחברות מוצלחת
    await sendLoginEmail(user.email, user.username);

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      status: 'success',
      message: 'Logged in successfully',
      data: {
        user: { email: user.email },
        token
      }
    });
  } catch (err) {
    next(err);
  }
};

// פונקציית עדכון סיסמא
const updatePassword = async (req, res, next) => {
  try {
    const { email, oldPassword, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const validPassword = await bcrypt.compare(oldPassword, user.password);
    if (!validPassword) {
      throw new AppError('Invalid old password', 401);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.json({
      status: 'success',
      message: 'Password updated successfully'
    });
  } catch (err) {
    next(err);
  }
};

// פונקציית מחיקת משתמש
const deleteUser = async (req, res, next) => {
  try {
    const { email } = req.body;

    const deletedUser = await User.findOneAndDelete({ email });
    if (!deletedUser) {
      throw new AppError('User not found', 404);
    }

    res.json({
      status: 'success',
      message: 'User deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  updatePassword,
  deleteUser
};

const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AppError } = require('../utils/errorHandler');

// הגדרת Nodemailer לשליחת אימיילים
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS,
  }
});

// פונקציה לשליחת אימייל אחרי התחברות
const sendLoginEmail = async (email, username) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER, 
      to: email, 
      subject: 'Login Notification', 
      text: `Hello ${email},\n\nYou have successfully logged into your account.`, 
    };

    await transporter.sendMail(mailOptions); 
  } catch (error) {
    console.error('Error sending email:', error); 
  }
};

// פונקציית רישום משתמש
const register = async (req, res, next) => {
  try {
    const { email, password, username } = req.body;

    if (!username) {
      username = email.split('@')[0]; 
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
    await sendLoginEmail(user.email);

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

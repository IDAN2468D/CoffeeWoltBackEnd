const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/errorHandler');

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      next(new AppError('Invalid token', 401));
    } else {
      next(err);
    }
  }
};

module.exports = { verifyToken };
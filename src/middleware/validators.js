const { body, validationResult } = require('express-validator');

const registerValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .not()
    .isEmpty()
    .withMessage('Email is required'),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number')
];

const loginValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .not()
    .isEmpty()
    .withMessage('Email is required'),

  body('password')
    .not()
    .isEmpty()
    .withMessage('Password is required')
];

const updatePasswordValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .not()
    .isEmpty()
    .withMessage('Email is required'),

  body('oldPassword')
    .not()
    .isEmpty()
    .withMessage('Old password is required'),

  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number')
    .custom((value, { req }) => {
      if (value === req.body.oldPassword) {
        throw new Error('New password must be different from old password');
      }
      return true;
    })
];

const deleteUserValidation = [
  body('email')
    .trim()
    .isEmail()
    .withMessage('Invalid email format')
    .not()
    .isEmpty()
    .withMessage('Email is required')
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      status: 'error',
      message: 'Validation error',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

module.exports = {
  registerValidation,
  loginValidation,
  updatePasswordValidation,
  deleteUserValidation,
  validate
};

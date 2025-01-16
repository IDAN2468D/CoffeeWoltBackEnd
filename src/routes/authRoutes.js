const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
  registerValidation,
  loginValidation,
  updatePasswordValidation,
  deleteUserValidation,
  validate
} = require('../middleware/validators');
const {
  register,
  login,
  updatePassword,
  deleteUser
} = require('../controllers/authController');

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.put('/update-password', verifyToken, updatePasswordValidation, validate, updatePassword);
router.delete('/delete-user', verifyToken, deleteUserValidation, validate, deleteUser);

module.exports = router;

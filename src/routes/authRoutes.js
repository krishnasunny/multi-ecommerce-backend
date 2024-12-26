const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { register, login } = require('../controllers/authController');

router.post('/register', [
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  body('first_name').notEmpty(),
  body('last_name').notEmpty(),
  body('role').isIn(['customer', 'vendor', 'admin', 'delivery_agent'])
], register);

router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty()
], login);

module.exports = router;
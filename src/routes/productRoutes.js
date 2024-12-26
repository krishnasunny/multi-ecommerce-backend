const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const { createProduct, getProducts } = require('../controllers/productController');

router.post('/', auth, checkRole(['vendor', 'admin']), createProduct);
router.get('/', getProducts);

module.exports = router;
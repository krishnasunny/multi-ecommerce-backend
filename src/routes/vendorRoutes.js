const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const vendorController = require('../controllers/vendorController');
const { vendorValidation } = require('../validations/vendorValidation');

router.get('/', vendorController.getVendors);
router.get('/:id', vendorController.getVendorById);
router.post('/', auth, checkRole(['admin']), vendorValidation.createVendor, vendorController.createVendor);
router.put('/:id', auth, checkRole(['admin', 'vendor']), vendorValidation.updateVendor, vendorController.updateVendor);
router.delete('/:id', auth, checkRole(['admin']), vendorController.deleteVendor);

module.exports = router;
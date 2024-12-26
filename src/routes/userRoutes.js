const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const userController = require('../controllers/userController');
const { userValidation } = require('../validations/userValidation');

router.get('/', auth, checkRole(['admin']), userController.getUsers);
router.get('/:id', auth, userController.getUserById);
router.post('/', userValidation.createUser, userController.createUser);
router.put('/:id', auth, userValidation.updateUser, userController.updateUser);
router.delete('/:id', auth, checkRole(['admin']), userController.deleteUser);

module.exports = router;
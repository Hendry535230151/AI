const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getAllUsers);
router.get('/email', userController.getUserByEmail);
router.get('/name', userController.getUserByName);
router.get('/find-user/:id', userController.getUserById);
router.delete('/delete-user/:id', userController.deleteUserById);

module.exports = router;

const express = require('express');
const router = express.Router();
const directoryController = require('../controllers/directorryController');

router.get('/', directoryController.getAllDirectories);
router.get('/name', directoryController.getDirectoryByName);
router.get('/find-directory/:id', directoryController.getDirectoryById);
router.post('/create', directoryController.createDirectory);
router.put('/rename-directory/:id', directoryController.updateDirectoryName);
router.delete('/delete-directory/:id', directoryController.deleteDirectory);

module.exports = router;

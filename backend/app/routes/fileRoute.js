const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');

router.get('/', fileController.getAllFiles);
router.get('/name/:fileName', fileController.getFileByName);
router.get('/search/:id', fileController.getFileById);
router.post('/create', fileController.createFile);
router.put('/rename/:id', fileController.renameFile);
router.delete('/delete/:id', fileController.deleteFileById);

module.exports = router;

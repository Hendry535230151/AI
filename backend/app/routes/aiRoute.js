const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/chat', aiController.aiChatting);
router.get('/history', aiController.getHistory);


module.exports = router;

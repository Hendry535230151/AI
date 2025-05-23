const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const historyController = require("../controllers/historyController");

router.get("/chat_history", authMiddleware, historyController.getAllHistories);
router.post("/chat_history", authMiddleware, historyController.createHistory);

module.exports = router;

const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");
const authMiddleware = require("../middleware/auth");

router.post("/chat", authMiddleware, aiController.aiChatting);
router.get("/history", authMiddleware, aiController.getHistory);
router.get("/history/:chathistoryid", authMiddleware, aiController.getHistoryId);


module.exports = router;

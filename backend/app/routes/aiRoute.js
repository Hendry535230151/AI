const express = require("express");
const router = express.Router();
const aiController = require("../controllers/aiController");
const authMiddleware = require("../middleware/auth");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/chat", authMiddleware, aiController.aiChatting);
router.post(
  "/chat-insert-file",
  authMiddleware,
  upload.single("file"),
  aiController.aiInsertFile
);
router.get("/history", authMiddleware, aiController.getHistory);
router.get(
  "/history/:chathistoryid",
  authMiddleware,
  aiController.getHistoryId
);

module.exports = router;

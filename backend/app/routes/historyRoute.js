const express = require("express");
const router = express.Router();
const historyController = require("../controllers/historyController");

router.post("/", historyController.createHistory);
router.get("/", historyController.getAllHistories);
router.get("/:id", historyController.getHistoryById);
router.get("/user/:userId", historyController.getHistoryByUserId);
router.get("/search", historyController.getHistoryByTitle);
router.put("/:id", historyController.updateHistoryById);
router.delete("/:id", historyController.deleteHistoryById);
router.delete("/clear/:userId", historyController.clearUserHistory);

module.exports = router;

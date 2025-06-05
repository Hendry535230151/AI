const express = require("express");
const router = express.Router();
const historyController = require("../controllers/historyController");

router.get("/search/:userId", historyController.getHistoryByTitle);
router.post("/", historyController.createHistory);
router.get("/", historyController.getAllHistories);
router.get("/user/:userId", historyController.getHistoryByUserId);
router.get("/:id", historyController.getHistoryById);
router.put("/:id", historyController.updateHistoryById);
router.delete("/:id", historyController.deleteHistoryById);
router.delete("/clear/:userId", historyController.clearUserHistory);

module.exports = router;

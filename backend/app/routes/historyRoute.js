const express = require("express");
const router = express.Router();
const historyController = require("../controllers/historyController");

router.post("/", historyController.createHistory);
router.get("/", historyController.getAllHistories);
router.get("/:id", historyController.getHistoryById);
router.get("/user/:userId", historyController.getHistoryByUserId);
router.delete("/:id", historyController.deleteHistoryById);
router.put("/:id", historyController.updateHistoryById);

module.exports = router;

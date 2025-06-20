const express = require("express");
const router = express.Router();
const directoryController = require("../controllers/directoryController");

router.get("/name/:userId", directoryController.getDirectoryByName);
router.get("/", directoryController.getAllDirectories);
router.get("/find-directory/:id", directoryController.getDirectoryById);
router.get(
  "/find-user-directory/:userId",
  directoryController.getDirectoryByUserId
);
router.post("/create", directoryController.createDirectory);
router.put("/update-total-file/:userId", directoryController.updateTotalFiles);
router.put("/rename-directory/:id", directoryController.updateDirectoryName);
router.delete("/delete-directory/:id", directoryController.deleteDirectory);
router.delete("/clear/:userId", directoryController.clearUserDirectory);

module.exports = router;

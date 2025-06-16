const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/", userController.getAllUsers);
router.get("/email", userController.getUserByEmail);
router.get("/name", userController.getUserByName);
router.get("/find-user/:id", userController.getUserById);
router.put("/theme/:id", userController.setTheme);
router.delete("/delete-user/:id", userController.deleteUserById);
router.put("/:userId/name", userController.updateName);
module.exports = router;

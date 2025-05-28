const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");

router.get("/verify-token", authMiddleware, (req, res) => {
  res.json({ message: "Token is verified" });
});

module.exports = router;

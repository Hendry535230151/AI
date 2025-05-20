const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/:filename", (req, res) => {
  const { filename } = req.params;

  const query =
    "SELECT file_name, file_type, file_buffer FROM files WHERE file_name = ?";
  db.query(query, [filename], (err, results) => {
    if (err) {
      return res.status(500).send("Database error");
    }

    if (!results || results.length === 0) {
      return res.status(404).send("File not found");
    }

    const file = results[0];
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${file.file_name}"`
    );
    res.setHeader("Content-Type", file.file_type);
    res.send(file.file_buffer);
  });
});

module.exports = router;

const directoryService = require("../services/directoryService");
const fileService = require("../services/fileService");

const fileController = {
  getAllFiles: async (req, res) => {
    try {
      const files = await fileService.getFiles();
      res.status(200).json({ success: true, data: files });
    } catch (err) {
      res.status(err.statusCode || 400).json({
        success: false,
        message: err.message || "Failed to fetch files",
      });
    }
  },

  getFileByName: async (req, res) => {
    const { fileName } = req.params;

    try {
      const file = await fileService.getFileByName(fileName);
      res.status(200).json({ success: true, data: file });
    } catch (err) {
      res.status(err.statusCode || 400).json({
        success: false,
        message: err.message || "Failed to fetch file by name",
      });
    }
  },

  getFileById: async (req, res) => {
    const { id } = req.params;

    try {
      const file = await fileService.getFileById(id);
      res.status(200).json({ success: true, data: file });
    } catch (err) {
      res.status(err.statusCode || 400).json({
        success: false,
        message: err.message || "Failed to fetch file by ID",
      });
    }
  },

  createFile: async (req, res) => {
    const { userId, directoryId, description } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "File is required, please provide valid file and try again",
      });
    }

    try {
      const newFile = await fileService.createFile(
        userId,
        directoryId,
        file.originalname,
        file.mimetype,
        file.size,
        file.buffer,
        description
      );
      res.status(201).json({
        success: true,
        message: "File created successfully",
        data: newFile,
      });
    } catch (err) {
      res.status(err.statusCode || 400).json({
        success: false,
        message: err.message || "Failed to create file",
      });
    }
  },

  renameFile: async (req, res) => {
    const { id } = req.params;
    const { fileName } = req.body;

    try {
      const updatedFile = await fileService.renameFile(id, fileName);
      res.status(200).json({
        success: true,
        message: "File renamed successfully",
        data: updatedFile,
      });
    } catch (err) {
      res.status(err.statusCode || 400).json({
        success: false,
        message: err.message || "Failed to rename file",
      });
    }
  },

  deleteFileById: async (req, res) => {
    const { id } = req.params;

    try {
      const deletedFile = await fileService.deleteFileById(id);
      res.status(200).json({
        success: true,
        message: "File deleted successfully",
        data: deletedFile,
      });
    } catch (err) {
      res.status(err.statusCode || 400).json({
        success: false,
        message: err.message || "Failed to delete file",
      });
    }
  },
};

module.exports = fileController;

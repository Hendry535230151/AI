const directoryService = require("../services/directoryService");

const directoryController = {
  getAllDirectories: async (req, res) => {
    try {
      const directories = await directoryService.getDirectories();
      res.status(200).json({ success: true, data: directories });
    } catch (err) {
      res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Failed to fetch directories",
      });
    }
  },

  getDirectoryById: async (req, res) => {
    const { id } = req.params;
  
    try {
      const directory = await directoryService.getDirectoryById(id);
      res.status(200).json({ success: true, data: directory });
    } catch (err) {
      res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Failed to fetch directory by ID",
      });
    }
  },

  getDirectoryByUserId: async (req, res) => {
    const { userId } = req.params;
    try {
      const directories = await directoryService.getDirectoriesByUserId(userId);
      res.status(200).json({ success: true, data: directories });
    } catch (err) {
      res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Failed to fetch directories",
      });
    }
  },

  getDirectoryByName: async (req, res) => {
    const { searchQuery } = req.query;
    const { userId } = req.params;

    try {
      const directory = await directoryService.getDirectoryByName(
        searchQuery, userId
      );
      res.status(200).json({ success: true, data: directory });
    } catch (err) {
      res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Failed to fetch directory by name",
      });
    }
  },

  createDirectory: async (req, res) => {
    const { userId, directoryName, parentDirectory } = req.body;

    try {
      const newDirectory = await directoryService.createDirectory(
        userId,
        directoryName,
        parentDirectory
      );
      res.status(201).json({
        success: true,
        message: "Directory created successfully",
        data: newDirectory,
      });
    } catch (err) {
      res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Failed to create directory",
      });
    }
  },

  updateDirectoryName: async (req, res) => {
    const { id } = req.params;
    const { userId, directoriesName } = req.body;

    try {
      const updated = await directoryService.updateDirectoryName(
        id,
        userId,
        directoriesName
      );
      res.status(200).json({
        success: true,
        message: "Directory updated successfully",
        data: updated,
      });
    } catch (err) {
      res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Failed to update directory",
      });
    }
  },

  updateTotalFiles: async (req, res) => {
    const { userId } = req.params;

    try {
      await directoryService.updateTotalFiles(userId); 
      res
        .status(200)
        .json({ success: true, message: "Total file already updated" });
    } catch (err) {
      res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Failed to delete directory",
      });
    } 
  },

  deleteDirectory: async (req, res) => {
    const { id } = req.params;

    try {
      await directoryService.deleteDirectory(id);
      res
        .status(200)
        .json({ success: true, message: "Directory deleted successfully" });
    } catch (err) {
      res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Failed to delete directory",
      });
    }
  },

  clearUserDirectory: async (req, res) => {
    const { userId } = req.params;

    try {
      const A = await directoryService.clearUserDirectory(userId);
      console.log(A)
      res
        .status(200)
        .json({ success: true, message: "Success to clear all directory"});
    } catch (err) {
      res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Failed to clear directory",
      });
    }
  }
};

module.exports = directoryController;

const historyService = require('../services/historyService');

const historyController = {
  getAllHistories: async (req, res) => {
    try {
      const histories = await historyService.getHistories();
      res.status(200).json({ success: true, data: histories });
    } catch (err) {
      res.status(err.statusCode || 400).json({ success: false, message: err.message || 'Failed to fetch Histories' });
    }
  },

  getHistoryById: async (req, res) => {
    const { id } = req.params;
    try {
      const history = await historyService.getHistoryById(id);
      res.status(200).json({ success: true, data: history });
    } catch (err) {
      res.status(err.statusCode || 400).json({ success: false, message: err.message });
    }
  },
  
  getHistoryByUserId: async (req, res) => {
    const { userId } = req.params;
    try {
      const history = await historyService.getHistoryByUserId(userId);
      res.status(200).json({ success: true, data: history });
    } catch (err) {
      res.status(err.statusCode || 400).json({ success: false, message: err.message });
    }
  },

  getHistoryByTitle: async (req, res) => {
    const { userId } = req.params;
    const { searchQuery } = req.query;

    try {
      const history = await historyService.getHistoryByTitle(searchQuery, userId);
      res.status(200).json({ success: true, data: history });
    } catch (err) {
      res.status(err.statusCode || 400).json({ success: false, message: err.message });
    }
  },

  createHistory: async (req, res) => {
    const { userId, title } = req.body;
    try {
      const newHistory = await historyService.createHistory(userId, title);
      res.status(201).json({ success: true, message: 'History created successfully', data: newHistory });
    } catch (err) {
      res.status(err.statusCode || 400).json({ success: false, message: err.message || 'Failed to create history' });
    }
  },

  updateHistoryById: async (req, res) => {
    const { id } = req.params;
    const { userId, title } = req.body;

    try {
      const updated = await historyService.updateHistoryById(
        id,
        userId,
        title,
      );
      res.status(200).json({
        success: true,
        message: "Title updated successfully",
        data: updated,
      });
    } catch (err) {
      res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Failed to update title",
      });
    }
  },


  deleteHistoryById: async (req, res) => {
    const { id } = req.params;

    try {
      const deleteHistory = await historyService.deleteHistoryById(id);
      res.status(200).json({ success: true, message: 'History deleted successfully', data: deleteHistory });
    } catch (err) {
      res.status(err.statusCode || 400).json({ success: false, message: err.message || 'Failed to delete history' });
    }
  },

  clearUserHistory: async (req, res) => {
    const { userId } = req.params;

    try {
      await historyService.clearUserHistory(userId);
      res
        .status(200)
        .json({ success: true, message: "Success to clear all history"});
    } catch (err) {
      res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Failed to clear hisotry",
      });
    }
  }
};

module.exports = historyController;



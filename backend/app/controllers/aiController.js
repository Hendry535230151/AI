const aiService = require("../services/aiService");

const aiController = {
  aiChatting: async (req, res) => {
    const { message, chatHistoryId } = req.body;
    const userId = req.user?.id;
    try {
      const response = await aiService.aiChatting(
        userId,
        message,
        chatHistoryId
      );
      res.status(200).json({ success: true, message: response });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message || "Failed to generate message",
      });
    }
  },

  aiInsertFile: async (req, res) => {
    const { userId, description, chatHistoryId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "File is required, please provide valid file and try again",
      });
    }

    try {
      const response = await aiService.aiInsertFile(
        userId,
        file.originalname,
        file.mimetype,
        file.size,
        file.buffer,
        description,
        chatHistoryId
      );
      res.status(201).json({
        success: true,
        message: response,
      });
    } catch (err) {
      res.status(err.statusCode || 400).json({
        success: false,
        message: err.message,
      });
    }
  },

  getHistory: async (req, res) => {
    const userId = req.user?.id;
    try {
      const response = await aiService.getChatByUserId(userId);
      res.status(200).json({ success: true, data: response });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message || "Failed to get history message",
      });
    }
  },
  getHistoryId: async (req, res) => {
    const chatHistoryId = req.params.chathistoryid;

    try {
      const response = await aiService.getChatByHistoryId(chatHistoryId);
      res.status(200).json({ success: true, data: response });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message || "Failed to get history message",
      });
    }
  },
};

module.exports = aiController;

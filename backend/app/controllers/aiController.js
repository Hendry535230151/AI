const aiService = require("../services/aiService");

const aiController = {
  aiChatting: async (req, res) => {
    const { message, chatHistoryId } = req.body;
    const userId = req.user?.id;
    try {
      const response = await aiService.aiChatting(userId, message, chatHistoryId);
      res.status(200).json({ success: true, message: response });
    } catch (err) {
      res.status(400).json({
        success: false,
        message: err.message || "Failed to generate message",
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

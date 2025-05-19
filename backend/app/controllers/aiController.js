const aiService = require("../services/aiService");

const aiController = {
    aiChatting: async (req, res) => {
        const { userId, message } = req.body;
        try {
            const response = await aiService.aiChatting(userId, message);
            res.status(200).json({ success: true, message: response });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message || 'Failed to generate message' });
        }
    },

    getHistory: async (req, res) => {
        try {
            const response = await aiService.getChats();
            res.status(200).json({ success: true, data: response });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message || "Failed to get history message" });
      }
    },
  };

module.exports = aiController;

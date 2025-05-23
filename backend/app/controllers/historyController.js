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
        const { User_Id } = req.params;
        try {
            const history = await historyService.getHistoryByUserId(User_Id);
            res.status(200).json({ success: true, data: history });
        } catch (err) {
            res.status(err.statusCode || 400).json({ success: false, message: err.message });
        }
    },

    createHistory: async (req, res) => {
        const { User_Id, title } = req.body;
        try {
            const newHistory = await historyService.createHistory(User_Id, title);
            res.status(201).json({ success: true, message: 'History created successfully', data: newHistory });
        } catch (err) {
            res.status(err.statusCode || 400).json({ success: false, message: err.message || 'Failed to create history' });
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
};

module.exports = historyController;



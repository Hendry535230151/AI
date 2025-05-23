const historyModel = require('../models/History');
const customError = require('../errors/CustomError');

const historyService = {
    getHistories: async () => {
        try {
            const fetchAll = await historyModel.getHistories();
            if (!fetchAll || fetchAll.length === 0) {
                throw new customError('No Histories found. Please ensure the database is correctly populated and try again.', 404);
            }

            return fetchAll;
        } catch (err) {
            throw err;
        }
    },

    getHistoryById: async (id) => {
        try {
            if (!id) {
                throw new customError('History ID is required. Please provide a valid ID and try again.', 400);
            }
            
            const findHistory = await historyModel.getHistoryById(id);
            if (!findHistory) {
                throw new customError(`No History found with ID: ${id}. Please verify the ID and try again.`, 404);
            }

            return findHistory;
        } catch (err) {
            throw err;
        }
    },

    
    getHistoryByUserId: async (userId) => {
        try {
            if (!userId) {
                throw new customError('History ID is required. Please provide a valid ID and try again.', 400);
            }
            
            const findHistory = await historyModel.getHistoryByUserId(userId);
            if (!findHistory) {
                throw new customError(`No History found with ID: ${userId}. Please verify the ID and try again.`, 404);
            }

            return findHistory;
        } catch (err) {
            throw err;
        }
    },
    createHistory: async (userId, title) => {
        if (!userId || !title) {
          throw new customError('User ID and title are required.', 400);
        }
        const created = await historyModel.createHistory(userId, title);
        if (!created) {
          throw new customError('Failed to create history.', 500);
        }
        return created; 
      },
      

    deleteHistoryById: async (id) => {
        try {
            if (!id) {
                throw new customError('User ID is required. Please provide a valid ID and try again', 400);
            }

            const deletedHistory = await historyModel.deleteHistoryById(id);
            if (!deletedHistory) {
                throw new customError(`Failed to delete history with ID: ${id}. Please verify the ID and try again.`, 400);
            }
            return deletedHistory;
        } catch (err) {
            throw err;
        }
    },
};

module.exports = historyService;
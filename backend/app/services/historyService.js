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

    
    getHistoryByUserId: async (User_Id) => {
        try {
            if (!User_Id) {
                throw new customError('History ID is required. Please provide a valid ID and try again.', 400);
            }
            
            const findHistory = await historyModel.getHistoryByUserId(User_Id);
            if (!findHistory) {
                throw new customError(`No History found with ID: ${User_Id}. Please verify the ID and try again.`, 404);
            }

            return findHistory;
        } catch (err) {
            throw err;
        }
    },
    createHistory: async (User_Id, title) => {
        try {
            if (!User_Id || !title) {
                throw new customError('History ID and title are required.', 400);
            }
            const created = await historyModel.createHistory(User_Id, title);
            if (!created) {
                throw new customError('Failed to create history.', 500);
            }
            return { User_Id, title };
        } catch (err) {
            throw err;
        }
    },

    deleteHistoryById: async (id) => {
        try {
            if (!id) {
                throw new customError('User ID is required. Please provide a valid ID and try again', 400);
            }

            const findHistory = await historyModel.deleteHistoryById(id);
            if (!findHistory) {
                throw new customError(`User with ID: ${id} not found. Please verify the ID and try again.`, 400);
            } 
            const deleteHistory = await historyModelistoryModel.deleteById(id);
            if (!deleteHistory) {
                throw new customError(`Failed to delete user with ID: ${id}. The user may not exist. Please verify the ID and try again.`, 400);
            }

            return deleteHistory;
        } catch (err) {
            throw err;
        }
    },
};

module.exports = historyService;
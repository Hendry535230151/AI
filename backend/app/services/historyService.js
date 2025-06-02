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
        try {
            if (!userId) {
              throw new customError(
                "User ID and Directory name are required. Please provide valid data and try again.",
                400
              );
            } else if (!title) {
              throw new customError("Error");
            }
      
            const checkDuplicate = await historyModel.checkDuplicateTitle(
              userId,
              title
            );
            if (checkDuplicate) {
              throw new customError("Error");
            }
            const createTitle = await historyModel.createHistory(
              userId,
              title,
            );
            if (!createTitle) {
              throw new customError(
                "Failed to create Title. Please check the input and try again.",
                500
              );
            }
            return createTitle;
          } catch (err) {
            throw err;
          }
        },

    updateHistoryById: async (id, userId, title) => {
        try {
          if (!id) {
            throw new customError(
              "Title ID and new name are required. Please provide valid data and try again.",
              400
            );
          } else if (!userId) {
            throw new customError("User Id not found");
          } else if (!title) {
            throw new customError("Title Dont have");
          }

          const updateName = await historyModel.updateHistoryById(
            id,
            userId,
            title
          );
          if (!updateName) {
            throw new customError(
              `Failed to update title with ID: ${id}. Please verify the ID and try again.`,
              404
            );
          }
          return updateName;
        } catch (err) {
          throw err;
        }
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
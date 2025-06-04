const historyModel = require('../models/History');
const CustomError = require('../errors/CustomError');

const historyService = {
  getHistories: async () => {
    try {
      const fetchAll = await historyModel.getHistories();
      if (!fetchAll || fetchAll.length === 0) {
          throw new CustomError('No Histories found. Please ensure the database is correctly populated and try again.', 404);
      }

      return fetchAll;
    } catch (err) {
      throw err;
    }
  },

  getHistoryById: async (id) => {
    try {
      if (!id) {
        throw new CustomError('History ID is required. Please provide a valid ID and try again.', 400);
      }
      
      const findHistory = await historyModel.getHistoryById(id);
      if (!findHistory) {
        throw new CustomError(`No History found with ID: ${id}. Please verify the ID and try again.`, 404);
      }

      return findHistory;
    } catch (err) {
      throw err;
    }
  },

  getHistoryByUserId: async (userId) => {
    try {
      if (!userId) {
        throw new CustomError('History ID is required. Please provide a valid ID and try again.', 400);
      }
      
      const findHistory = await historyModel.getHistoryByUserId(userId);
      if (!findHistory) {
        throw new CustomError(`No History found with ID: ${userId}. Please verify the ID and try again.`, 404);
      }

      return findHistory;
    } catch (err) {
      throw err;
    }
  },

  createHistory: async (userId, title) => {
    try {
      if (!userId) {
        throw new CustomError(
          "User ID and Directory name are required. Please provide valid data and try again.",
          400
        );
      } else if (!title) {
        throw new CustomError("Error");
      }
  
      const checkDuplicate = await historyModel.checkDuplicateTitle(
        userId,
        title
      );
      if (checkDuplicate) {
        throw new CustomError("Error");
      }
      const createTitle = await historyModel.createHistory(
        userId,
        title,
      );
      if (!createTitle) {
        throw new CustomError(
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
        throw new CustomError(
          "Title ID and new name are required. Please provide valid data and try again.",
          400
        );
      } else if (!userId) {
        throw new CustomError("User Id not found");
      } else if (!title) {
        throw new CustomError("Title Dont have");
      }

      const updateName = await historyModel.updateHistoryById(
        id,
        userId,
        title
      );
      if (!updateName) {
        throw new CustomError(
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
        throw new CustomError('User ID is required. Please provide a valid ID and try again', 400);
      }

      const deletedHistory = await historyModel.deleteHistoryById(id);
      if (!deletedHistory) {
        throw new CustomError(`Failed to delete history with ID: ${id}. Please verify the ID and try again.`, 400);
      }
      return deletedHistory;
    } catch (err) {
      throw err;
    }
  },

  clearUserHistory: async (userId) => {
    try {
      if (!userId) {
        throw new CustomError(
          "User ID is required. Please provide a valid ID and try again.",
          400
        )
      }

      const deleteUserHistory = await historyModel.deleteHistoryByUserId(userId);
      if (!deleteUserHistory) {
        throw new CustomError(
          `Failed to delete all history with user ID: ${userId}. Please try again.`,
          400
        )
      }
      
      return deleteUserHistory;
    } catch (err) {
      throw err;
    }
  }
};

module.exports = historyService;
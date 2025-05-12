const directoryModel = require('../models/Directory');
const customError = require('../errors/CustomError');

const directoryService = {
    getDirectories: async () => {
        try {
            const fetchAll = await directoryModel.getDirectories();
            if (!fetchAll || fetchAll.length === 0) {
                throw new customError('No directories found. Please ensure the database is correctly populated and try again.', 404);
            }

            return fetchAll;
        } catch (err) {
            throw err;
        }
    },

    getDirectoryById: async (id) => {
        try {
            if (!id) {
                throw new customError('Directory ID is required. Please provide a valid ID and try again.', 400);
            }

            const findDirectory = await directoryModel.getDirectoryById(id);
            if (!findDirectory) {
                throw new customError(`No directory found with ID: ${id}. Please verify the ID and try again.`, 404);
            }

            return findDirectory;
        } catch (err) {
            throw err;
        }
    },

    getDirectoryByName: async (directoryName) => {
        try {
            if (!directoryName) {
                throw new customError('Directory name is required. Please provide a valid name and try again.', 400);
            }

            const findDirectory = await directoryModel.getDirectoryByName(directoryName);
            if (!findDirectory) {
                throw new customError(`No directory found with the name: ${directoryName}. Please ensure the name is correctly spelled and try again.`, 404);
            }

            return findDirectory;
        } catch (err) {
            throw err;
        }
    },

    createDirectory: async (userId, directoryName, parentDirectory) => {
        try {
            if (!userId || !directoryName) {
                throw new customError('User ID and Directory name are required. Please provide valid data and try again.', 400);
            }

            const createDirectory = await directoryModel.createDirectory(userId, directoryName, parentDirectory || null);
            if (!createDirectory) {
                throw new customError('Failed to create directory. Please check the input and try again.', 500);
            }

            return createDirectory;
        } catch (err) {
            throw err;
        }
    },

    updateDirectoryName: async (id, directoryName) => {
        try {
            if (!id || !directoryName) {
                throw new customError('Directory ID and new name are required. Please provide valid data and try again.', 400);
            }

            const updateName = await directoryModel.updateDirectoryName(id, directoryName);
            if (!updateName) {
                throw new customError(`Failed to update directory with ID: ${id}. Please verify the ID and try again.`, 404);
            }

            return updateName;
        } catch (err) {
            throw err;
        }
    },

    deleteDirectory: async (id) => {
        try {
            if (!id) {
                throw new customError('Directory ID is required. Please provide a valid ID and try again.', 400);
            }

            const findDirectory = await directoryModel.getDirectoryById(id);
            if (!findDirectory) {
                throw new customError(`Directory with ID: ${id} not found. Please verify the ID and try again.`, 404);
            }

            const deleteDirectory = await directoryModel.deleteDirectory(id);
            if (!deleteDirectory) {
                throw new customError(`Failed to delete directory with ID: ${id}. Please try again.`, 400);
            }

            return deleteDirectory;
        } catch (err) {
            throw err;
        }
    },
};

module.exports = directoryService;

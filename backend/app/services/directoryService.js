const directoryModel = require('../models/Directory');
const CustomError = require('../errors/CustomError');

const directoryService = {
    getDirectories: async () => {
        try {
            const fetchAll = await directoryModel.getDirectories();
            if (!fetchAll || fetchAll.length === 0) {
                throw new CustomError('No directories found. Please ensure the database is correctly populated and try again.', 404);
            }
            return fetchAll;
        } catch (err) {
            throw err;
        }
    },

    getDirectoryById: async (id) => {
        try {
            if (!id) {
                throw new CustomError('Directory ID is required. Please provide a valid ID and try again.', 400);
            }

            const findDirectory = await directoryModel.getDirectoryById(id);
            if (!findDirectory) {
                throw new CustomError(`No directory found with ID: ${id}. Please verify the ID and try again.`, 404);
            }
            return findDirectory;
        } catch (err) {
            throw err;
        }
    },

    getDirectoryByName: async (directoryName) => {
        try {
            if (!directoryName) {
                throw new CustomError('Directory name is required. Please provide a valid name and try again.', 400);
            }

            const findDirectory = await directoryModel.getDirectoryByName(directoryName);
            if (!findDirectory) {
                throw new CustomError(`No directory found with the name: ${directoryName}. Please ensure the name is correctly spelled and try again.`, 404);
            }
            return findDirectory;
        } catch (err) {
            throw err;
        }
    },

    createDirectory: async (userId, directoryName, parentDirectory) => {
        try {
            if (!userId) {
                throw new CustomError('User ID and Directory name are required. Please provide valid data and try again.', 400);
            } else if (!directoryName) {
                throw new CustomError('Error');
            }

            const checkDuplicate = await directoryModel.checkDuplicateDirectory(userId, directoryName);
            if (checkDuplicate) {
                throw new CustomError('Error');
            }
            const createDirectory = await directoryModel.createDirectory(userId, directoryName, parentDirectory || null);
            if (!createDirectory) {
                throw new CustomError('Failed to create directory. Please check the input and try again.', 500);
            }
            return createDirectory;
        } catch (err) {
            throw err;
        }
    },

    updateDirectoryName: async (id, userId, directoryName) => {
        try {
            if (!id) {
                throw new CustomError('Directory ID and new name are required. Please provide valid data and try again.', 400);
            } else if (!userId) {
                throw new CustomError('Error');
            } else if (!directoryName) {
                throw new CustomError('Error');
            }

            const checkDuplicate = await directoryModel.checkDuplicateDirectory(userId, directoryName);
            if (checkDuplicate) {
                throw new CustomError('Error');
            }
            const updateName = await directoryModel.updateDirectoryName(id, userId, directoryName);
            if (!updateName) {
                throw new CustomError(`Failed to update directory with ID: ${id}. Please verify the ID and try again.`, 404);
            }
            return updateName;
        } catch (err) {
            throw err;
        }
    },

    deleteDirectory: async (id) => {
        try {
            if (!id) {
                throw new CustomError('Directory ID is required. Please provide a valid ID and try again.', 400);
            }

            const findDirectory = await directoryModel.getDirectoryById(id);
            if (!findDirectory) {
                throw new CustomError(`Directory with ID: ${id} not found. Please verify the ID and try again.`, 404);
            }
            const deleteDirectory = await directoryModel.deleteDirectory(id);
            if (!deleteDirectory) {
                throw new CustomError(`Failed to delete directory with ID: ${id}. Please try again.`, 400);
            }
            return deleteDirectory;
        } catch (err) {
            throw err;
        }
    },
};

module.exports = directoryService;

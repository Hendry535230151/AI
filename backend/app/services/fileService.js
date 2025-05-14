const CustomError = require('../errors/CustomError');
const fileModel = require('../models/Files');

const fileService = {
    getFiles: async () => {
        try {
            const fetchFiles = await fileModel.getFiles();
            if (!fetchFiles || fetchFiles.length === 0) {
                throw new CustomError('No files found. Please upload files to the database and try again.', 404);
            }
            return fetchFiles;
        } catch (err) {
            throw err;
        }
    },

    getFileByName: async (fileName) => {
        try {
            if (!fileName) {
                throw new CustomError('File name is required. Please provide a valid file name and try again.', 400);
            }

            const searchFile = await fileModel.getFileByName(fileName);
            if (!searchFile) {
                throw new CustomError(`No file found with the name: ${fileName}. Please ensure the name is correctly spelled and try again.`, 404);
            }
            return searchFile;
        } catch (err) {
            throw err;
        }
    },

    getFileById: async (id) => {
        try {
            if (!id) {
                throw new CustomError('File ID is required. Please provide a valid ID and try again.', 400);
            }

            const searchFile = await fileModel.getFileById(id);
            if (!searchFile) {
                throw new CustomError(`No file found with ID: ${id}. The file may not exist. Please verify the ID and try again.`, 404);
            }
            return searchFile;
        } catch (err) {
            throw err;
        }
    },

    createFile: async (userId, directoryId, fileName, fileType, fileSize) => {
        try {
            if (!userId) {
                throw new CustomError('User ID is required. Please provide a valid user ID and try again.', 400);
            }
            if (!directoryId) {
                throw new CustomError('Directory ID is required. Please provide a valid directory ID and try again.', 400);
            }
            if (!fileName) {
                throw new CustomError('File name is required. Please provide a valid file name and try again.', 400);
            }
            if (!fileType) {
                throw new CustomError('File type is required. Please provide a valid file type and try again.', 400);
            }
            if (!fileSize) {
                throw new CustomError('File size is required. Please provide a valid file size and try again.', 400);
            }

            const checkDuplicate = await fileModel.checkDuplicateFile(fileName);
            if (checkDuplicate) {
                throw new CustomError(`The file with name: ${fileName} is already in use. Please choose a different name.`, 409);
            }

            const createFile = await fileModel.insertFile(userId, directoryId, fileName, fileType, fileSize);
            if (!createFile) {
                throw new CustomError('Failed to create the file. Please try again later.', 500);
            }
            return createFile;
        } catch (err) {
            throw err;
        }
    },

    renameFile: async (id, fileName) => {
        try {
            if (!id) {
                throw new CustomError('File ID is required. Please provide a valid ID and try again.', 400);
            }
            if (!fileName) {
                throw new CustomError('New file name is required. Please provide a valid name and try again.', 400);
            }

            const checkDuplicate = await fileModel.checkDuplicateFile(fileName);
            if (checkDuplicate) {
                throw new CustomError(`The file name "${fileName}" is already in use. Please choose a different name.`, 409);
            }

            const renameFile = await fileModel.updateFileName(id, fileName);
            if (!renameFile) {
                throw new CustomError(`Failed to rename the file with ID: ${id}. The file may not exist or the name is unchanged.`, 404);
            }
            return renameFile;
        } catch (err) {
            throw err;
        }
    },

    deleteFileById: async (id) => {
        try {
            if (!id) {
                throw new CustomError('File ID is required. Please provide a valid ID and try again.', 400);
            }

            const deleteFile = await fileModel.deleteFileById(id);
            if (!deleteFile) {
                throw new CustomError(`Failed to delete the file with ID: ${id}. The file may not exist.`, 404);
            }
            return deleteFile;
        } catch (err) {
            throw err;
        }
    },
};

module.exports = fileService;

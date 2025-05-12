const directoryService = require('../services/directoryService');

const directoryController = {
    getAllDirectories: async (req, res) => {
        try {
            const directories = await directoryService.getDirectories();
            res.status(200).json({ success: true, data: directories });
        } catch (err) {
            res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Failed to fetch directories' });
        }
    },

    getDirectoryById: async (req, res) => {
        const { id } = req.params;

        try {
            const directory = await directoryService.getDirectoryById(id);
            res.status(200).json({ success: true, data: directory });
        } catch (err) {
            res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Failed to fetch directory by ID' });
        }
    },

    getDirectoryByName: async (req, res) => {
        const { directoriesName } = req.query;

        try {
            const directory = await directoryService.getDirectoryByName(directoriesName);
            res.status(200).json({ success: true, data: directory });
        } catch (err) {
            res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Failed to fetch directory by name' });
        }
    },

    createDirectory: async (req, res) => {
        const { userId, directoryName, parentDirectory } = req.body;

        try {
            const newDirectory = await directoryService.createDirectory(userId, directoryName, parentDirectory);
            res.status(201).json({ success: true, message: 'Directory created successfully', data: newDirectory });
        } catch (err) {
            res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Failed to create directory' });
        }
    },

    updateDirectoryName: async (req, res) => {
        const { id } = req.params;
        const { directoriesName } = req.body;

        try {
            const updated = await directoryService.updateDirectoryName(id, directoriesName);
            res.status(200).json({ success: true, message: 'Directory updated successfully', data: updated });
        } catch (err) {
            res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Failed to update directory' });
        }
    },

    deleteDirectory: async (req, res) => {
        const { id } = req.params;

        try {
            await directoryService.deleteDirectory(id);
            res.status(200).json({ success: true, message: 'Directory deleted successfully' });
        } catch (err) {
            res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Failed to delete directory' });
        }
    },
};

module.exports = directoryController;

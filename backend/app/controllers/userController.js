const userService = require('../services/userService');

const userController = {
    getAllUsers: async (req, res) => {
        try {
            const users = await userService.getUsers();
            return res.status(200).json({ success: true, data: users });
        } catch (err) {
            return res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Internal server error' });
        }
    },

    getUserById: async (req, res) => {
        try {
            const { id } = req.params;
            const user = await userService.getUserById(id);
            return res.status(200).json({ success: true, data: user });
        } catch (err) {
            return res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Internal server error' });
        }
    },

    getUserByEmail: async (req, res) => {
        try {
            const { email } = req.query;
            const user = await userService.getUserByEmail(email);
            return res.status(200).json({ success: true, data: user });
        } catch (err) {
            return res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Internal server error' });
        }
    },

    getUserByName: async (req, res) => {
        try {
            const { name } = req.query;
            const user = await userService.getUserByName(name);
            return res.status(200).json({ success: true, data: user });
        } catch (err) {
            return res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Internal server error' });
        }
    },

    deleteUserById: async (req, res) => {
        try {
            const { id } = req.params;
            const result = await userService.deleteById(id);
            return res.status(200).json({ success: true, message: 'User deleted successfully.', data: result });
        } catch (err) {
            return res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Internal server error' });
        }
    },
};

module.exports = userController;

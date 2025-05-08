const authService = require('../services/authService');

const authController = {
    login: async (req, res) => {
        const { email, password } = req.body;

        try {
            const token = await authService.userLogin(email, password);
            res.status(200).json({ success: true, token });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message || 'Login failed' });
        }
    },

    register: async (req, res) => {
        const { firstName, lastName, email, password, passwordConfirm } = req.body;
        try {
            const user = await authService.userLogup(firstName, lastName, email, password, passwordConfirm);
            res.status(201).json({ success: true, message: 'User registered successfully' });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message || 'Registration failed' });
        }
    },

    requestPasswordReset: async (req, res) => {
        const { email } = req.body;

        try {
            const result = await authService.requestPasswordReset(email);
            res.status(200).json({ success: true, message: result.message });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message || 'Failed to send reset email' });
        }
    },

    updatePassword: async (req, res) => {
        const { token } = req.query
        const { password, passwordConfirm } = req.body;

        try {
            const result = await authService.updatePassword(token, password, passwordConfirm);
            res.status(200).json({ success: true, message: result.message });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message || 'Password reset failed' });
        }
    },
};

module.exports = authController;

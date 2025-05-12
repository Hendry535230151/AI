const categoryService = require('../services/categoryService');

const categoryController = {
    getAllCategories: async (req, res) => {
        try {
            const categories = await categoryService.getCategories();
            return res.status(200).json({ success: true, data: categories });
        } catch (err) {
            return res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Internal server error' });
        }
    },

    getCategoryById: async (req, res) => {
        try {
            const { id } = req.params;
            const category = await categoryService.getCategoryById(id);
            return res.status(200).json({ success: true, data: category });
        } catch (err) {
            return res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Internal server error' });
        }
    },

    getCategoryByName: async (req, res) => {
        try {
            const { categoryName } = req.query;
            const category = await categoryService.getCategoryByName(categoryName);
            return res.status(200).json({ success: true, data: category });
        } catch (err) {
            return res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Internal server error' });
        }
    },

    createCategory: async (req, res) => {
        try {
            const { categoryName } = req.body;
            const category = await categoryService.createCategory(categoryName);
            return res.status(201).json({ success: true, data: category });
        } catch (err) {
            return res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Internal server error' });
        }
    },

    updateCategory: async (req, res) => {
        try {
            const { id } = req.params;
            const { categoryName } = req.body;
            const category = await categoryService.updateCategoryName(id, categoryName);
            return res.status(200).json({ success: true, data: category });
        } catch (err) {
            return res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Internal server error' });
        }
    },

    deleteCategory: async (req, res) => {
        try {
            const { id } = req.params;
            const category = await categoryService.deleteCategory(id);
            return res.status(200).json({ success: true, message: 'Category deleted successfully.' });
        } catch (err) {
            return res.status(err.statusCode || 500).json({ success: false, message: err.message || 'Internal server error' });
        }
    },
};

module.exports = categoryController;

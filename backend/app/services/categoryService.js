const CustomError = require('../errors/CustomError');
const categoryModel = require('../models/Categories');

const categoryService = {
    getCategories: async () => {
        try {
            const fetchAll = await categoryModel.getCategories();
            if (!fetchAll || fetchAll.length === 0) {
                throw new CustomError('Error')
            }
            return fetchAll;
        } catch (err) {
            throw err;
        }
    },

    getCategoryById: async (id) => {  
        try {
            if (!id) {
                throw new CustomError('Error');
            }

            const findCategory = await categoryModel.getCategoryById(id);
            if (!findCategory) {
                throw new CustomError('Error');
            }   
            return findCategory;
        } catch(err) {
            throw err;
        }
    },

    getCategoryByName: async (categoryName) => {
        try {
            if (!categoryName) {
                throw new CustomError('Error');
            }

            const findCategory = await categoryModel.getCategoryByName(categoryName);
            console.log(findCategory)
            if (!findCategory) {
                throw new CustomError('Error');
            }
            return findCategory;
        } catch (err) {
            throw err;
        }
    },

    createCategory: async (categoryName) => {
        try {
            if (!categoryName) {
                throw new CustomError('Error');
            }

            const createCategory = await categoryModel.createCategory(categoryName);
            if (!createCategory) {
                throw new CustomError('Error');
            }
            return createCategory;
        } catch (err) {
            throw err;
        }
    },

    updateCategoryName: async (id, categoryName) => {
        try {
            if (!id) {
                throw new CustomError('Error');
            } else if (!categoryName) {
                throw new CustomError('Error');
            }

            const changeName = await categoryModel.updateCategoryName(id, categoryName)
            if (!changeName) {
                throw new CustomError('Error');
            }
            return changeName;
        } catch (err) {
            throw err;
        }
    },

    deleteCategory: async (id) => {
        try {
            if (!id) {
                throw new CustomError('Error');
            }

            const deleteCategory = await categoryModel.deleteCategory(id);
            if (!deleteCategory) {
                throw new CustomError('Error');
            }
            return deleteCategory;
        } catch (err) {
            throw err;
        }
    },
};

module.exports = categoryService;
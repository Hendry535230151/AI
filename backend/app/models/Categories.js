const db = require('../config/db');

const categoryModel = {
    getCategories: () => {
        return new Pormise((resolve, reject) => {
            const query = 'SELECT * FROM categories';
            db.query(query, (err, result) => {
                if (err) {
                    return reject(err);
                }
                if (!result || result.length === 0) {
                    resolve(false);
                } else {
                    resolve(result);
                }
            });
        });
    },

    getCategoryById: (id) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM categories WHERE id = ?';
            db.query(query, [id], (err, result) => {
                if (err) {
                    return reject(err);
                }
                if (!result || result.length) {
                    resolve(false);
                } else {
                    resolve(result);
                }
            });
        });
    },

    getCategoryByName: (categoryName) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM categories WHERE id LIKE ?';
            db.query(query, [categoryName], (err, result) => {
                if (err) {
                    return reject(err);
                }
                if (!result || result.length === 0) {
                    resolve(false);
                } else {
                    resolve(result);
                }
            });
        });
    },

    createCategory: (categoryName) => {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO categories (category_name) VALUES (?)';
            db.query(query, [categoryName], (err, result) => {
                if (err) {
                    reject(err);
                }
                if (!result || result.affectedRows === 0) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    },

    updateCategoryName: (id, categoryName) => {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE categories SET category_name = ? WHERE id = ?';
            db.query(query, [categoryName, id], (err, result) => {
                if (err) {
                    reject(err);
                } 
                if (!result || result.affectedRows === 0) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    },

    deleteCategory: (id) => {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM categories WHERE id = ?';
            db.query(query, [id], (err, result) => {
                if (err) {
                    reject(err);
                } 
                if (!result || result.affectedRows === 0) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    },
};

module.exports = categoryModel;
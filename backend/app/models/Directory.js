const db = require('../config/db');

const directoryModel = {
    getDirectories: () => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM directories';
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

    getDirectoryById: (id) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM directories WHERE id = ?';
            db.query(query, [id], (err, result) => {
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

    getDirectoryByName: (directoryName) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM directories WHERE directory_name LIKE ?';
            db.query(query, [`%${directoryName}%`], (err, result) => {
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

    createDirectory: (userId, directoryName, parentDirectory) => {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO directories (user_id, directory_name, parent_directory) VALUES (?, ?, ?)';
            db.query(query, [userId, directoryName, parentDirectory], (err, result) => {
                if (err) {
                    return reject(err);
                }
                if (!result || result.affectedRows === 0) {
                    resolve(false);
                } else {
                    resolve(result);
                }
            });
        });
    },

    updateDirectoryName: (id, directoryName) => {
        return new Promise((resolve, reject) => {
            const query = 'UPDATE directories SET directory_name = ? WHERE id = ?';
            db.query(query, [directoryName, id], (err, result) => {
                if (err) {
                    return reject(err);
                }
                if (!result || result.affectedRows === 0) {
                    resolve(false);
                } else {
                    resolve(result);
                }
            });
        });
    },

    deleteDirectory: (id) => {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM directories WHERE id = ?';
            db.query(query, [id], (err, result) => {
                if (err) {
                    return reject(err);
                }
                if (!result || result.affectedRows === 0) {
                    resolve(false);
                } else {
                    resolve(result);
                }
            });
        });
    },
};

module.exports = directoryModel;
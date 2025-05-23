const db = require('../config/db');

const historyModel = {
    getHistories: () => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM chat_histories';
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

    getHistoryById: (Id) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM chat_histories WHERE Id = ?';
            db.query(query, [Id], (err, result) => {
                if (err) {
                    return reject(err);
                }
                if (!result || result.length === 0) {
                    resolve(false);
                } else {
                    resolve(result[0]);
                }
            });
        });
    },

    getHistoryByUserId: (User_Id) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM chat_histories WHERE User_Id = ?';
            db.query(query, [User_Id], (err, result) => {
                if (err) {
                    return reject(err);
                }
                if (!result || result.length === 0) {
                    resolve(false);
                } else {
                    resolve(result[0]);
                }
            });
        });
    },


    createHistory: (User_Id, title) => {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO chat_histories (User_Id, title) VALUES (?, ?)';
            db.query(query, [User_Id, title], (err, result) => {
                if (err) {
                    return reject(err);
                } 
                if (!result || result.affectedRows === 0) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    },




    deleteHistoryById: (id) => {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM chat_histories WHERE id = ?';
            db.query(query, [id], (err, result) => {
                if (err) {
                    return reject(err);
                }
                if (!result || result.affectedRows === 0) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    },
}

module.exports = historyModel;
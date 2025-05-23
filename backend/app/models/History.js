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

    getHistoryByUserId: (userId) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM chat_histories WHERE user_id = ?';
            db.query(query, [userId], (err, result) => {
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


    createHistory: (userId, title) => {
        return new Promise((resolve, reject) => {
          const query = 'INSERT INTO chat_histories (user_id, title) VALUES (?, ?)';
          db.query(query, [userId, title], (err, result) => {
            if (err) {
              return reject(err);
            }
            if (!result || result.affectedRows === 0) {
              resolve(false);
            } else {
              resolve({ id: result.insertId, userId, title });
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
const db = require('../config/db');

const chatModel = {
    getChats: () => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM chats';
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

    getChatById: (id) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM chats WHERE id = ?';
            db.query(query, [id], (err, result) => {
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

    insertChat: (userId, sender, text) => {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO chats (user_id, sender, text) VALUES (?, ?, ?)';
            db.query(query, [userId, sender, text], (err, result) => {
                if (err) {
                    return reject(err);
                }
                if (!result || result.length === 0) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    },
};

module.exports = chatModel;
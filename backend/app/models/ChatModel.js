const db = require("../config/db");

const chatModel = {
  getChats: () => {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM chats";
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
      const query = "SELECT * FROM chats WHERE id = ?";
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

  getChatByUserId: (id) => {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM chats WHERE user_id = ?";
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

  insertChat: (chatHistoryId, userId, sender, text) => {
    return new Promise((resolve, reject) => {
      const query =
      "INSERT INTO chats (chat_history_id, user_id, sender, text) VALUES (?, ?, ?, ?)";
      db.query(query, [chatHistoryId, userId, sender, text], (err, result) => {
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
  
  getChatByHistoryId: (chatHistoryId) => {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM chats WHERE chat_history_id = ?";
      db.query(query, [chatHistoryId], (err, result) => {
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
};

module.exports = chatModel;

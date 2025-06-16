const db = require("../config/db");

const historyModel = {
  getHistories: () => {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM chat_histories";
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
      const query = "SELECT * FROM chat_histories WHERE id = ?";
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

  getHistoryByTitle: (searchQuery, userId) => {
    return new Promise((resolve, reject) => {
      const query =
        "SELECT * FROM chat_histories WHERE title LIKE ? AND user_id = ?";
      db.query(query, [`%${searchQuery}%`, userId], (err, result) => {
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

  getHistoryByUserId: (userId) => {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM chat_histories WHERE user_id = ?";
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

  checkDuplicateTitle: (userId, title) => {
    return new Promise((resolve, reject) => {
      const query =
        "SELECT * FROM chat_histories WHERE title = ? AND user_id = ?";
      db.query(query, [title, userId], (err, result) => {
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
      const query = "INSERT INTO chat_histories (user_id, title) VALUES (?, ?)";
      db.query(query, [userId, title], (err, result) => {
        if (err) {
          return reject(err);
        }
        if (!result || result.affectedRows === 0) {
          resolve(false);
        } else {
          resolve(result.insertId);
        }
      });
    });
  },

  updateHistoryById: (id, userId, title) => {
    return new Promise((resolve, reject) => {
      const query =
        "UPDATE chat_histories SET title = ? WHERE id = ? AND user_id = ?";
      db.query(query, [title, id, userId], (err, result) => {
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

  deleteHistoryById: (id) => {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM chat_histories WHERE id = ?";
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

  deleteHistoryByUserId: (userId) => {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM chat_histories WHERE user_id = ?";
      db.query(query, [userId], (err, result) => {
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
};

module.exports = historyModel;

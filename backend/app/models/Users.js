const db = require("../config/db");

const userModel = {
  getUsers: () => {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM users";
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

  getUserById: (id) => {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM users WHERE id = ?";
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

  getUserByEmail: (email) => {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM users WHERE email = ?";
      db.query(query, [email], (err, result) => {
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

  getUserByName: (name) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM users WHERE CONCAT(first_name, ' ', last_name) LIKE ?`;
      db.query(query, [`%${name}%`], (err, result) => {
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

  createUser: (firstName, lastName, email, password) => {
    return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)";
      db.query(query, [firstName, lastName, email, password], (err, result) => {
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

  updatePassword: (email, password) => {
    return new Promise((resolve, reject) => {
      const query = "UPDATE users SET password = ? WHERE email = ?";
      db.query(query, [password, email], (err, result) => {
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

  setTheme: (id, theme) => {
    return new Promise((resolve, reject) => {
      const query = "UPDATE users SET theme = ? WHERE id = ?";
      db.query(query, [theme, id], (err, result) => {
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

  deleteById: (id) => {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM users WHERE id = ?";
      db.query(query, [id], (err, result) => {
        if (err) {
          return reject(err);
        }
        if (!result || result.affectedrows === 0) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  },

  updateFirstName: (userId, firstName) => {
    return new Promise((resolve, reject) => {
      const query = "UPDATE users SET first_name = ? WHERE id = ?";
      db.query(query, [firstName, userId], (err, result) => {
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

  updateDescription: (userId, description) => {
    return new Promise((resolve, reject) => {
      const query = "UPDATE users SET descipriton = ? WHERE id = ?";
      db.query(query, [description, userId], (err, result) => {
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

module.exports = userModel;

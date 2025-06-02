const db = require("../config/db");
const { checkDuplicate } = require("./Categories");

const directoryModel = {
  getDirectories: () => {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM directories";
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
      const query = "SELECT * FROM directories WHERE id = ?";
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

  getDirectoriesByUserId: (userId) => {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM directories WHERE user_id = ?";
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

  getDirectoryByName: (directoryName, userId) => {
    return new Promise((resolve, reject) => {
      const query =
        "SELECT * FROM directories WHERE directory_name LIKE ? AND user_id = ?";
      db.query(query, [`%${directoryName}%`, userId], (err, result) => {
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

  checkDuplicateDirectory: (userId, directoryName) => {
    return new Promise((resolve, reject) => {
      const query =
        "SELECT * FROM directories WHERE directory_name = ? AND user_id = ?";
      db.query(query, [directoryName, userId], (err, result) => {
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
      const query =
        "INSERT INTO directories (user_id, directory_name, parent_directory) VALUES (?, ?, ?)";
      db.query(
        query,
        [userId, directoryName, parentDirectory],
        (err, result) => {
          if (err) {
            return reject(err);
          }
          if (!result || result.affectedRows === 0) {
            resolve(false);
          } else {
            resolve(result);
          }
        }
      );
    });
  },

  updateDirectoryName: (id, userId, directoryName) => {
    return new Promise((resolve, reject) => {
      const query =
        "UPDATE directories SET directory_name = ? WHERE id = ? AND user_id = ?";
      db.query(query, [directoryName, id, userId], (err, result) => {
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

  updateDirecotryFileCount: (id, totalFiles) => {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE directories SET total_files = ? WHERE id = ?';
      db.query(query, [totalFiles, id], (err, result) => {
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
      const query = "DELETE FROM directories WHERE id = ?";
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

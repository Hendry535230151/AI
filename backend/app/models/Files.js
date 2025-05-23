const db = require("../config/db");

const fileModel = {
  getFiles: () => {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM files";
      db.query(query, (err, result) => {
        if (err) {
          return reject(err);
        }
        if (!result || !result.length === 0) {
          resolve(false);
        } else {
          resolve(result);
        }
      });
    });
  },

  getFileById: (id) => {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM files WHERE id = ?";
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

  getFileByUserId: (user_id) => {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM files WHERE user_id = ?";
      db.query(query, [user_id], (err, result) => {
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

  getFileByName: (fileName) => {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM files WHERE file_name LIKE ?";
      db.query(query, [`%${fileName}%`], (err, result) => {
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

  getFileByNameUserID: (fileName, userId) => {
    return new Promise((resolve, reject) => {
      const query =
        "SELECT * FROM files WHERE user_id = ? AND file_name LIKE ?";
      db.query(query, [userId, `%${fileName}%`], (err, result) => {
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

  getFileByNameDescriptionUserID: (fileName, userId) => {
    return new Promise((resolve, reject) => {
      const query =
        "SELECT * FROM files WHERE user_id = ? AND file_name LIKE ? OR description LIKE ?";
      db.query(
        query,
        [userId, `%${fileName}%`, `%${fileName}%`],
        (err, result) => {
          if (err) {
            return reject(err);
          }
          if (!result || result.length === 0) {
            resolve(false);
          } else {
            resolve(result);
          }
        }
      );
    });
  },

  checkDuplicateFile: (fileName) => {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM files WHERE file_name = ?";
      db.query(query, [fileName], (err, result) => {
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

  insertFile: (
    userId,
    directoryId,
    fileName,
    fileType,
    fileSize,
    fileBuffer,
    description
  ) => {
    return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO files (user_id, directory_id, file_name, file_type, file_size, file_buffer, description) VALUES (?, ?, ?, ?, ?, ?, ?)";
      db.query(
        query,
        [
          userId,
          directoryId,
          fileName,
          fileType,
          fileSize,
          fileBuffer,
          description,
        ],
        (err, result) => {
          if (err) {
            return reject(err);
          }
          if (!result || result.affectedRows === 0) {
            resolve(false);
          } else {
            resolve(true);
          }
        }
      );
    });
  },

  updateFileName: (id, fileName) => {
    return new Pormise((resolve, reject) => {
      const query = "UPDATE files SET file_name = ? WHERE id = ?";
      db.query(query, [fileName, id], (err, result) => {
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

  deleteFileById: (id) => {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM files WHERE id = ?";
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
};

module.exports = fileModel;

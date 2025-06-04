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

  getFileByUserId: (userId) => {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM files WHERE user_id = ?";
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

  getFilesByDirectoryId: (directoryId) => {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM files WHERE directory_id = ?";
      db.query(query, [directoryId], (err, result) => {
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
        "SELECT * FROM files WHERE user_id = ? AND (file_name LIKE ? OR description LIKE ?) ";
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

  getFilesByUserIdDirectory: (userId) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT file_name, description, directories.id AS directory_id, directories.directory_name
        FROM files LEFT JOIN directories ON files.directory_id = directories.id 
        WHERE directories.user_id = ? AND files.user_id = ?
        ORDER BY directories.id, files.id`;
      db.query(query, [userId, userId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  getFilesByUserIdAndIdDirectory: (userId, id) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT file_name, description, directories.id AS directory_id, directories.directory_name
        FROM files LEFT JOIN directories 
        ON files.directory_id = directories.id 
        WHERE directories.user_id = ? AND directories.id = ? AND files.user_id = ?
        ORDER BY directories.id, files.id`;
      db.query(query, [userId, id, userId], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  getFilesByNameAndIdDirectory: (fileName, userId) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT file_name, description, directories.id AS directory_id, directories.directory_name
        FROM files LEFT JOIN directories 
        ON files.directory_id = directories.id 
        WHERE files.user_id = ? AND (files.file_name LIKE ? OR files.description LIKE ?)
        ORDER BY directories.id, files.id`;
      db.query(
        query,
        [userId, `%${fileName}%`, `%${fileName}%`],
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );
    });
  },

  checkDuplicateFile: (fileName, userId) => {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM files WHERE file_name = ? AND user_id = ?";
      db.query(query, [fileName, userId], (err, result) => {
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

  moveFileToDirectory: (fileId, directoryId) => {
    return new Promise((resolve, reject) => {
      const query = "UPDATE files SET directory_id = ? WHERE id = ?";
      db.query(query, [directoryId, fileId], (err, result) => {
        if (err) return reject(err);
        resolve(result.affectedRows > 0);
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

  deleteFileByUserId: (userId) => {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM files WHERE user_id = ?';
      db.query(query, [userId], (err, result) => {
        if (err) {
          return reject(err);
        }
        if (!result || result.affectedRows === 0) {
          resolve(false);
        } else {
          resolve(true);
        }
      })
    })
  }
};

module.exports = fileModel;

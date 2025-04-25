require('dotenv').config();
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error('Failed to connect database \nMake sure .env already created \n', err.message);
    }
    else {
        console.log('Success connect to database');
    }
});

module.exports = db;
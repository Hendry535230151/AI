require('dotenv').config();
const db = require('./app/config/db');
const express = require('express');
const app = express();

app.use(express.json);

app.listen(process.env.DB_PORT, () => {
    console.log(`Server run at http://localhost:${process.env.DB_PORT}`);
});
require('dotenv').config();
const db = require('./app/config/db');
const userRoute = require('./app/routes/userRoute');
const authRoute = require('./app/routes/authRoute');
const express = require('express');
const app = express();

app.use(express.json());
app.use('/users', userRoute);
app.use('/auth', authRoute);

app.listen(process.env.PORT, () => {
    console.log(`Server run at http://localhost:${process.env.PORT}`);
});
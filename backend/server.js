require('dotenv').config();
const db = require('./app/config/db');
const userRoute = require('./app/routes/userRoute');
const authRoute = require('./app/routes/authRoute');
const aiRoute = require('./app/routes/aiRoute');
const fileRoute = require('./app/routes/fileRoute');
const express = require('express');
const app = express();

app.use(express.json());
app.use('/users', userRoute);
app.use('/auth', authRoute);
app.use('/ai', aiRoute);
app.use('/files', fileRoute);

app.listen(process.env.PORT, () => {
    console.log(`Server run at http://localhost:${process.env.PORT}`);
});
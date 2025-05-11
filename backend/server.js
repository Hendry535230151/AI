require('dotenv').config();
const db = require('./app/config/db');
const userRoute = require('./app/routes/userRoute');
const authRoute = require('./app/routes/authRoute');
const aiRoute = require('./app/routes/aiRoute');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors()); 


const corsOptions = {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true 
  };
  
app.use(cors(corsOptions));
  
app.use('/users', userRoute);
app.use('/auth', authRoute);
app.use('/ai', aiRoute);

app.listen(process.env.PORT, () => {
    console.log(`Server run at http://localhost:${process.env.PORT}`);
});
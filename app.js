const express = require('express');
const cors = require('cors');
const { handleError } = require('./src/utils/errorHandler.js');
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes'); 
const connectDB = require('./src/config/db.js');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use(handleError);

module.exports = app;

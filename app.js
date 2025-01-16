const express = require('express');
const cors = require('cors');
const { handleError } = require('./src/utils/errorHandler.js');
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes'); 
const coffeeRoutes = require('./src/routes/coffeeRoutes');
const coffeeBean = require("./src/routes/beanRoutes");
const connectDB = require('./src/config/db.js');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use("/api/coffee", coffeeRoutes);
app.use("/api/bean", coffeeBean);

app.use(handleError);

module.exports = app;
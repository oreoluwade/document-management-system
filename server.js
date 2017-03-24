/* eslint no-console: "off" */

import express from 'express';
import parser from 'body-parser';
import homeRoute from './server/routes/index';
import documentRoutes from './server/routes/document';
import userRoutes from './server/routes/user';
import roleRoutes from './server/routes/role';

require('dotenv').config();

const port = parseInt(process.env.PORT, 10) || 9000;

// Set up the express app
const app = express();

// Parse incoming requests data
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));

// Specifying the routes the app should use for different purposes
app.use('/', homeRoute);
app.use('/role', roleRoutes);
app.use('/document', documentRoutes);
app.use('/user', userRoutes);


// Start Server
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

module.exports = app;

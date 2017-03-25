/* eslint no-console: "off" */

import express from 'express';
import parser from 'body-parser';
import homeRoute from './routes/index';
import documentRoutes from './routes/document';
import userRoutes from './routes/user';
import roleRoutes from './routes/role';

require('dotenv').config();

const secret = process.env.SECRET || 'secretconfirmation';

// const port = parseInt(process.env.PORT, 10) || 9000;

// Set up the express app
const app = express();

app.set('hiddenDetails', secret);

// Parse incoming requests data
app.use(parser.json());
app.use(parser.urlencoded({ extended: false }));

// Specifying the routes the app should use for different purposes
app.use('/', homeRoute);
app.use('/role', roleRoutes);
app.use('/document', documentRoutes);
app.use('/user', userRoutes);

export default app;

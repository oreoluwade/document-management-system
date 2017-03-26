/* eslint no-console: "off" */

import express from 'express';
import parser from 'body-parser';
import homeRoute from './routes/index';

require('dotenv').config();

const secret = process.env.SECRET || 'secretconfirmation';

// Set up the express app
const app = express();

app.set('hiddenDetails', secret);

// Parse incoming requests data
app.use(parser.json());
app.use(parser.urlencoded({ extended: false }));

// Specifying the routes the app should use for different purposes
app.use('/', homeRoute);

export default app;

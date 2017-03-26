/* eslint no-console: "off" */

import express from 'express';
import parser from 'body-parser';
import Routes from './routes';

require('dotenv').config();

const secret = process.env.SECRET || 'secretconfirmation';

// Set up the express app
const app = express();

app.set('hiddenDetails', secret);

// Parse incoming requests data
app.use(parser.json());
app.use(parser.urlencoded({ extended: false }));

// Requiring the routes into the application
Routes(app);

export default app;

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import express from 'express';
import dotenv from 'dotenv';
import logger from 'morgan';
import Routes from './routes';

dotenv.config();

const secret = process.env.SECRET || 'secretconfirmation';

// Set up the express app
const app = express();

app.set('hiddenDetails', secret);

// Parse incoming requests data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(logger('dev'));

// Requiring the routes into the application
Routes(app);

export default app;

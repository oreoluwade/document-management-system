/* eslint no-console: "off" */
import express from 'express';
import dotenv from 'dotenv';
import Routes from './routes';

dotenv.config();

const secret = process.env.SECRET || 'secretconfirmation';

// Set up the express app
const app = express();

app.set('hiddenDetails', secret);

// Parse incoming requests data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Requiring the routes into the application
Routes(app);

export default app;

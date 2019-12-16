import 'core-js/stable';
import 'regenerator-runtime/runtime';
import express from 'express';
import dotenv from 'dotenv';
import logger from 'morgan';
import { roleRoutes, userRoutes, documentRoutes } from './src/routes';

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
app.use('/api/role', roleRoutes);
app.use('/api/user', userRoutes);
app.use('/api/document', documentRoutes);

app.get('/', (req, res) => {
    return res.json({
        message: 'Welcome to the Document management application'
    });
});

export default app;

import express from 'express';
import dotenv from 'dotenv';
import logger from 'morgan';
import cors from 'cors';
import { roleRoutes, userRoutes, documentRoutes } from './routes';

dotenv.config();

const secret = process.env.SECRET || 'secretconfirmation';

// Set up the express app
const app = express();

app.set('hiddenDetails', secret);

// CORS RULES
const whitelist = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'https://docol.herokuapp.com'
];

const corsOptions = {
    origin: function(origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            const error = new Error('Not allowed by CORS');
            error.status = 401;
            callback(error);
        }
    }
};

// Parse incoming requests data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));
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

import express from 'express';
import dotenv from 'dotenv';
import { userRoutes, roleRoutes, documentRoutes } from './routes';

dotenv.config();

const secret = process.env.SECRET || 'secretconfirmation';

// Set up the express app
const app = express();

app.set('hiddenDetails', secret);

// Parse requests body&url
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Mount routes
app.use('/role', roleRoutes);
app.use('/user', userRoutes);
app.use('/document', documentRoutes);

export default app;

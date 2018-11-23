import express from 'express';
import dotenv from 'dotenv';
import { userRoutes, roleRoutes, documentRoutes } from './routes';

dotenv.config();

// Set up the express app
const app = express();

// Parse requests body&url
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Mount routes
app.use('/role', roleRoutes);
app.use('/user', userRoutes);
app.use('/document', documentRoutes);

export default app;

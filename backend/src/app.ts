import express from 'express';
import cors from 'cors';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { config } from './config';

export const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allows local dev frontend at http://localhost:5173
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', routes);

// Centralized error handler
app.use(errorHandler);

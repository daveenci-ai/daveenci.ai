import express, { Request, Response } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import path from 'path';
import routes from '../backend/src/routes';

// Load .env if present (mostly for local development with vercel dev)
dotenv.config();

const app = express();

// CORS configuration - Vercel handles this well, but we keep it for consistency
const corsOptions = {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

// API Routes
app.use('/api', routes);

// Helper for root API check
app.get('/api', (req: Request, res: Response) => {
    res.json({ message: 'DaVeenci API is running on Vercel' });
});

// Export the app as a serverless function
export default app;

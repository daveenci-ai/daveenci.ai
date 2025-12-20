import express, { Request, Response } from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env explicitly from the backend root
const envPath = path.resolve(process.cwd(), '.env');
console.log('Loading .env from:', envPath);
const result = dotenv.config({ path: envPath });

if (result.error) {
    console.error('Error loading .env file:', result.error);
} else {
    console.log('Successfully loaded env vars:', Object.keys(result.parsed || {}).length);
}

// Debug: Check if critical vars are set
console.log('GOOGLE_CLIENT_EMAIL set:', !!process.env.GOOGLE_CLIENT_EMAIL);
console.log('GOOGLE_PRIVATE_KEY set:', !!process.env.GOOGLE_PRIVATE_KEY);
console.log('GOOGLE_CALENDAR_ID set:', !!process.env.GOOGLE_CALENDAR_ID);
console.log('GOOGLE_CALENDAR_OWNER_EMAIL set:', !!process.env.GOOGLE_CALENDAR_OWNER_EMAIL);
console.log('DATABASE_URL set:', !!process.env.DATABASE_URL);

import { query } from './db';

// Test DB connection
query('SELECT NOW()')
    .then(res => console.log('DB Connection successful:', res.rows[0]))
    .catch(err => console.error('DB Connection failed:', err));

const app = express();
const port = process.env.PORT || 3001;

import routes from './routes';

// CORS configuration for production and development
const corsOptions = {
    origin: process.env.FRONTEND_URL || '*', // Set FRONTEND_URL in production
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.use(express.json());

app.use('/api', routes);

app.get('/', (req: Request, res: Response) => {
    res.send('DaVeenci Backend is running');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

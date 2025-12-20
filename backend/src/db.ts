import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const connectionString = process.env.DATABASE_URL?.replace(/"/g, '');

const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false
    },
    max: 1, // Minimize connections in serverless cold starts
    connectionTimeoutMillis: 10000,
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle database client', err);
});

export const query = async (text: string, params?: any[]) => {
    try {
        const res = await pool.query(text, params);
        return res;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
};

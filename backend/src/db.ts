import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString,
    ssl: connectionString && (connectionString.includes('localhost') || connectionString.includes('127.0.0.1')) ? false : {
        rejectUnauthorized: false
    },
    // Serverless optimizations
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
});

export const query = async (text: string, params?: any[]) => {
    const res = await pool.query(text, params);
    return res;
};

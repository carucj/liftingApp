//This file creates the db connection based on the .env data
import pg from "pg"
import dotenv from 'dotenv'
import process from "process"

const { Pool } = pg;
dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.on("connect", () => {
    console.log("connected to the db");
});

pool.on('error', (err) => {
    console.log('Database error:', err);
});

export default pool;

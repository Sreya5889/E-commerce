import pg from 'pg';
import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';

const { Pool } = pg;

// Connection pool configuration
export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ssl: process.env.NODE_ENV === 'production' && !env.DATABASE_URL.includes('localhost') 
    ? { rejectUnauthorized: false } 
    : false
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle database client:', err.message);
});

// Helper for single query execution
export const query = (text, params) => pool.query(text, params);

// Helper for transactions
export const getTransactionClient = async () => {
  const client = await pool.connect();
  const query = client.query.bind(client);
  const release = client.release.bind(client);

  const timeout = setTimeout(() => {
    console.error('A client has been checked out for more than 5 seconds!');
  }, 5000);

  client.release = () => {
    clearTimeout(timeout);
    client.release = release;
    return release();
  };

  return { client, query, release: client.release };
};

// Database health check probe
export const checkDbConnection = async () => {
  try {
    const start = Date.now();
    const res = await pool.query('SELECT 1 as healthy, NOW() as current_time');
    const duration = Date.now() - start;
    return {
      connected: true,
      latencyMs: duration,
      serverTime: res.rows[0].current_time
    };
  } catch (err) {
    return {
      connected: false,
      error: err.message
    };
  }
};

// Supabase Admin Client for privileged operations
export const supabaseAdmin = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

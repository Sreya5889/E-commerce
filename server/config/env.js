import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:54322/postgres',
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT || '54322', 10),
  DB_NAME: process.env.DB_NAME || 'postgres',
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || 'postgres',
  SUPABASE_URL: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'http://localhost:54321',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  JWT_SECRET: process.env.JWT_SECRET || 'super-secret-jwt-token-key-min-32-chars',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://mycourse.test',
  PAYMENT_SECRET_KEY: process.env.PAYMENT_SECRET_KEY || 'sk_test_placeholder_payment_key',
  PAYMENT_WEBHOOK_SECRET: process.env.PAYMENT_WEBHOOK_SECRET || 'whsec_placeholder'
};

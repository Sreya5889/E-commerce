import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import healthRouter from './routes/health.route.js';
import apiV1Router from './routes/index.js';
import { errorHandler, AppError } from './middleware/errorHandler.js';

const app = express();

// Build production and development allowed origins
const buildAllowedOrigins = () => {
  const origins = new Set();

  if (env.FRONTEND_URL) {
    const cleanUrl = env.FRONTEND_URL.trim().toLowerCase().replace(/\/+$/, '');
    origins.add(cleanUrl);

    // Auto-include apex or www counterpart for production domains
    try {
      const parsed = new URL(cleanUrl);
      if (parsed.hostname.startsWith('www.')) {
        origins.add(`${parsed.protocol}//${parsed.hostname.slice(4)}`.toLowerCase());
      } else if (!parsed.hostname.includes('localhost') && !parsed.hostname.endsWith('.test')) {
        origins.add(`${parsed.protocol}//www.${parsed.hostname}`.toLowerCase());
      }
    } catch {}
  }

  // Additional comma-separated origins from environment
  if (process.env.ALLOWED_ORIGINS) {
    process.env.ALLOWED_ORIGINS.split(',').forEach(o => {
      const trimmed = o.trim().toLowerCase().replace(/\/+$/, '');
      if (trimmed) origins.add(trimmed);
    });
  }

  // Development origins (enabled outside of strict production)
  if (env.NODE_ENV !== 'production') {
    [
      'http://mycourse.test',
      'http://mycourse.test:5173',
      'http://mycourse.test:80',
      'https://mycourse.test',
      'http://api.mycourse.test',
      'http://api.mycourse.test:5000',
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173'
    ].forEach(o => origins.add(o.toLowerCase()));
  }

  return origins;
};

const allowedOriginsSet = buildAllowedOrigins();

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests with no origin (curl, mobile apps, server-to-server)
    if (!origin) {
      return callback(null, true);
    }

    const cleanOrigin = origin.trim().toLowerCase().replace(/\/+$/, '');

    // Check whitelist set
    if (allowedOriginsSet.has(cleanOrigin)) {
      return callback(null, true);
    }

    // In non-production, permit local regex patterns
    if (env.NODE_ENV !== 'production') {
      if (
        /^https?:\/\/([a-z0-9-]+\.)*mycourse\.test(:\d+)?$/i.test(cleanOrigin) ||
        /^https?:\/\/localhost(:\d+)?$/i.test(cleanOrigin) ||
        /^https?:\/\/127\.0\.0\.1(:\d+)?$/i.test(cleanOrigin)
      ) {
        return callback(null, true);
      }
    }

    return callback(new Error(`Blocked by CORS policy: origin ${origin} is not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));

// Body parsing with safe size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Basic request logger in development
if (env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[${req.method}] ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
    });
    next();
  });
}

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');

// Serve static frontend assets if dist exists
app.use(express.static(distPath));

// Health check endpoint
app.use('/health', healthRouter);

// API v1 Master Router
app.use('/api/v1', apiV1Router);

// SPA fallback: Return index.html for non-API client routes
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api') && req.path !== '/health') {
    return res.sendFile(path.join(distPath, 'index.html'), (err) => {
      if (err) next(err);
    });
  }
  next(new AppError(`Resource not found: ${req.method} ${req.originalUrl}`, 404, 'NOT_FOUND'));
});

// Centralized error handling
app.use(errorHandler);

export default app;

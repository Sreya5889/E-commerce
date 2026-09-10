import app from './app.js';
import { env } from './config/env.js';
import { pool, checkDbConnection } from './config/db.js';

const PORT = env.PORT || 5000;

const server = app.listen(PORT, '0.0.0.0', async () => {
  console.log(`====================================================`);
  console.log(`🚀 EduAcademy API Server running in [${env.NODE_ENV}] mode`);
  console.log(`🌐 Demo API: http://api.mycourse.test:${PORT} (or http://api.mycourse.test via proxy)`);
  console.log(`🩺 Health check: http://api.mycourse.test:${PORT}/health`);
  console.log(`📡 API v1: http://api.mycourse.test:${PORT}/api/v1`);
  console.log(`💻 Local Fallback: http://localhost:${PORT}`);
  console.log(`====================================================`);

  // Probe database connection
  try {
    const dbStatus = await checkDbConnection();
    if (dbStatus.connected) {
      console.log(`✅ Database connection verified: Latency ${dbStatus.latencyMs}ms`);
    } else {
      console.warn(`⚠️ Database connection warning: ${dbStatus.error}`);
    }
  } catch (err) {
    console.warn(`⚠️ Database probe non-critical error: ${err.message}`);
  }
});

// Graceful shutdown
const shutdown = async (signal) => {
  console.log(`Received ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    console.log('HTTP server closed.');
    try {
      await pool.end();
      console.log('Database connection pool terminated.');
      process.exit(0);
    } catch (err) {
      console.error('Error terminating database pool:', err);
      process.exit(1);
    }
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

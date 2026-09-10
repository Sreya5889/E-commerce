import { Router } from 'express';
import { checkDbConnection } from '../config/db.js';

const router = Router();

router.get('/', async (req, res) => {
  const dbHealth = await checkDbConnection();

  const isHealthy = dbHealth.connected;
  const statusCode = isHealthy ? 200 : 503;

  res.status(statusCode).json({
    success: isHealthy,
    status: isHealthy ? 'healthy' : 'unhealthy',
    database: isHealthy ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    details: dbHealth
  });
});

export default router;

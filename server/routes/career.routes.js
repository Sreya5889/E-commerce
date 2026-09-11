import { Router } from 'express';
import { careerController } from '../controllers/career.controller.js';

const router = Router();
router.get('/readiness', careerController.getReadiness);

export default router;

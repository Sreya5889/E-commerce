import { Router } from 'express';
import { aiCareerController } from '../controllers/aiCareer.controller.js';

const router = Router();
router.post('/chat', aiCareerController.chat);

export default router;

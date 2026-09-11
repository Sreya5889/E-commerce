import { Router } from 'express';
import { gamificationController } from '../controllers/gamification.controller.js';

const router = Router();
router.get('/profile', gamificationController.getProfile);
router.get('/achievements', gamificationController.getAchievements);
router.post('/xp', gamificationController.awardXp);

export default router;

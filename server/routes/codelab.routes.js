import { Router } from 'express';
import { codelabController } from '../controllers/codelab.controller.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/languages', codelabController.getLanguages);
router.get('/categories', codelabController.getCategories);
router.get('/problems', codelabController.getProblems);
router.get('/problems/:slug', codelabController.getProblemBySlug);
router.get('/daily', codelabController.getDailyChallenge);
router.get('/leaderboard', codelabController.getLeaderboard);
router.get('/stats/user', optionalAuth, codelabController.getUserStats);
router.get('/submissions', optionalAuth, codelabController.getSubmissions);

router.post('/run', codelabController.runCode);
router.post('/execute', codelabController.runCode);
router.post('/submit', optionalAuth, codelabController.submitCode);

export default router;

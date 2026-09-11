import { Router } from 'express';
import { aptitudeController } from '../controllers/aptitude.controller.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/rbac.js';

const router = Router();

// Public taxonomy & browsing
router.get('/categories', aptitudeController.getCategories);
router.get('/categories/:slug', aptitudeController.getCategoryBySlug);
router.get('/topics', aptitudeController.getTopics);

// Questions (Practice & filter)
router.get('/questions', optionalAuth, aptitudeController.getQuestions);
router.get('/questions/:id', optionalAuth, aptitudeController.getQuestionById);

// Mock Tests
router.get('/mock-tests', aptitudeController.getMockTests);
router.get('/mock-tests/:slug', optionalAuth, aptitudeController.getMockTestBySlug);

// Daily Challenge
router.get('/daily-challenge', optionalAuth, aptitudeController.getDailyChallenge);

// Achievements
router.get('/achievements', optionalAuth, aptitudeController.getAchievements);

// Attempts & Results
router.post('/attempts', optionalAuth, aptitudeController.startAttempt);
router.post('/attempts/:id/submit', optionalAuth, aptitudeController.submitAttempt);
router.get('/attempts/:id', optionalAuth, aptitudeController.getAttemptById);

// Student History & Performance Analytics
router.get('/history', optionalAuth, aptitudeController.getStudentHistory);
router.get('/analytics', optionalAuth, aptitudeController.getStudentAnalytics);

// Admin Management
router.post('/admin/questions', requireAuth, requireAdmin, aptitudeController.createQuestion);
router.put('/admin/questions/:id', requireAuth, requireAdmin, aptitudeController.updateQuestion);
router.delete('/admin/questions/:id', requireAuth, requireAdmin, aptitudeController.deleteQuestion);

router.post('/admin/mock-tests', requireAuth, requireAdmin, aptitudeController.createMockTest);
router.put('/admin/mock-tests/:id', requireAuth, requireAdmin, aptitudeController.updateMockTest);
router.delete('/admin/mock-tests/:id', requireAuth, requireAdmin, aptitudeController.deleteMockTest);

export default router;

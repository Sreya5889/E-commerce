import { Router } from 'express';
import { progressController } from '../controllers/progress.controller.js';
import { optionalAuth } from '../middleware/auth.js';

const router = Router();

// Apply optionalAuth so guest/demo sessions work seamlessly while preserving authenticated user context
router.use(optionalAuth);

// Notes endpoints
router.get('/notes', progressController.getNotes);
router.post('/notes', progressController.createNote);
router.delete('/notes/:id', progressController.deleteNote);

// Bookmarks endpoints
router.get('/bookmarks', progressController.getBookmarks);
router.post('/bookmarks/toggle', progressController.toggleBookmark);

// Quizzes endpoints
router.get('/quizzes/:lessonId', progressController.getLessonQuiz);
router.post('/quizzes/:quizId/attempt', progressController.submitQuizAttempt);

// Resume position endpoints
router.get('/resume/:courseId', progressController.getResumePosition);
router.post('/resume/:courseId', progressController.saveResumePosition);

// Learning Analytics endpoint
router.get('/analytics', progressController.getLearningAnalytics);

// Legacy course & lesson progress
router.get('/:courseId', progressController.getCourseProgress);
router.post('/:lessonId', progressController.updateLessonProgress);

export default router;

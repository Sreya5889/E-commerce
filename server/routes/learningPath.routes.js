import { Router } from 'express';
import { learningPathController } from '../controllers/learningPath.controller.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/rbac.js';

const router = Router();

// Public listing
router.get('/', learningPathController.getLearningPaths);

// Student enrolled paths (must come before /:slug)
router.get('/my/paths', requireAuth, learningPathController.getMyLearningPaths);

// Admin listing (must come before /:slug)
router.get('/admin/all', requireAuth, requireAdmin, learningPathController.adminGetAllLearningPaths);

// Public detail with optional enrollment status
router.get('/:slug', optionalAuth, learningPathController.getLearningPathBySlug);

// Student actions
router.post('/:id/enroll', requireAuth, learningPathController.enrollInLearningPath);
router.patch('/:id/progress', requireAuth, learningPathController.updateStudentProgress);

// Admin CRUD
router.post('/', requireAuth, requireAdmin, learningPathController.createLearningPath);
router.patch('/:id', requireAuth, requireAdmin, learningPathController.updateLearningPath);
router.delete('/:id', requireAuth, requireAdmin, learningPathController.deleteLearningPath);

export default router;

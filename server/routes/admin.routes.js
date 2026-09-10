import { Router } from 'express';
import { z } from 'zod';
import { adminController } from '../controllers/admin.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const updateStatusSchema = {
  body: z.object({
    status: z.enum(['draft', 'under_review', 'published', 'unpublished', 'archived'])
  })
};

const verifyTeacherSchema = {
  body: z.object({
    status: z.enum(['pending', 'approved', 'rejected', 'suspended']),
    rejectionReason: z.string().optional()
  })
};

router.use(requireAuth, requireAdmin);

router.get('/stats', adminController.getDashboardStats);
router.get('/users', adminController.getUsers);
router.get('/courses', adminController.getAllCourses);
router.patch('/courses/:id/status', validate(updateStatusSchema), adminController.updateCourseStatus);
router.get('/teachers', adminController.getTeachers);
router.patch('/teachers/:id/verify', validate(verifyTeacherSchema), adminController.verifyTeacher);

export default router;

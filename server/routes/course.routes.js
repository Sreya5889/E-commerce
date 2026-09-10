import { Router } from 'express';
import { z } from 'zod';
import { courseController } from '../controllers/course.controller.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';
import { requireTeacher, requireAdmin } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const createCourseSchema = {
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    categoryId: z.string().uuid('Invalid category ID'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    price: z.number().min(0, 'Price must be positive'),
    discountPrice: z.number().min(0).optional().nullable(),
    isFree: z.boolean().optional(),
    level: z.enum(['beginner', 'intermediate', 'advanced', 'all_levels']).optional(),
    thumbnailUrl: z.string().url().optional().nullable()
  })
};

router.get('/', courseController.getCourses);
router.get('/:id', optionalAuth, courseController.getCourseById);
router.post('/', requireAuth, requireTeacher, validate(createCourseSchema), courseController.createCourse);
router.patch('/:id', requireAuth, requireTeacher, courseController.updateCourse);
router.delete('/:id', requireAuth, requireTeacher, courseController.deleteCourse);
router.post('/:id/publish', requireAuth, requireTeacher, courseController.publishCourse);
router.post('/:id/unpublish', requireAuth, requireTeacher, courseController.unpublishCourse);

export default router;

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
    categoryId: z.string().min(1, 'Category is required').optional().nullable(),
    category_id: z.string().min(1).optional().nullable(),
    category: z.string().optional(),
    subtitle: z.string().optional(),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    price: z.union([z.number().min(0), z.string().regex(/^\d+(\.\d+)?$/).transform(Number)]),
    discountPrice: z.union([z.number().min(0), z.string().regex(/^\d+(\.\d+)?$/).transform(Number)]).optional().nullable(),
    discount_price: z.union([z.number().min(0), z.string().regex(/^\d+(\.\d+)?$/).transform(Number)]).optional().nullable(),
    isFree: z.boolean().optional(),
    is_free: z.boolean().optional(),
    level: z.string().optional(),
    language: z.string().optional(),
    thumbnailUrl: z.string().optional().nullable(),
    thumbnail_url: z.string().optional().nullable(),
    previewVideoUrl: z.string().optional().nullable(),
    preview_video_url: z.string().optional().nullable(),
    tags: z.union([z.array(z.string()), z.string()]).optional(),
    what_you_will_learn: z.union([z.array(z.string()), z.string()]).optional(),
    badge: z.string().optional().nullable(),
    duration_hours: z.union([z.number(), z.string().transform(Number)]).optional()
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

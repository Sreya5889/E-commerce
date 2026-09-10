import { Router } from 'express';
import { z } from 'zod';
import { enrollmentController } from '../controllers/enrollment.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const enrollFreeSchema = {
  body: z.object({
    courseId: z.string().uuid('Invalid course ID')
  })
};

router.use(requireAuth);

router.get('/', enrollmentController.getUserEnrollments);
router.get('/check/:courseId', enrollmentController.checkEnrollment);
router.post('/free', validate(enrollFreeSchema), enrollmentController.enrollFreeCourse);

export default router;

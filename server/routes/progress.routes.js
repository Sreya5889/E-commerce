import { Router } from 'express';
import { z } from 'zod';
import { progressController } from '../controllers/progress.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const updateProgressSchema = {
  body: z.object({
    completed: z.boolean().default(true),
    watchedSeconds: z.number().min(0).default(0)
  })
};

router.use(requireAuth);

router.get('/:courseId', progressController.getCourseProgress);
router.post('/:lessonId', validate(updateProgressSchema), progressController.updateLessonProgress);

export default router;

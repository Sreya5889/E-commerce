import { Router } from 'express';
import { z } from 'zod';
import { reviewController } from '../controllers/review.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { requireTeacher } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const addReviewSchema = {
  body: z.object({
    rating: z.number().min(1).max(5),
    review: z.string().min(5, 'Review must be at least 5 characters')
  })
};

const replySchema = {
  body: z.object({
    reply: z.string().min(2, 'Reply cannot be empty')
  })
};

router.get('/:courseId', reviewController.getCourseReviews);
router.post('/:courseId', requireAuth, validate(addReviewSchema), reviewController.addReview);
router.post('/:id/reply', requireAuth, requireTeacher, validate(replySchema), reviewController.replyToReview);

export default router;

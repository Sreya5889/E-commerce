import { query } from '../config/db.js';
import { AppError } from '../middleware/errorHandler.js';

export const reviewController = {
  // GET /reviews/:courseId
  async getCourseReviews(req, res, next) {
    try {
      const { courseId } = req.params;
      const result = await query(
        `SELECT 
          r.*,
          json_build_object(
            'display_name', p.display_name,
            'first_name', p.first_name,
            'last_name', p.last_name,
            'avatar_url', p.avatar_url
          ) as profiles
         FROM public.reviews r
         JOIN public.profiles p ON r.user_id = p.user_id
         WHERE r.course_id = $1 AND r.is_approved = TRUE
         ORDER BY r.created_at DESC`,
        [courseId]
      );

      res.status(200).json({
        success: true,
        data: result.rows
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /reviews/:courseId: Only enrolled students can submit a review
  async addReview(req, res, next) {
    try {
      const userId = req.user.id;
      const { courseId } = req.params;
      const { rating, review } = req.body;

      // Check enrollment
      const enrRes = await query(
        `SELECT id FROM public.enrollments WHERE user_id = $1 AND course_id = $2`,
        [userId, courseId]
      );

      if (enrRes.rows.length === 0) {
        throw new AppError('Only enrolled students can review this course', 403, 'NOT_ENROLLED');
      }

      const isVerifiedPurchase = true;

      const result = await query(
        `INSERT INTO public.reviews (
          course_id, user_id, rating, review, is_verified_purchase, is_approved
        ) VALUES ($1, $2, $3, $4, $5, TRUE)
        ON CONFLICT (course_id, user_id) DO UPDATE SET
          rating = $3,
          review = $4,
          updated_at = NOW()
        RETURNING *`,
        [courseId, userId, rating, review, isVerifiedPurchase]
      );

      res.status(201).json({
        success: true,
        message: 'Review submitted successfully',
        data: result.rows[0]
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /reviews/:id/reply: Instructor reply to review
  async replyToReview(req, res, next) {
    try {
      const { id } = req.params;
      const { reply } = req.body;

      const result = await query(
        `UPDATE public.reviews 
         SET instructor_reply = $1, reply_created_at = NOW(), updated_at = NOW()
         WHERE id = $2
         RETURNING *`,
        [reply, id]
      );

      if (result.rows.length === 0) {
        throw new AppError('Review not found', 404, 'NOT_FOUND');
      }

      res.status(200).json({
        success: true,
        message: 'Reply posted successfully',
        data: result.rows[0]
      });
    } catch (err) {
      next(err);
    }
  }
};

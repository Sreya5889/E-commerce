import { query } from '../config/db.js';
import { AppError } from '../middleware/errorHandler.js';

export const wishlistController = {
  async getWishlist(req, res, next) {
    try {
      const userId = req.user.id;
      const result = await query(
        `SELECT 
          w.id as wishlist_id,
          w.created_at,
          crs.*,
          json_build_object(
            'display_name', p.display_name,
            'first_name', p.first_name,
            'last_name', p.last_name
          ) as instructor
         FROM public.wishlist w
         JOIN public.courses crs ON w.course_id = crs.id
         LEFT JOIN public.teachers t ON crs.teacher_id = t.id
         LEFT JOIN public.profiles p ON t.user_id = p.user_id
         WHERE w.user_id = $1
         ORDER BY w.created_at DESC`,
        [userId]
      );

      res.status(200).json({
        success: true,
        data: result.rows
      });
    } catch (err) {
      next(err);
    }
  },

  async addToWishlist(req, res, next) {
    try {
      const userId = req.user.id;
      const { courseId } = req.params;

      const result = await query(
        `INSERT INTO public.wishlist (user_id, course_id)
         VALUES ($1, $2)
         ON CONFLICT (user_id, course_id) DO NOTHING
         RETURNING *`,
        [userId, courseId]
      );

      res.status(201).json({
        success: true,
        message: 'Course added to wishlist',
        data: result.rows[0] || { message: 'Already in wishlist' }
      });
    } catch (err) {
      next(err);
    }
  },

  async removeFromWishlist(req, res, next) {
    try {
      const userId = req.user.id;
      const { courseId } = req.params;

      await query(`DELETE FROM public.wishlist WHERE user_id = $1 AND course_id = $2`, [userId, courseId]);

      res.status(200).json({
        success: true,
        message: 'Course removed from wishlist'
      });
    } catch (err) {
      next(err);
    }
  }
};

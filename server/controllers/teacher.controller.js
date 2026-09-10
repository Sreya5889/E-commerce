import { query } from '../config/db.js';
import { AppError } from '../middleware/errorHandler.js';

export const teacherController = {
  async getTeachers(req, res, next) {
    try {
      const result = await query(
        `SELECT 
          t.*,
          json_build_object(
            'display_name', p.display_name,
            'first_name', p.first_name,
            'last_name', p.last_name,
            'avatar_url', p.avatar_url,
            'bio', p.bio,
            'website', p.website
          ) as profiles
         FROM public.teachers t
         JOIN public.profiles p ON t.user_id = p.user_id
         WHERE t.verification_status = 'approved'
         ORDER BY t.avg_rating DESC, t.total_students DESC`
      );

      res.status(200).json({
        success: true,
        data: result.rows
      });
    } catch (err) {
      next(err);
    }
  },

  async getTeacherById(req, res, next) {
    try {
      const { id } = req.params;
      const result = await query(
        `SELECT 
          t.*,
          json_build_object(
            'display_name', p.display_name,
            'first_name', p.first_name,
            'last_name', p.last_name,
            'avatar_url', p.avatar_url,
            'bio', p.bio,
            'website', p.website
          ) as profiles
         FROM public.teachers t
         JOIN public.profiles p ON t.user_id = p.user_id
         WHERE t.id = $1`,
        [id]
      );

      if (result.rows.length === 0) throw new AppError('Teacher not found', 404, 'NOT_FOUND');

      // Fetch teacher's published courses
      const coursesRes = await query(
        `SELECT * FROM public.courses WHERE teacher_id = $1 AND status = 'published' ORDER BY student_count DESC`,
        [id]
      );

      res.status(200).json({
        success: true,
        data: {
          ...result.rows[0],
          courses: coursesRes.rows
        }
      });
    } catch (err) {
      next(err);
    }
  }
};

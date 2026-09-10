import { query } from '../config/db.js';
import { AppError } from '../middleware/errorHandler.js';

export const enrollmentController = {
  // GET /enrollments: Current user's enrolled courses with progress and course details
  async getUserEnrollments(req, res, next) {
    try {
      const userId = req.user.id;
      const result = await query(
        `SELECT 
          e.*,
          json_build_object(
            'id', c.id,
            'title', c.title,
            'slug', c.slug,
            'thumbnail_url', c.thumbnail_url,
            'level', c.level,
            'duration_hours', c.duration_hours,
            'teacher', json_build_object(
              'display_name', p.display_name,
              'first_name', p.first_name,
              'last_name', p.last_name
            )
          ) as courses
         FROM public.enrollments e
         JOIN public.courses c ON e.course_id = c.id
         LEFT JOIN public.teachers t ON c.teacher_id = t.id
         LEFT JOIN public.profiles p ON t.user_id = p.user_id
         WHERE e.user_id = $1
         ORDER BY e.last_accessed_at DESC NULLS LAST, e.enrolled_at DESC`,
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

  // GET /courses/:id/enrollment: Check enrollment status for course
  async checkEnrollment(req, res, next) {
    try {
      const userId = req.user.id;
      const { courseId } = req.params;

      const result = await query(
        `SELECT * FROM public.enrollments WHERE user_id = $1 AND course_id = $2`,
        [userId, courseId]
      );

      res.status(200).json({
        success: true,
        isEnrolled: result.rows.length > 0,
        enrollment: result.rows[0] || null
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /enrollments: Enroll in a free course
  async enrollFreeCourse(req, res, next) {
    try {
      const userId = req.user.id;
      const { courseId } = req.body;

      // Verify course is published and free
      const courseRes = await query(
        `SELECT id, is_free, price, status FROM public.courses WHERE id = $1`,
        [courseId]
      );

      if (courseRes.rows.length === 0) {
        throw new AppError('Course not found', 404, 'COURSE_NOT_FOUND');
      }

      const course = courseRes.rows[0];
      if (!course.is_free && Number(course.price) > 0) {
        throw new AppError('This is a paid course and requires checkout', 400, 'PAYMENT_REQUIRED');
      }

      const enrRes = await query(
        `INSERT INTO public.enrollments (user_id, course_id, progress_percentage, completed)
         VALUES ($1, $2, 0.00, false)
         ON CONFLICT (user_id, course_id) DO NOTHING
         RETURNING *`,
        [userId, courseId]
      );

      if (enrRes.rows.length === 0) {
        throw new AppError('You are already enrolled in this course', 400, 'ALREADY_ENROLLED');
      }

      // Increment student count
      await query(`UPDATE public.courses SET student_count = student_count + 1 WHERE id = $1`, [courseId]);

      res.status(201).json({
        success: true,
        message: 'Successfully enrolled in course',
        data: enrRes.rows[0]
      });
    } catch (err) {
      next(err);
    }
  }
};

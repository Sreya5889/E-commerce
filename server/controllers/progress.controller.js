import { query } from '../config/db.js';
import { AppError } from '../middleware/errorHandler.js';

export const progressController = {
  // GET /progress/:courseId: Get progress of all lessons in course
  async getCourseProgress(req, res, next) {
    try {
      const userId = req.user.id;
      const { courseId } = req.params;

      const progressRes = await query(
        `SELECT lp.* 
         FROM public.lesson_progress lp
         WHERE lp.user_id = $1 AND lp.course_id = $2`,
        [userId, courseId]
      );

      const enrRes = await query(
        `SELECT progress_percentage, completed, completed_at, last_accessed_at
         FROM public.enrollments 
         WHERE user_id = $1 AND course_id = $2`,
        [userId, courseId]
      );

      res.status(200).json({
        success: true,
        data: {
          enrollment: enrRes.rows[0] || null,
          lessons: progressRes.rows
        }
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /progress/:lessonId: Update lesson completion and calculate overall course progress
  async updateLessonProgress(req, res, next) {
    try {
      const userId = req.user.id;
      const { lessonId } = req.params;
      const { completed = true, watchedSeconds = 0 } = req.body;

      // 1. Get lesson and course info
      const lessonRes = await query(
        `SELECT cl.id, cs.course_id 
         FROM public.course_lessons cl
         JOIN public.course_sections cs ON cl.section_id = cs.id
         WHERE cl.id = $1`,
        [lessonId]
      );

      if (lessonRes.rows.length === 0) {
        throw new AppError('Lesson not found', 404, 'LESSON_NOT_FOUND');
      }

      const courseId = lessonRes.rows[0].course_id;

      // 2. Verify enrollment
      const enrRes = await query(
        `SELECT id FROM public.enrollments WHERE user_id = $1 AND course_id = $2`,
        [userId, courseId]
      );

      if (enrRes.rows.length === 0) {
        throw new AppError('You are not enrolled in this course', 403, 'NOT_ENROLLED');
      }

      // 3. Upsert lesson progress
      await query(
        `INSERT INTO public.lesson_progress (
          user_id, course_id, lesson_id, completed, watched_seconds, completed_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, CASE WHEN $4 = TRUE THEN NOW() ELSE NULL END, NOW())
        ON CONFLICT (user_id, lesson_id) DO UPDATE SET
          completed = $4,
          watched_seconds = GREATEST(lesson_progress.watched_seconds, $5),
          completed_at = CASE WHEN $4 = TRUE THEN NOW() ELSE lesson_progress.completed_at END,
          updated_at = NOW()`,
        [userId, courseId, lessonId, completed, watchedSeconds]
      );

      // 4. Calculate total and completed lessons for the course
      const countRes = await query(
        `SELECT 
          (SELECT COUNT(cl.id) FROM public.course_lessons cl JOIN public.course_sections cs ON cl.section_id = cs.id WHERE cs.course_id = $1) as total,
          (SELECT COUNT(lp.id) FROM public.lesson_progress lp WHERE lp.user_id = $2 AND lp.course_id = $1 AND lp.completed = TRUE) as completed_count`,
        [courseId, userId]
      );

      const totalLessons = parseInt(countRes.rows[0].total, 10);
      const completedLessons = parseInt(countRes.rows[0].completed_count, 10);
      const progressPercentage = totalLessons > 0 ? Math.min(100, Math.round((completedLessons / totalLessons) * 100)) : 0;
      const isCourseCompleted = progressPercentage >= 100;

      // 5. Update enrollment
      await query(
        `UPDATE public.enrollments 
         SET progress_percentage = $1,
             completed = $2,
             completed_at = CASE WHEN $2 = TRUE AND completed_at IS NULL THEN NOW() ELSE completed_at END,
             last_accessed_at = NOW()
         WHERE user_id = $3 AND course_id = $4`,
        [progressPercentage, isCourseCompleted, userId, courseId]
      );

      // 6. If 100% completed, auto-issue certificate
      let certificate = null;
      if (isCourseCompleted) {
        const certNum = `CERT-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
        const certRes = await query(
          `INSERT INTO public.certificates (certificate_number, user_id, course_id, verification_code)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (user_id, course_id) DO UPDATE SET issued_at = certificates.issued_at
           RETURNING *`,
          [certNum, userId, courseId, certNum]
        );
        certificate = certRes.rows[0];

        // Send completion notification
        await query(
          `INSERT INTO public.notifications (user_id, title, message, type)
           VALUES ($1, 'Course Completed! 🎉', 'Congratulations! You completed the course and earned your certificate.', 'certificate_issued')`,
          [userId]
        );
      }

      res.status(200).json({
        success: true,
        message: 'Lesson progress updated',
        data: {
          lessonId,
          courseId,
          completed,
          progressPercentage,
          isCourseCompleted,
          certificate
        }
      });
    } catch (err) {
      next(err);
    }
  }
};

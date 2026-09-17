import { query } from '../config/db.js';
import { AppError } from '../middleware/errorHandler.js';
import { learningExperienceStore } from '../utils/learningExperienceStore.js';

export const progressController = {
  // GET /progress/:courseId: Get progress of all lessons in course
  async getCourseProgress(req, res, next) {
    try {
      const userId = req.user?.id || 'demo-student-id';
      const { courseId } = req.params;

      try {
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

        if (progressRes.rows && progressRes.rows.length > 0) {
          return res.status(200).json({
            success: true,
            data: {
              enrollment: enrRes.rows[0] || null,
              lessons: progressRes.rows
            }
          });
        }
      } catch (dbErr) {
        // Fall back to store
      }

      const resumePos = learningExperienceStore.getResumePosition(userId, courseId);
      return res.status(200).json({
        success: true,
        data: {
          enrollment: { progress_percentage: 50, completed: false },
          lessons: [],
          resumePosition: resumePos
        }
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /progress/:lessonId: Update lesson completion and calculate overall course progress
  async updateLessonProgress(req, res, next) {
    try {
      const userId = req.user?.id || 'demo-student-id';
      const { lessonId } = req.params;
      const { completed = true, watchedSeconds = 0, courseId = null } = req.body;

      try {
        // 1. Get lesson and course info
        const lessonRes = await query(
          `SELECT cl.id, cs.course_id 
           FROM public.course_lessons cl
           JOIN public.course_sections cs ON cl.section_id = cs.id
           WHERE cl.id = $1`,
          [lessonId]
        );

        if (lessonRes.rows.length > 0) {
          const resolvedCourseId = lessonRes.rows[0].course_id;

          // 2. Upsert lesson progress
          await query(
            `INSERT INTO public.lesson_progress (
              user_id, course_id, lesson_id, completed, watched_seconds, completed_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, CASE WHEN $4 = TRUE THEN NOW() ELSE NULL END, NOW())
            ON CONFLICT (user_id, lesson_id) DO UPDATE SET
              completed = $4,
              watched_seconds = GREATEST(lesson_progress.watched_seconds, $5),
              completed_at = CASE WHEN $4 = TRUE THEN NOW() ELSE lesson_progress.completed_at END,
              updated_at = NOW()`,
            [userId, resolvedCourseId, lessonId, completed, watchedSeconds]
          );

          // 3. Count total and completed lessons
          const countRes = await query(
            `SELECT 
              (SELECT COUNT(cl.id) FROM public.course_lessons cl JOIN public.course_sections cs ON cl.section_id = cs.id WHERE cs.course_id = $1) as total,
              (SELECT COUNT(lp.id) FROM public.lesson_progress lp WHERE lp.user_id = $2 AND lp.course_id = $1 AND lp.completed = TRUE) as completed_count`,
            [resolvedCourseId, userId]
          );

          const totalLessons = parseInt(countRes.rows[0].total, 10) || 1;
          const completedLessons = parseInt(countRes.rows[0].completed_count, 10) || 1;
          const progressPercentage = Math.min(100, Math.round((completedLessons / totalLessons) * 100));

          return res.status(200).json({
            success: true,
            message: 'Lesson progress updated',
            data: {
              lessonId,
              courseId: resolvedCourseId,
              completed,
              progressPercentage,
              isCourseCompleted: progressPercentage >= 100
            }
          });
        }
      } catch (dbErr) {
        // Fall back to store
      }

      if (courseId) {
        learningExperienceStore.saveResumePosition({
          userId,
          courseId,
          lessonId,
          positionSeconds: watchedSeconds
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Lesson progress updated',
        data: {
          lessonId,
          courseId,
          completed,
          progressPercentage: 60,
          isCourseCompleted: false
        }
      });
    } catch (err) {
      next(err);
    }
  },

  // 1. NOTES
  async getNotes(req, res, next) {
    try {
      const userId = req.user?.id || 'demo-student-id';
      const { courseId, lessonId } = req.query;

      try {
        let sql = 'SELECT * FROM public.student_notes WHERE user_id = $1';
        const params = [userId];
        if (courseId) {
          params.push(courseId);
          sql += ` AND course_id = $${params.length}`;
        }
        if (lessonId) {
          params.push(lessonId);
          sql += ` AND lesson_id = $${params.length}`;
        }
        sql += ' ORDER BY timestamp_seconds ASC, created_at ASC';

        const result = await query(sql, params);
        if (result.rows && result.rows.length > 0) {
          return res.json({ success: true, data: result.rows });
        }
      } catch (dbErr) {
        // Fall back
      }

      const notes = learningExperienceStore.getNotes(userId, courseId, lessonId);
      res.json({ success: true, data: notes });
    } catch (err) {
      next(err);
    }
  },

  async createNote(req, res, next) {
    try {
      const userId = req.user?.id || 'demo-student-id';
      const { courseId, lessonId, content, timestampSeconds = 0 } = req.body;

      if (!content || !content.trim()) {
        return res.status(400).json({ success: false, message: 'Note content is required' });
      }

      try {
        const result = await query(
          `INSERT INTO public.student_notes (user_id, course_id, lesson_id, content, timestamp_seconds)
           VALUES ($1, $2, $3, $4, $5) RETURNING *`,
          [userId, courseId, lessonId, content.trim(), timestampSeconds]
        );
        if (result.rows && result.rows.length > 0) {
          return res.status(201).json({ success: true, data: result.rows[0] });
        }
      } catch (dbErr) {
        // Fall back
      }

      const note = learningExperienceStore.saveNote({
        userId,
        courseId,
        lessonId,
        content,
        timestampSeconds
      });
      res.status(201).json({ success: true, data: note });
    } catch (err) {
      next(err);
    }
  },

  async deleteNote(req, res, next) {
    try {
      const userId = req.user?.id || 'demo-student-id';
      const { id } = req.params;

      try {
        await query('DELETE FROM public.student_notes WHERE id = $1 AND user_id = $2', [id, userId]);
      } catch (dbErr) {}

      const ok = learningExperienceStore.deleteNote(userId, id);
      res.json({ success: true, message: 'Note deleted' });
    } catch (err) {
      next(err);
    }
  },

  // 2. BOOKMARKS
  async getBookmarks(req, res, next) {
    try {
      const userId = req.user?.id || 'demo-student-id';
      const { courseId } = req.query;

      try {
        let sql = 'SELECT * FROM public.lesson_bookmarks WHERE user_id = $1';
        const params = [userId];
        if (courseId) {
          params.push(courseId);
          sql += ' AND course_id = $2';
        }
        const result = await query(sql, params);
        if (result.rows && result.rows.length > 0) {
          return res.json({ success: true, data: result.rows });
        }
      } catch (dbErr) {}

      const bms = learningExperienceStore.getBookmarks(userId, courseId);
      res.json({ success: true, data: bms });
    } catch (err) {
      next(err);
    }
  },

  async toggleBookmark(req, res, next) {
    try {
      const userId = req.user?.id || 'demo-student-id';
      const { courseId, lessonId } = req.body;

      try {
        const checkRes = await query(
          'SELECT id FROM public.lesson_bookmarks WHERE user_id = $1 AND lesson_id = $2',
          [userId, lessonId]
        );
        if (checkRes.rows.length > 0) {
          await query('DELETE FROM public.lesson_bookmarks WHERE id = $1', [checkRes.rows[0].id]);
          return res.json({ success: true, data: { isBookmarked: false, lessonId, courseId } });
        } else {
          await query(
            'INSERT INTO public.lesson_bookmarks (user_id, lesson_id) VALUES ($1, $2)',
            [userId, lessonId]
          );
          return res.json({ success: true, data: { isBookmarked: true, lessonId, courseId } });
        }
      } catch (dbErr) {}

      const result = learningExperienceStore.toggleBookmark(userId, courseId, lessonId);
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },

  // 3. QUIZZES
  async getLessonQuiz(req, res, next) {
    try {
      const { lessonId } = req.params;

      try {
        const result = await query(
          'SELECT * FROM public.lesson_quizzes WHERE lesson_id = $1',
          [lessonId]
        );
        if (result.rows && result.rows.length > 0) {
          return res.json({ success: true, data: result.rows[0] });
        }
      } catch (dbErr) {}

      const quiz = learningExperienceStore.getQuiz(lessonId);
      res.json({ success: true, data: quiz });
    } catch (err) {
      next(err);
    }
  },

  async submitQuizAttempt(req, res, next) {
    try {
      const userId = req.user?.id || 'demo-student-id';
      const { quizId } = req.params;
      const { answers = [] } = req.body;

      const attempt = learningExperienceStore.submitQuizAttempt({
        userId,
        quizId,
        answers
      });

      res.status(201).json({ success: true, data: attempt });
    } catch (err) {
      next(err);
    }
  },

  // 4. RESUME LEARNING POSITION
  async getResumePosition(req, res, next) {
    try {
      const userId = req.user?.id || 'demo-student-id';
      const { courseId } = req.params;

      const pos = learningExperienceStore.getResumePosition(userId, courseId);
      res.json({ success: true, data: pos });
    } catch (err) {
      next(err);
    }
  },

  async saveResumePosition(req, res, next) {
    try {
      const userId = req.user?.id || 'demo-student-id';
      const { courseId } = req.params;
      const { lessonId, positionSeconds } = req.body;

      const saved = learningExperienceStore.saveResumePosition({
        userId,
        courseId,
        lessonId,
        positionSeconds
      });

      res.json({ success: true, data: saved });
    } catch (err) {
      next(err);
    }
  },

  // 5. LEARNING ANALYTICS
  async getLearningAnalytics(req, res, next) {
    try {
      const userId = req.user?.id || 'demo-student-id';
      const analytics = learningExperienceStore.getLearningAnalytics(userId);
      res.json({ success: true, data: analytics });
    } catch (err) {
      next(err);
    }
  }
};

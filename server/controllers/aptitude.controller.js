import { query } from '../config/db.js';
import { AppError } from '../middleware/errorHandler.js';
import { aptitudeStore } from '../utils/aptitudeStore.js';

export const aptitudeController = {
  // GET /api/v1/aptitude/categories
  async getCategories(req, res, next) {
    try {
      try {
        const sql = `
          SELECT 
            c.*,
            COUNT(DISTINCT t.id) as topic_count,
            COUNT(DISTINCT q.id) as question_count
          FROM public.aptitude_categories c
          LEFT JOIN public.aptitude_topics t ON t.category_id = c.id
          LEFT JOIN public.aptitude_questions q ON q.category_id = c.id
          GROUP BY c.id
          ORDER BY c.display_order ASC
        `;
        const result = await query(sql);
        if (result.rows && result.rows.length > 0) {
          return res.status(200).json({
            success: true,
            data: result.rows
          });
        }
      } catch (dbErr) {
        // Fall back to JSON store
      }

      const categories = aptitudeStore.getCategories();
      return res.status(200).json({
        success: true,
        data: categories
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/v1/aptitude/categories/:slug
  async getCategoryBySlug(req, res, next) {
    try {
      const { slug } = req.params;

      try {
        const catRes = await query(
          'SELECT * FROM public.aptitude_categories WHERE slug = $1 OR id = $1',
          [slug]
        );
        if (catRes.rows && catRes.rows.length > 0) {
          const category = catRes.rows[0];
          const topRes = await query(
            `SELECT t.*, COUNT(q.id) as question_count
             FROM public.aptitude_topics t
             LEFT JOIN public.aptitude_questions q ON q.topic_id = t.id
             WHERE t.category_id = $1
             GROUP BY t.id
             ORDER BY t.display_order ASC`,
            [category.id]
          );
          return res.status(200).json({
            success: true,
            data: {
              ...category,
              topics: topRes.rows,
              topic_count: topRes.rows.length
            }
          });
        }
      } catch (dbErr) {
        // Fall back
      }

      const category = aptitudeStore.getCategoryBySlug(slug);
      if (!category) {
        return next(new AppError('Aptitude category not found', 404));
      }

      return res.status(200).json({
        success: true,
        data: category
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/v1/aptitude/topics
  async getTopics(req, res, next) {
    try {
      const { category_id } = req.query;

      try {
        let sql = `
          SELECT t.*, COUNT(q.id) as question_count
          FROM public.aptitude_topics t
          LEFT JOIN public.aptitude_questions q ON q.topic_id = t.id
        `;
        const params = [];
        if (category_id) {
          sql += ' WHERE t.category_id = $1';
          params.push(category_id);
        }
        sql += ' GROUP BY t.id ORDER BY t.display_order ASC';

        const result = await query(sql, params);
        if (result.rows && result.rows.length > 0) {
          return res.status(200).json({
            success: true,
            data: result.rows
          });
        }
      } catch (dbErr) {
        // Fall back
      }

      const topics = aptitudeStore.getTopics(category_id);
      return res.status(200).json({
        success: true,
        data: topics
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/v1/aptitude/questions
  async getQuestions(req, res, next) {
    try {
      const {
        category_id = '',
        topic_id = '',
        difficulty = '',
        search = '',
        limit = 20,
        offset = 0,
        shuffle = false,
        mode = 'practice' // 'practice' reveals answer on request or client side, 'exam' strips answer
      } = req.query;

      const isExamMode = mode === 'exam' || mode === 'timed';

      const result = aptitudeStore.getQuestions({
        categoryId: category_id,
        topicId: topic_id,
        difficulty,
        search,
        limit: Number(limit),
        offset: Number(offset),
        shuffle: shuffle === 'true' || shuffle === true,
        excludeAnswer: isExamMode
      });

      return res.status(200).json({
        success: true,
        data: result.questions,
        total: result.total,
        hasMore: result.hasMore
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/v1/aptitude/questions/:id
  async getQuestionById(req, res, next) {
    try {
      const { id } = req.params;
      const { mode = 'practice' } = req.query;
      const isExamMode = mode === 'exam';

      const q = aptitudeStore.getQuestionById(id, isExamMode);
      if (!q) {
        return next(new AppError('Question not found', 404));
      }

      return res.status(200).json({
        success: true,
        data: q
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/v1/aptitude/mock-tests
  async getMockTests(req, res, next) {
    try {
      try {
        const sql = 'SELECT * FROM public.aptitude_tests WHERE is_published = true ORDER BY created_at ASC';
        const result = await query(sql);
        if (result.rows && result.rows.length > 0) {
          return res.status(200).json({
            success: true,
            data: result.rows
          });
        }
      } catch (dbErr) {
        // Fall back
      }

      const tests = aptitudeStore.getMockTests();
      return res.status(200).json({
        success: true,
        data: tests
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/v1/aptitude/mock-tests/:slug
  async getMockTestBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const test = aptitudeStore.getMockTestBySlug(slug, true); // exclude answers for taking test
      if (!test) {
        return next(new AppError('Mock test not found', 404));
      }

      return res.status(200).json({
        success: true,
        data: test
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/v1/aptitude/daily-challenge
  async getDailyChallenge(req, res, next) {
    try {
      const { date } = req.query;
      const challenge = aptitudeStore.getDailyChallenge(date, false);
      if (!challenge) {
        return next(new AppError('Daily challenge not found', 404));
      }

      return res.status(200).json({
        success: true,
        data: challenge
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/v1/aptitude/achievements
  async getAchievements(req, res, next) {
    try {
      const studentId = req.user?.id || req.query.student_id || null;
      const achievements = aptitudeStore.getAchievements(studentId);

      return res.status(200).json({
        success: true,
        data: achievements
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/v1/aptitude/attempts
  async startAttempt(req, res, next) {
    try {
      const studentId = req.user?.id || req.body.student_id || 'guest';
      const {
        mode = 'practice',
        test_id = null,
        category_id = null,
        topic_id = null,
        total_questions = 10,
        duration_minutes = 15
      } = req.body;

      const attempt = aptitudeStore.startAttempt({
        studentId,
        mode,
        testId: test_id,
        categoryId: category_id,
        topicId: topic_id,
        totalQuestions: total_questions,
        durationMinutes: duration_minutes
      });

      return res.status(201).json({
        success: true,
        data: attempt
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /api/v1/aptitude/attempts/:id/submit
  async submitAttempt(req, res, next) {
    try {
      const { id } = req.params;
      const studentId = req.user?.id || req.body.student_id || 'guest';
      const { answers = [], time_spent_seconds = 0 } = req.body;

      const result = aptitudeStore.submitAttempt({
        attemptId: id,
        studentId,
        answers,
        timeSpentSeconds: time_spent_seconds
      });

      return res.status(200).json({
        success: true,
        data: result
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/v1/aptitude/attempts/:id
  async getAttemptById(req, res, next) {
    try {
      const { id } = req.params;
      const studentId = req.user?.id || null;

      const attempt = aptitudeStore.getAttemptById(id, studentId);
      if (!attempt) {
        return next(new AppError('Attempt report not found', 404));
      }

      return res.status(200).json({
        success: true,
        data: attempt
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/v1/aptitude/history
  async getStudentHistory(req, res, next) {
    try {
      const studentId = req.user?.id || req.query.student_id || 'guest';
      const { mode = '', category_id = '', page = 1, limit = 10 } = req.query;

      const result = aptitudeStore.getAttemptsByStudent(studentId, {
        mode,
        categoryId: category_id,
        page: Number(page),
        limit: Number(limit)
      });

      return res.status(200).json({
        success: true,
        data: result.attempts,
        pagination: {
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages
        }
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /api/v1/aptitude/analytics
  async getStudentAnalytics(req, res, next) {
    try {
      const studentId = req.user?.id || req.query.student_id || 'guest';
      const analytics = aptitudeStore.getStudentAnalytics(studentId);

      return res.status(200).json({
        success: true,
        data: analytics
      });
    } catch (err) {
      next(err);
    }
  },

  // ADMIN ENDPOINTS
  async createQuestion(req, res, next) {
    try {
      const question = aptitudeStore.createQuestion(req.body);
      return res.status(201).json({ success: true, data: question });
    } catch (err) {
      next(err);
    }
  },

  async updateQuestion(req, res, next) {
    try {
      const { id } = req.params;
      const updated = aptitudeStore.updateQuestion(id, req.body);
      if (!updated) return next(new AppError('Question not found', 404));
      return res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  },

  async deleteQuestion(req, res, next) {
    try {
      const { id } = req.params;
      const ok = aptitudeStore.deleteQuestion(id);
      if (!ok) return next(new AppError('Question not found', 404));
      return res.status(200).json({ success: true, message: 'Question deleted' });
    } catch (err) {
      next(err);
    }
  },

  async createMockTest(req, res, next) {
    try {
      const test = aptitudeStore.createMockTest(req.body);
      return res.status(201).json({ success: true, data: test });
    } catch (err) {
      next(err);
    }
  },

  async updateMockTest(req, res, next) {
    try {
      const { id } = req.params;
      const updated = aptitudeStore.updateMockTest(id, req.body);
      if (!updated) return next(new AppError('Mock test not found', 404));
      return res.status(200).json({ success: true, data: updated });
    } catch (err) {
      next(err);
    }
  },

  async deleteMockTest(req, res, next) {
    try {
      const { id } = req.params;
      const ok = aptitudeStore.deleteMockTest(id);
      if (!ok) return next(new AppError('Mock test not found', 404));
      return res.status(200).json({ success: true, message: 'Mock test deleted' });
    } catch (err) {
      next(err);
    }
  }
};

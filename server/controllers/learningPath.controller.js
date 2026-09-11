import { query } from '../config/db.js';
import { AppError } from '../middleware/errorHandler.js';
import { learningPathStore } from '../utils/learningPathStore.js';
import { courseStore } from '../utils/courseStore.js';

export const learningPathController = {
  // GET /learning-paths
  async getLearningPaths(req, res, next) {
    try {
      const {
        search = '',
        category = '',
        difficulty = '',
        sort = 'popular',
        page = 1,
        limit = 12
      } = req.query;

      // 1. Try DB first
      try {
        const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
        const conditions = ["lp.is_published = true"];
        const params = [];
        let paramIdx = 1;

        if (search && search.trim()) {
          conditions.push(`(lp.title ILIKE $${paramIdx} OR lp.description ILIKE $${paramIdx} OR lp.category ILIKE $${paramIdx})`);
          params.push(`%${search.trim()}%`);
          paramIdx++;
        }

        if (category && category.trim() && category !== 'all') {
          conditions.push(`(LOWER(lp.category) = LOWER($${paramIdx}) OR LOWER(REPLACE(lp.category, ' ', '-')) = LOWER($${paramIdx}))`);
          params.push(category.trim());
          paramIdx++;
        }

        if (difficulty && difficulty.trim() && difficulty !== 'all') {
          conditions.push(`lp.difficulty = $${paramIdx}`);
          params.push(difficulty.trim());
          paramIdx++;
        }

        let orderBy = 'lp.enrolled_count DESC';
        if (sort === 'rating' || sort === 'highest-rated') orderBy = 'lp.rating DESC';
        else if (sort === 'newest' || sort === 'latest') orderBy = 'lp.created_at DESC';
        else if (sort === 'courses') orderBy = 'lp.total_courses DESC';
        else if (sort === 'duration') orderBy = 'lp.duration_weeks DESC';

        const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
        const countSql = `SELECT COUNT(lp.id) as total FROM public.learning_paths lp ${whereClause}`;
        const countRes = await query(countSql, params);
        const total = parseInt(countRes.rows[0]?.total || '0', 10);

        if (total > 0) {
          const dataSql = `
            SELECT lp.*
            FROM public.learning_paths lp
            ${whereClause}
            ORDER BY ${orderBy}
            LIMIT $${paramIdx} OFFSET $${paramIdx + 1}
          `;
          params.push(parseInt(limit, 10), offset);
          const dataRes = await query(dataSql, params);

          return res.status(200).json({
            success: true,
            data: dataRes.rows,
            pagination: {
              page: parseInt(page, 10),
              limit: parseInt(limit, 10),
              total,
              totalPages: Math.ceil(total / parseInt(limit, 10))
            }
          });
        }
      } catch (dbErr) {
        // Fall back to JSON store if DB query fails or table not yet migrated
      }

      // 2. Fallback to learningPathStore
      const result = learningPathStore.findAll({
        search,
        category,
        difficulty,
        sort,
        page,
        limit
      });

      return res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /learning-paths/:slug
  async getLearningPathBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const userId = req.user?.id || null;

      let pathItem = null;

      // 1. Try DB
      try {
        const sql = `
          SELECT lp.*,
            COALESCE(
              json_agg(
                json_build_object(
                  'stage_number', lpc.stage_number,
                  'stage_title', lpc.stage_title,
                  'stage_description', lpc.stage_description,
                  'is_milestone', lpc.is_milestone,
                  'courses', json_build_object(
                    'course_id', c.id,
                    'title', c.title,
                    'slug', c.slug,
                    'thumbnail_url', c.thumbnail_url,
                    'duration_hours', c.duration_hours,
                    'level', c.level,
                    'avg_rating', c.average_rating,
                    'price', c.price,
                    'discount_price', c.discount_price
                  )
                ) ORDER BY lpc.stage_number, lpc.sort_order
              ) FILTER (WHERE lpc.id IS NOT NULL),
              '[]'
            ) as stages_flat
          FROM public.learning_paths lp
          LEFT JOIN public.learning_path_courses lpc ON lp.id = lpc.learning_path_id
          LEFT JOIN public.courses c ON lpc.course_id = c.id
          WHERE lp.slug = $1 OR lp.id = $1
          GROUP BY lp.id
        `;
        const dbRes = await query(sql, [slug]);
        if (dbRes.rows.length > 0) {
          pathItem = dbRes.rows[0];
          // Group stages_flat by stage_number if needed
        }
      } catch (dbErr) {
        // DB fallback
      }

      // 2. Fallback to store
      if (!pathItem) {
        pathItem = learningPathStore.findById(slug);
      }

      if (!pathItem) {
        return next(new AppError(404, 'Learning path not found'));
      }

      // Check enrollment if user is logged in
      let enrollment = null;
      if (userId) {
        try {
          const enrollRes = await query(
            'SELECT * FROM public.student_learning_paths WHERE user_id = $1 AND learning_path_id = $2',
            [userId, pathItem.id]
          );
          if (enrollRes.rows.length > 0) {
            enrollment = enrollRes.rows[0];
          }
        } catch (dbErr) {
          // Fallback to store
        }

        if (!enrollment) {
          enrollment = learningPathStore.getStudentPath(userId, pathItem.id);
        }
      }

      return res.status(200).json({
        success: true,
        data: {
          ...pathItem,
          is_enrolled: Boolean(enrollment),
          enrollment: enrollment || null
        }
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /learning-paths/:id/enroll
  async enrollInLearningPath(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return next(new AppError(401, 'Please sign in to enroll in a learning path'));
      }

      let enrollment = null;

      // Try DB
      try {
        const findPath = await query('SELECT id FROM public.learning_paths WHERE id = $1 OR slug = $1', [id]);
        if (findPath.rows.length > 0) {
          const pathId = findPath.rows[0].id;
          const insertSql = `
            INSERT INTO public.student_learning_paths (user_id, learning_path_id, progress_pct, completed_courses, current_stage, status)
            VALUES ($1, $2, 0, '[]'::jsonb, 1, 'in_progress')
            ON CONFLICT (user_id, learning_path_id) DO UPDATE SET updated_at = NOW()
            RETURNING *
          `;
          const enrollRes = await query(insertSql, [userId, pathId]);
          enrollment = enrollRes.rows[0];
          await query('UPDATE public.learning_paths SET enrolled_count = enrolled_count + 1 WHERE id = $1', [pathId]);
        }
      } catch (dbErr) {
        // Fallback to store
      }

      if (!enrollment) {
        enrollment = learningPathStore.enrollStudent(userId, id);
      }

      return res.status(200).json({
        success: true,
        message: 'Successfully enrolled in learning path',
        data: enrollment
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /learning-paths/my/paths
  async getMyLearningPaths(req, res, next) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return next(new AppError(401, 'Unauthorized'));
      }

      // 1. Try DB
      try {
        const sql = `
          SELECT slp.*,
            json_build_object(
              'id', lp.id,
              'slug', lp.slug,
              'title', lp.title,
              'description', lp.description,
              'category', lp.category,
              'difficulty', lp.difficulty,
              'duration_weeks', lp.duration_weeks,
              'estimated_hours', lp.estimated_hours,
              'total_courses', lp.total_courses,
              'rating', lp.rating,
              'banner_url', lp.banner_url,
              'key_skills', lp.key_skills
            ) as learning_paths
          FROM public.student_learning_paths slp
          JOIN public.learning_paths lp ON slp.learning_path_id = lp.id
          WHERE slp.user_id = $1
          ORDER BY slp.updated_at DESC
        `;
        const dbRes = await query(sql, [userId]);
        if (dbRes.rows.length > 0) {
          return res.status(200).json({
            success: true,
            data: dbRes.rows
          });
        }
      } catch (dbErr) {
        // Fallback
      }

      // 2. Fallback to store
      const data = learningPathStore.getStudentPaths(userId);
      return res.status(200).json({
        success: true,
        data
      });
    } catch (err) {
      next(err);
    }
  },

  // PATCH /learning-paths/:id/progress
  async updateStudentProgress(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const { completed_courses, last_accessed_course_id, current_stage } = req.body;

      if (!userId) {
        return next(new AppError(401, 'Unauthorized'));
      }

      let updated = null;

      // Try DB
      try {
        const findPath = await query('SELECT id, total_courses FROM public.learning_paths WHERE id = $1 OR slug = $1', [id]);
        if (findPath.rows.length > 0) {
          const pathId = findPath.rows[0].id;
          const totalCourses = findPath.rows[0].total_courses || 1;
          const completedArr = Array.isArray(completed_courses) ? completed_courses : [];
          const progressPct = Math.min(100, Math.round((completedArr.length / totalCourses) * 100));
          const status = progressPct >= 100 ? 'completed' : 'in_progress';

          const updateSql = `
            UPDATE public.student_learning_paths
            SET completed_courses = $1::jsonb,
                progress_pct = $2,
                status = $3,
                last_accessed_course_id = COALESCE($4, last_accessed_course_id),
                current_stage = COALESCE($5, current_stage),
                updated_at = NOW()
            WHERE user_id = $6 AND learning_path_id = $7
            RETURNING *
          `;
          const dbRes = await query(updateSql, [
            JSON.stringify(completedArr),
            progressPct,
            status,
            last_accessed_course_id || null,
            current_stage || null,
            userId,
            pathId
          ]);
          if (dbRes.rows.length > 0) {
            updated = dbRes.rows[0];
          }
        }
      } catch (dbErr) {
        // Fallback
      }

      if (!updated) {
        updated = learningPathStore.updateStudentProgress(userId, id, {
          completed_courses,
          last_accessed_course_id,
          current_stage
        });
      }

      return res.status(200).json({
        success: true,
        data: updated
      });
    } catch (err) {
      next(err);
    }
  },

  // ADMIN: GET /learning-paths/admin/all
  async adminGetAllLearningPaths(req, res, next) {
    try {
      try {
        const dbRes = await query('SELECT * FROM public.learning_paths ORDER BY created_at DESC');
        if (dbRes.rows.length > 0) {
          return res.status(200).json({
            success: true,
            data: dbRes.rows
          });
        }
      } catch (dbErr) {
        // Fallback
      }

      const paths = learningPathStore.getAll();
      return res.status(200).json({
        success: true,
        data: paths
      });
    } catch (err) {
      next(err);
    }
  },

  // ADMIN: POST /learning-paths
  async createLearningPath(req, res, next) {
    try {
      const data = req.body;
      const created = learningPathStore.create(data);
      return res.status(201).json({
        success: true,
        message: 'Learning path created successfully',
        data: created
      });
    } catch (err) {
      next(err);
    }
  },

  // ADMIN: PATCH /learning-paths/:id
  async updateLearningPath(req, res, next) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const updated = learningPathStore.update(id, updates);
      if (!updated) {
        return next(new AppError(404, 'Learning path not found'));
      }
      return res.status(200).json({
        success: true,
        message: 'Learning path updated successfully',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  },

  // ADMIN: DELETE /learning-paths/:id
  async deleteLearningPath(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = learningPathStore.delete(id);
      if (!deleted) {
        return next(new AppError(404, 'Learning path not found'));
      }
      return res.status(200).json({
        success: true,
        message: 'Learning path deleted successfully'
      });
    } catch (err) {
      next(err);
    }
  }
};

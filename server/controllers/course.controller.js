import { query } from '../config/db.js';
import { AppError } from '../middleware/errorHandler.js';

export const courseController = {
  // GET /courses with DB-level filtering and pagination
  async getCourses(req, res, next) {
    try {
      const {
        search = '',
        category = '',
        level = '',
        minPrice,
        maxPrice,
        isFree,
        sort = 'popular',
        page = 1,
        limit = 12
      } = req.query;

      const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
      const conditions = ["c.status = 'published'"];
      const params = [];
      let paramIdx = 1;

      if (search.trim()) {
        conditions.push(`(c.title ILIKE $${paramIdx} OR c.description ILIKE $${paramIdx})`);
        params.push(`%${search.trim()}%`);
        paramIdx++;
      }

      if (category.trim()) {
        conditions.push(`cat.slug = $${paramIdx}`);
        params.push(category.trim());
        paramIdx++;
      }

      if (level.trim()) {
        conditions.push(`c.level = $${paramIdx}`);
        params.push(level.trim());
        paramIdx++;
      }

      if (isFree === 'true') {
        conditions.push(`c.is_free = true`);
      } else if (minPrice !== undefined || maxPrice !== undefined) {
        if (minPrice !== undefined) {
          conditions.push(`COALESCE(c.discount_price, c.price) >= $${paramIdx}`);
          params.push(parseFloat(minPrice));
          paramIdx++;
        }
        if (maxPrice !== undefined) {
          conditions.push(`COALESCE(c.discount_price, c.price) <= $${paramIdx}`);
          params.push(parseFloat(maxPrice));
          paramIdx++;
        }
      }

      let orderBy = 'c.student_count DESC';
      if (sort === 'highest-rated') orderBy = 'c.avg_rating DESC';
      else if (sort === 'newest') orderBy = 'c.created_at DESC';
      else if (sort === 'price-low') orderBy = 'COALESCE(c.discount_price, c.price) ASC';
      else if (sort === 'price-high') orderBy = 'COALESCE(c.discount_price, c.price) DESC';

      const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

      // Count query
      const countSql = `
        SELECT COUNT(c.id) as total
        FROM public.courses c
        LEFT JOIN public.categories cat ON c.category_id = cat.id
        ${whereClause}
      `;
      const countRes = await query(countSql, params);
      const total = parseInt(countRes.rows[0].total, 10);

      // Data query with joins
      const dataSql = `
        SELECT 
          c.*,
          json_build_object(
            'id', cat.id,
            'name', cat.name,
            'slug', cat.slug
          ) as categories,
          json_build_object(
            'id', t.id,
            'expertise_areas', t.expertise_areas,
            'avg_rating', t.avg_rating,
            'profiles', json_build_object(
              'display_name', p.display_name,
              'first_name', p.first_name,
              'last_name', p.last_name,
              'avatar_url', p.avatar_url
            )
          ) as teachers
        FROM public.courses c
        LEFT JOIN public.categories cat ON c.category_id = cat.id
        LEFT JOIN public.teachers t ON c.teacher_id = t.id
        LEFT JOIN public.profiles p ON t.user_id = p.user_id
        ${whereClause}
        ORDER BY ${orderBy}
        LIMIT $${paramIdx} OFFSET $${paramIdx + 1}
      `;

      params.push(parseInt(limit, 10), offset);
      const dataRes = await query(dataSql, params);

      res.status(200).json({
        success: true,
        data: dataRes.rows,
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total,
          totalPages: Math.ceil(total / parseInt(limit, 10))
        }
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /courses/:id with sections and lessons
  async getCourseById(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      const courseRes = await query(
        `SELECT 
          c.*,
          json_build_object(
            'id', cat.id,
            'name', cat.name,
            'slug', cat.slug
          ) as categories,
          json_build_object(
            'id', t.id,
            'user_id', t.user_id,
            'expertise_areas', t.expertise_areas,
            'biography', t.biography,
            'years_of_experience', t.years_of_experience,
            'avg_rating', t.avg_rating,
            'total_students', t.total_students,
            'total_courses', t.total_courses,
            'profiles', json_build_object(
              'display_name', p.display_name,
              'first_name', p.first_name,
              'last_name', p.last_name,
              'avatar_url', p.avatar_url,
              'bio', p.bio,
              'website', p.website
            )
          ) as teachers
        FROM public.courses c
        LEFT JOIN public.categories cat ON c.category_id = cat.id
        LEFT JOIN public.teachers t ON c.teacher_id = t.id
        LEFT JOIN public.profiles p ON t.user_id = p.user_id
        WHERE c.id = $1`,
        [id]
      );

      if (courseRes.rows.length === 0) {
        throw new AppError('Course not found', 404, 'COURSE_NOT_FOUND');
      }

      const course = courseRes.rows[0];

      // Check enrollment
      let isEnrolled = false;
      if (userId) {
        const enrRes = await query(
          `SELECT id FROM public.enrollments WHERE user_id = $1 AND course_id = $2`,
          [userId, id]
        );
        isEnrolled = enrRes.rows.length > 0;
      }

      const isTeacherOwner = req.user && course.teachers?.user_id === req.user.id;
      const canAccessProtected = isEnrolled || isTeacherOwner || req.user?.isAdmin;

      // Fetch sections and lessons
      const sectionsRes = await query(
        `SELECT * FROM public.course_sections WHERE course_id = $1 ORDER BY sort_order ASC`,
        [id]
      );

      const sections = [];
      for (const sec of sectionsRes.rows) {
        const lessonsRes = await query(
          `SELECT id, section_id, title, lesson_type, duration_minutes, is_preview, sort_order,
                  CASE WHEN is_preview = TRUE OR $2 = TRUE THEN content ELSE NULL END as content,
                  CASE WHEN is_preview = TRUE OR $2 = TRUE THEN video_url ELSE NULL END as video_url
           FROM public.course_lessons 
           WHERE section_id = $1 
           ORDER BY sort_order ASC`,
          [sec.id, canAccessProtected]
        );
        sections.push({
          ...sec,
          course_lessons: lessonsRes.rows
        });
      }

      course.course_sections = sections;
      course.is_enrolled = isEnrolled;

      res.status(200).json({
        success: true,
        data: course
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /courses (Teacher or Admin)
  async createCourse(req, res, next) {
    try {
      const teacherRes = await query(`SELECT id FROM public.teachers WHERE user_id = $1`, [req.user.id]);
      if (teacherRes.rows.length === 0 && !req.user.isAdmin) {
        throw new AppError('You must register as a verified instructor to create courses', 403, 'FORBIDDEN');
      }

      const teacherId = teacherRes.rows[0]?.id;
      const {
        title,
        slug,
        subtitle,
        description,
        categoryId,
        level = 'all_levels',
        price = 0,
        discountPrice,
        isFree = false,
        thumbnailUrl
      } = req.body;

      const insertRes = await query(
        `INSERT INTO public.courses (
          teacher_id, category_id, title, slug, subtitle, description,
          level, price, discount_price, is_free, thumbnail_url, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'draft')
        RETURNING *`,
        [
          teacherId, categoryId, title, slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          subtitle, description, level, price, discountPrice || null, isFree, thumbnailUrl
        ]
      );

      res.status(201).json({
        success: true,
        message: 'Course created successfully',
        data: insertRes.rows[0]
      });
    } catch (err) {
      next(err);
    }
  },

  // PATCH /courses/:id
  async updateCourse(req, res, next) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const allowedFields = [
        'title', 'subtitle', 'description', 'price', 'discount_price',
        'is_free', 'level', 'language', 'thumbnail_url', 'preview_video_url'
      ];

      const setClauses = [];
      const values = [];
      let idx = 1;

      for (const field of allowedFields) {
        if (updates[field] !== undefined) {
          setClauses.push(`${field} = $${idx}`);
          values.push(updates[field]);
          idx++;
        }
      }

      if (setClauses.length === 0) {
        throw new AppError('No valid update fields provided', 400, 'BAD_REQUEST');
      }

      values.push(id);
      const updateSql = `UPDATE public.courses SET ${setClauses.join(', ')}, updated_at = NOW() WHERE id = $${idx} RETURNING *`;
      const result = await query(updateSql, values);

      if (result.rows.length === 0) {
        throw new AppError('Course not found', 404, 'COURSE_NOT_FOUND');
      }

      res.status(200).json({
        success: true,
        message: 'Course updated successfully',
        data: result.rows[0]
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /courses/:id/publish
  async publishCourse(req, res, next) {
    try {
      const { id } = req.params;
      const result = await query(
        `UPDATE public.courses SET status = 'published', is_published = true, published_at = NOW() WHERE id = $1 RETURNING *`,
        [id]
      );
      if (result.rows.length === 0) throw new AppError('Course not found', 404, 'COURSE_NOT_FOUND');

      res.status(200).json({
        success: true,
        message: 'Course published successfully',
        data: result.rows[0]
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /courses/:id/unpublish
  async unpublishCourse(req, res, next) {
    try {
      const { id } = req.params;
      const result = await query(
        `UPDATE public.courses SET status = 'unpublished', is_published = false WHERE id = $1 RETURNING *`,
        [id]
      );
      if (result.rows.length === 0) throw new AppError('Course not found', 404, 'COURSE_NOT_FOUND');

      res.status(200).json({
        success: true,
        message: 'Course unpublished successfully',
        data: result.rows[0]
      });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /courses/:id
  async deleteCourse(req, res, next) {
    try {
      const { id } = req.params;
      const result = await query(`DELETE FROM public.courses WHERE id = $1 RETURNING id`, [id]);
      if (result.rows.length === 0) throw new AppError('Course not found', 404, 'COURSE_NOT_FOUND');

      res.status(200).json({
        success: true,
        message: 'Course deleted successfully'
      });
    } catch (err) {
      next(err);
    }
  }
};

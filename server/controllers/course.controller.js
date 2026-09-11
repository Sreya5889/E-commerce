import { query } from '../config/db.js';
import { AppError } from '../middleware/errorHandler.js';
import { courseStore } from '../utils/courseStore.js';

export const courseController = {
  // GET /courses with DB-level filtering and pagination, falling back to courseStore
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

      // 1. Try DB first if available
      try {
        const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);
        const conditions = ["c.status = 'published'"];
        const params = [];
        let paramIdx = 1;

        if (search.trim()) {
          conditions.push(`(c.title ILIKE $${paramIdx} OR c.subtitle ILIKE $${paramIdx} OR c.description ILIKE $${paramIdx} OR cat.name ILIKE $${paramIdx} OR p.display_name ILIKE $${paramIdx})`);
          params.push(`%${search.trim()}%`);
          paramIdx++;
        }

        if (category.trim() && category !== 'all') {
          conditions.push(`(cat.slug = $${paramIdx} OR cat.name ILIKE $${paramIdx})`);
          params.push(category.trim());
          paramIdx++;
        }

        if (level.trim() && level !== 'all') {
          conditions.push(`c.level = $${paramIdx}`);
          params.push(level.trim());
          paramIdx++;
        }

        if (isFree === 'true') {
          conditions.push(`c.is_free = true`);
        } else if (minPrice !== undefined || maxPrice !== undefined) {
          if (minPrice !== undefined && minPrice !== '') {
            conditions.push(`COALESCE(c.discount_price, c.price) >= $${paramIdx}`);
            params.push(parseFloat(minPrice));
            paramIdx++;
          }
          if (maxPrice !== undefined && maxPrice !== '') {
            conditions.push(`COALESCE(c.discount_price, c.price) <= $${paramIdx}`);
            params.push(parseFloat(maxPrice));
            paramIdx++;
          }
        }

        let orderBy = 'c.student_count DESC';
        if (sort === 'highest-rated' || sort === 'rating') orderBy = 'c.average_rating DESC';
        else if (sort === 'newest' || sort === 'latest') orderBy = 'c.created_at DESC';
        else if (sort === 'price-low') orderBy = 'COALESCE(c.discount_price, c.price) ASC';
        else if (sort === 'price-high') orderBy = 'COALESCE(c.discount_price, c.price) DESC';

        const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

        const countSql = `
          SELECT COUNT(c.id) as total
          FROM public.courses c
          LEFT JOIN public.categories cat ON c.category_id = cat.id
          LEFT JOIN public.teachers t ON COALESCE(c.instructor_id, c.teacher_id) = t.id
          LEFT JOIN public.profiles p ON t.user_id = p.user_id
          ${whereClause}
        `;
        const countRes = await query(countSql, params);
        const total = parseInt(countRes.rows[0]?.total || '0', 10);

        if (total > 0) {
          const dataSql = `
            SELECT 
              c.*,
              c.average_rating as avg_rating,
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
            LEFT JOIN public.teachers t ON COALESCE(c.instructor_id, c.teacher_id) = t.id
            LEFT JOIN public.profiles p ON t.user_id = p.user_id
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
        console.warn('[CourseController] DB courses query offline or empty, falling back to courseStore:', dbErr.message);
      }

      // 2. Fallback to courseStore
      const result = courseStore.findAll({
        search,
        category,
        level,
        minPrice,
        maxPrice,
        isFree,
        sort,
        page,
        limit
      });

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination
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

      // 1. Try DB
      try {
        const courseRes = await query(
          `SELECT 
            c.*,
            c.average_rating as avg_rating,
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
          LEFT JOIN public.teachers t ON COALESCE(c.instructor_id, c.teacher_id) = t.id
          LEFT JOIN public.profiles p ON t.user_id = p.user_id
          WHERE c.id = $1 OR c.slug = $1`,
          [id]
        );

        if (courseRes.rows.length > 0) {
          const course = courseRes.rows[0];

          // Check enrollment
          let isEnrolled = false;
          if (userId) {
            try {
              const enrRes = await query(
                `SELECT id FROM public.enrollments WHERE user_id = $1 AND course_id = $2`,
                [userId, course.id]
              );
              isEnrolled = enrRes.rows.length > 0;
            } catch {}
          }

          const isTeacherOwner = req.user && course.teachers?.user_id === req.user.id;
          const canAccessProtected = isEnrolled || isTeacherOwner || req.user?.isAdmin;

          // Fetch sections and lessons
          try {
            const sectionsRes = await query(
              `SELECT * FROM public.course_sections WHERE course_id = $1 ORDER BY sort_order ASC`,
              [course.id]
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
          } catch {}

          course.is_enrolled = isEnrolled;
          return res.status(200).json({
            success: true,
            data: course
          });
        }
      } catch (dbErr) {
        console.warn('[CourseController] DB getCourseById failed or DB offline, using local store:', dbErr.message);
      }

      // 2. Fallback to courseStore
      const localCourse = courseStore.findById(id);
      if (!localCourse) {
        throw new AppError('Course not found', 404, 'COURSE_NOT_FOUND');
      }

      res.status(200).json({
        success: true,
        data: localCourse
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /courses (Teacher or Admin)
  async createCourse(req, res, next) {
    try {
      const courseData = req.body;
      let dbCourse = null;

      try {
        const teacherRes = await query(`SELECT id FROM public.teachers WHERE user_id = $1`, [req.user?.id]);
        if (teacherRes.rows.length === 0 && !req.user?.isAdmin) {
          throw new AppError('You must register as a verified instructor to create courses', 403, 'FORBIDDEN');
        }

        const teacherId = teacherRes.rows[0]?.id || null;
        const {
          title,
          slug,
          subtitle,
          description,
          categoryId,
          category_id,
          level = 'all_levels',
          price = 0,
          discountPrice,
          discount_price,
          isFree = false,
          is_free = false,
          thumbnailUrl,
          thumbnail_url
        } = courseData;

        const insertRes = await query(
          `INSERT INTO public.courses (
            instructor_id, category_id, title, slug, subtitle, description,
            level, price, discount_price, is_free, thumbnail_url, status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 'published')
          RETURNING *`,
          [
            teacherId,
            categoryId || category_id,
            title,
            slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            subtitle,
            description,
            level,
            Number(price),
            discountPrice !== undefined ? Number(discountPrice) : (discount_price !== undefined ? Number(discount_price) : null),
            Boolean(isFree || is_free),
            thumbnailUrl || thumbnail_url
          ]
        );
        dbCourse = insertRes.rows[0];
      } catch (dbErr) {
        if (dbErr instanceof AppError) throw dbErr;
        console.warn('[CourseController] DB insert failed, saving to local store:', dbErr.message);
      }

      // Always persist to courseStore as well
      const savedCourse = courseStore.create({
        ...courseData,
        id: dbCourse?.id || undefined
      });

      res.status(201).json({
        success: true,
        message: 'Course created successfully',
        data: dbCourse || savedCourse
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

      try {
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

        if (setClauses.length > 0) {
          values.push(id);
          const updateSql = `UPDATE public.courses SET ${setClauses.join(', ')}, updated_at = NOW() WHERE id = $${idx} RETURNING *`;
          await query(updateSql, values);
        }
      } catch (dbErr) {
        console.warn('[CourseController] DB update failed, falling back to courseStore:', dbErr.message);
      }

      const updated = courseStore.update(id, updates);
      if (!updated) {
        throw new AppError('Course not found', 404, 'COURSE_NOT_FOUND');
      }

      res.status(200).json({
        success: true,
        message: 'Course updated successfully',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /courses/:id/publish
  async publishCourse(req, res, next) {
    try {
      const { id } = req.params;
      try {
        await query(
          `UPDATE public.courses SET status = 'published', is_published = true, published_at = NOW() WHERE id = $1 RETURNING *`,
          [id]
        );
      } catch {}

      const updated = courseStore.update(id, { status: 'published', is_published: true });
      if (!updated) throw new AppError('Course not found', 404, 'COURSE_NOT_FOUND');

      res.status(200).json({
        success: true,
        message: 'Course published successfully',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /courses/:id/unpublish
  async unpublishCourse(req, res, next) {
    try {
      const { id } = req.params;
      try {
        await query(
          `UPDATE public.courses SET status = 'unpublished', is_published = false WHERE id = $1 RETURNING *`,
          [id]
        );
      } catch {}

      const updated = courseStore.update(id, { status: 'unpublished', is_published: false });
      if (!updated) throw new AppError('Course not found', 404, 'COURSE_NOT_FOUND');

      res.status(200).json({
        success: true,
        message: 'Course unpublished successfully',
        data: updated
      });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /courses/:id
  async deleteCourse(req, res, next) {
    try {
      const { id } = req.params;
      try {
        await query(`DELETE FROM public.courses WHERE id = $1 RETURNING id`, [id]);
      } catch {}

      const deleted = courseStore.delete(id);
      if (!deleted) throw new AppError('Course not found', 404, 'COURSE_NOT_FOUND');

      res.status(200).json({
        success: true,
        message: 'Course deleted successfully'
      });
    } catch (err) {
      next(err);
    }
  }
};

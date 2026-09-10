import { query } from '../config/db.js';
import { AppError } from '../middleware/errorHandler.js';

export const adminController = {
  // GET /admin/stats: Real database aggregation
  async getDashboardStats(req, res, next) {
    try {
      const statsRes = await query(`
        SELECT 
          (SELECT COUNT(*) FROM auth.users) as total_users,
          (SELECT COUNT(*) FROM public.user_roles ur JOIN public.roles r ON ur.role_id = r.id WHERE r.name = 'student') as total_students,
          (SELECT COUNT(*) FROM public.teachers WHERE verification_status = 'approved') as total_teachers,
          (SELECT COUNT(*) FROM public.courses) as total_courses,
          (SELECT COUNT(*) FROM public.orders WHERE status = 'completed') as total_orders,
          (SELECT COALESCE(SUM(total), 0) FROM public.orders WHERE status = 'completed') as total_revenue,
          (SELECT COALESCE(SUM(total), 0) FROM public.orders WHERE status = 'completed' AND created_at >= NOW() - INTERVAL '30 days') as monthly_revenue,
          (SELECT COUNT(*) FROM public.teachers WHERE verification_status = 'pending') as pending_verifications
      `);

      res.status(200).json({
        success: true,
        data: statsRes.rows[0]
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /admin/users: List platform users with profiles and roles
  async getUsers(req, res, next) {
    try {
      const usersRes = await query(`
        SELECT 
          p.user_id as id,
          p.first_name,
          p.last_name,
          p.display_name,
          p.avatar_url,
          p.created_at,
          p.is_active,
          ARRAY_AGG(DISTINCT r.name) as roles
        FROM public.profiles p
        LEFT JOIN public.user_roles ur ON p.user_id = ur.user_id
        LEFT JOIN public.roles r ON ur.role_id = r.id
        GROUP BY p.user_id, p.first_name, p.last_name, p.display_name, p.avatar_url, p.created_at, p.is_active
        ORDER BY p.created_at DESC
        LIMIT 100
      `);

      res.status(200).json({
        success: true,
        data: usersRes.rows
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /admin/courses: List all courses (including drafts, pending)
  async getAllCourses(req, res, next) {
    try {
      const coursesRes = await query(`
        SELECT 
          c.*,
          cat.name as category_name,
          tp.display_name as teacher_name
        FROM public.courses c
        LEFT JOIN public.categories cat ON c.category_id = cat.id
        LEFT JOIN public.teachers t ON c.teacher_id = t.id
        LEFT JOIN public.profiles tp ON t.user_id = tp.user_id
        ORDER BY c.created_at DESC
      `);

      res.status(200).json({
        success: true,
        data: coursesRes.rows
      });
    } catch (err) {
      next(err);
    }
  },

  // PATCH /admin/courses/:id/status
  async updateCourseStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ['draft', 'under_review', 'published', 'unpublished', 'archived'];
      if (!validStatuses.includes(status)) {
        throw new AppError('Invalid course status', 400, 'INVALID_STATUS');
      }

      const result = await query(
        `UPDATE public.courses SET status = $1, is_published = ($1 = 'published'), updated_at = NOW() WHERE id = $2 RETURNING *`,
        [status, id]
      );

      if (result.rows.length === 0) throw new AppError('Course not found', 404, 'NOT_FOUND');

      res.status(200).json({
        success: true,
        message: `Course status updated to ${status}`,
        data: result.rows[0]
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /admin/teachers: List teachers with verification requests
  async getTeachers(req, res, next) {
    try {
      const result = await query(`
        SELECT t.*, p.first_name, p.last_name, p.display_name, p.avatar_url
        FROM public.teachers t
        JOIN public.profiles p ON t.user_id = p.user_id
        ORDER BY t.created_at DESC
      `);

      res.status(200).json({
        success: true,
        data: result.rows
      });
    } catch (err) {
      next(err);
    }
  },

  // PATCH /admin/teachers/:id/verify
  async verifyTeacher(req, res, next) {
    try {
      const { id } = req.params;
      const { status, rejectionReason } = req.body;

      const result = await query(
        `UPDATE public.teachers 
         SET verification_status = $1, 
             verification_badge = ($1 = 'approved'),
             verified_at = CASE WHEN $1 = 'approved' THEN NOW() ELSE NULL END,
             rejection_reason = $2,
             updated_at = NOW()
         WHERE id = $3
         RETURNING *`,
        [status, rejectionReason || null, id]
      );

      if (result.rows.length === 0) throw new AppError('Teacher record not found', 404, 'NOT_FOUND');

      res.status(200).json({
        success: true,
        message: `Teacher verification status updated to ${status}`,
        data: result.rows[0]
      });
    } catch (err) {
      next(err);
    }
  }
};

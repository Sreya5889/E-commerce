import { query } from '../config/db.js';
import { AppError } from '../middleware/errorHandler.js';

export const certificateController = {
  // GET /certificates: Student's certificates
  async getUserCertificates(req, res, next) {
    try {
      const result = await query(
        `SELECT 
          cert.*,
          json_build_object(
            'id', c.id,
            'title', c.title,
            'slug', c.slug,
            'thumbnail_url', c.thumbnail_url
          ) as course
         FROM public.certificates cert
         JOIN public.courses c ON cert.course_id = c.id
         WHERE cert.user_id = $1
         ORDER BY cert.issued_at DESC`,
        [req.user.id]
      );

      res.status(200).json({
        success: true,
        data: result.rows
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /certificates/verify/:certificateNumber (Public verification endpoint)
  async verifyCertificate(req, res, next) {
    try {
      const { certificateNumber } = req.params;

      const result = await query(
        `SELECT 
          cert.id,
          cert.certificate_number,
          cert.issued_at,
          p.display_name as student_name,
          c.title as course_title,
          tp.display_name as instructor_name
         FROM public.certificates cert
         JOIN public.profiles p ON cert.user_id = p.user_id
         JOIN public.courses c ON cert.course_id = c.id
         LEFT JOIN public.teachers t ON c.teacher_id = t.id
         LEFT JOIN public.profiles tp ON t.user_id = tp.user_id
         WHERE cert.certificate_number = $1`,
        [certificateNumber.trim()]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          verified: false,
          message: 'Certificate not found or invalid'
        });
      }

      res.status(200).json({
        success: true,
        verified: true,
        data: result.rows[0]
      });
    } catch (err) {
      next(err);
    }
  }
};

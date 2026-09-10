import { query } from '../config/db.js';
import { AppError } from '../middleware/errorHandler.js';

export const categoryController = {
  async getCategories(req, res, next) {
    try {
      const result = await query(
        `SELECT c.*, COUNT(crs.id) as course_count
         FROM public.categories c
         LEFT JOIN public.courses crs ON c.id = crs.category_id AND crs.status = 'published'
         WHERE c.is_active = TRUE
         GROUP BY c.id
         ORDER BY c.sort_order ASC, c.name ASC`
      );
      res.status(200).json({
        success: true,
        data: result.rows
      });
    } catch (err) {
      next(err);
    }
  },

  async getCategoryBySlug(req, res, next) {
    try {
      const { slug } = req.params;
      const result = await query(`SELECT * FROM public.categories WHERE slug = $1`, [slug]);
      if (result.rows.length === 0) throw new AppError('Category not found', 404, 'NOT_FOUND');

      const subRes = await query(`SELECT * FROM public.subcategories WHERE category_id = $1`, [result.rows[0].id]);
      res.status(200).json({
        success: true,
        data: {
          ...result.rows[0],
          subcategories: subRes.rows
        }
      });
    } catch (err) {
      next(err);
    }
  }
};

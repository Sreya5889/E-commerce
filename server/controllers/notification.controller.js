import { query } from '../config/db.js';

export const notificationController = {
  async getNotifications(req, res, next) {
    try {
      const result = await query(
        `SELECT * FROM public.notifications 
         WHERE user_id = $1 
         ORDER BY created_at DESC 
         LIMIT 50`,
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

  async markAsRead(req, res, next) {
    try {
      const { id } = req.params;
      const result = await query(
        `UPDATE public.notifications 
         SET is_read = TRUE 
         WHERE id = $1 AND user_id = $2 
         RETURNING *`,
        [id, req.user.id]
      );

      res.status(200).json({
        success: true,
        data: result.rows[0]
      });
    } catch (err) {
      next(err);
    }
  },

  async markAllAsRead(req, res, next) {
    try {
      await query(
        `UPDATE public.notifications 
         SET is_read = TRUE 
         WHERE user_id = $1`,
        [req.user.id]
      );

      res.status(200).json({
        success: true,
        message: 'All notifications marked as read'
      });
    } catch (err) {
      next(err);
    }
  }
};

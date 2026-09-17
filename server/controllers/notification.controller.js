import { query } from '../config/db.js';
import { notificationStore } from '../utils/notificationStore.js';

export const notificationController = {
  async getNotifications(req, res, next) {
    const userId = req.user?.id || 'demo-student-id';
    try {
      const result = await query(
        `SELECT * FROM public.notifications 
         WHERE user_id = $1 
         ORDER BY created_at DESC 
         LIMIT 50`,
        [userId]
      );

      res.status(200).json({
        success: true,
        data: result.rows
      });
    } catch (err) {
      // Dual-engine fallback
      const data = notificationStore.getUserNotifications(userId);
      res.status(200).json({
        success: true,
        data
      });
    }
  },

  async markAsRead(req, res, next) {
    const userId = req.user?.id || 'demo-student-id';
    const { id } = req.params;
    try {
      const result = await query(
        `UPDATE public.notifications 
         SET is_read = TRUE 
         WHERE id = $1 AND user_id = $2 
         RETURNING *`,
        [id, userId]
      );

      res.status(200).json({
        success: true,
        data: result.rows[0]
      });
    } catch (err) {
      const notif = notificationStore.markAsRead(userId, id);
      res.status(200).json({
        success: true,
        data: notif
      });
    }
  },

  async markAllAsRead(req, res, next) {
    const userId = req.user?.id || 'demo-student-id';
    try {
      await query(
        `UPDATE public.notifications 
         SET is_read = TRUE 
         WHERE user_id = $1`,
        [userId]
      );

      res.status(200).json({
        success: true,
        message: 'All notifications marked as read'
      });
    } catch (err) {
      notificationStore.markAllAsRead(userId);
      res.status(200).json({
        success: true,
        message: 'All notifications marked as read'
      });
    }
  }
};

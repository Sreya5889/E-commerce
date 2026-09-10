import { query } from '../config/db.js';
import { AppError } from '../middleware/errorHandler.js';

export const faqController = {
  async getFAQs(req, res, next) {
    try {
      const result = await query(
        `SELECT * FROM public.faq WHERE is_published = TRUE ORDER BY sort_order ASC, created_at DESC`
      );
      res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
      next(err);
    }
  },

  async getAllFAQs(req, res, next) {
    try {
      const result = await query(`SELECT * FROM public.faq ORDER BY sort_order ASC, created_at DESC`);
      res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
      next(err);
    }
  },

  async createFAQ(req, res, next) {
    try {
      const { question, answer, category = 'General', sortOrder = 0 } = req.body;
      const result = await query(
        `INSERT INTO public.faq (question, answer, category, sort_order, is_published)
         VALUES ($1, $2, $3, $4, TRUE) RETURNING *`,
        [question, answer, category, sortOrder]
      );
      res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
      next(err);
    }
  },

  async deleteFAQ(req, res, next) {
    try {
      const { id } = req.params;
      const result = await query(`DELETE FROM public.faq WHERE id = $1 RETURNING id`, [id]);
      if (result.rows.length === 0) throw new AppError('FAQ not found', 404, 'NOT_FOUND');
      res.status(200).json({ success: true, message: 'FAQ deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
};

export const contactController = {
  async submitMessage(req, res, next) {
    try {
      const { name, email, subject, message, phone } = req.body;
      const result = await query(
        `INSERT INTO public.contact_messages (name, email, subject, message, phone)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [name, email, subject, message, phone || null]
      );
      res.status(201).json({ success: true, message: 'Message submitted successfully', data: result.rows[0] });
    } catch (err) {
      next(err);
    }
  },

  async getMessages(req, res, next) {
    try {
      const result = await query(`SELECT * FROM public.contact_messages ORDER BY created_at DESC`);
      res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
      next(err);
    }
  },

  async resolveMessage(req, res, next) {
    try {
      const { id } = req.params;
      const result = await query(
        `UPDATE public.contact_messages SET status = 'resolved', updated_at = NOW() WHERE id = $1 RETURNING *`,
        [id]
      );
      if (result.rows.length === 0) throw new AppError('Message not found', 404, 'NOT_FOUND');
      res.status(200).json({ success: true, data: result.rows[0] });
    } catch (err) {
      next(err);
    }
  }
};

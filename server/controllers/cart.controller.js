import { query } from '../config/db.js';
import { AppError } from '../middleware/errorHandler.js';

export const cartController = {
  // GET /cart: Calculates authoritative totals server-side
  async getCart(req, res, next) {
    try {
      const userId = req.user.id;
      const { couponCode } = req.query;

      const cartRes = await query(
        `SELECT 
          c.id as cart_item_id,
          c.quantity,
          crs.id as course_id,
          crs.title,
          crs.price,
          crs.discount_price,
          crs.thumbnail_url,
          crs.slug,
          json_build_object(
            'display_name', p.display_name,
            'first_name', p.first_name,
            'last_name', p.last_name
          ) as instructor
         FROM public.cart c
         JOIN public.courses crs ON c.course_id = crs.id
         LEFT JOIN public.teachers t ON crs.teacher_id = t.id
         LEFT JOIN public.profiles p ON t.user_id = p.user_id
         WHERE c.user_id = $1`,
        [userId]
      );

      const items = cartRes.rows;
      let subtotal = 0;

      for (const item of items) {
        const effectivePrice = item.discount_price !== null && Number(item.discount_price) < Number(item.price)
          ? Number(item.discount_price)
          : Number(item.price);
        subtotal += effectivePrice * item.quantity;
      }

      let discount = 0;
      let appliedCoupon = null;

      if (couponCode) {
        const couponRes = await query(
          `SELECT * FROM public.coupons 
           WHERE code = $1 AND is_active = TRUE AND (expires_at IS NULL OR expires_at > NOW()) AND starts_at <= NOW()`,
          [couponCode.toUpperCase()]
        );

        if (couponRes.rows.length > 0) {
          const coup = couponRes.rows[0];
          if (subtotal >= Number(coup.minimum_order_amount)) {
            if (coup.discount_type === 'percentage') {
              discount = (subtotal * Number(coup.discount_value)) / 100;
              if (coup.maximum_discount && discount > Number(coup.maximum_discount)) {
                discount = Number(coup.maximum_discount);
              }
            } else {
              discount = Number(coup.discount_value);
            }
            appliedCoupon = {
              code: coup.code,
              discountType: coup.discount_type,
              discountValue: coup.discount_value
            };
          }
        }
      }

      const taxableAmount = Math.max(0, subtotal - discount);
      const taxRate = 0.05; // 5% standard tax
      const tax = Number((taxableAmount * taxRate).toFixed(2));
      const total = Number((taxableAmount + tax).toFixed(2));

      res.status(200).json({
        success: true,
        data: {
          items,
          summary: {
            itemCount: items.length,
            subtotal: Number(subtotal.toFixed(2)),
            discount: Number(discount.toFixed(2)),
            tax,
            total,
            coupon: appliedCoupon
          }
        }
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /cart/items
  async addToCart(req, res, next) {
    try {
      const userId = req.user.id;
      const { courseId } = req.body;

      // Check if course exists and is published
      const courseRes = await query(`SELECT id, status FROM public.courses WHERE id = $1`, [courseId]);
      if (courseRes.rows.length === 0 || courseRes.rows[0].status !== 'published') {
        throw new AppError('Course is not available for purchase', 400, 'COURSE_UNAVAILABLE');
      }

      // Check if user is already enrolled
      const enrRes = await query(`SELECT id FROM public.enrollments WHERE user_id = $1 AND course_id = $2`, [userId, courseId]);
      if (enrRes.rows.length > 0) {
        throw new AppError('You are already enrolled in this course', 400, 'ALREADY_ENROLLED');
      }

      const result = await query(
        `INSERT INTO public.cart (user_id, course_id, quantity)
         VALUES ($1, $2, 1)
         ON CONFLICT (user_id, course_id) DO UPDATE SET quantity = cart.quantity
         RETURNING *`,
        [userId, courseId]
      );

      res.status(201).json({
        success: true,
        message: 'Course added to cart',
        data: result.rows[0]
      });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /cart/items/:courseId
  async removeFromCart(req, res, next) {
    try {
      const userId = req.user.id;
      const { courseId } = req.params;

      await query(`DELETE FROM public.cart WHERE user_id = $1 AND course_id = $2`, [userId, courseId]);

      res.status(200).json({
        success: true,
        message: 'Item removed from cart'
      });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /cart
  async clearCart(req, res, next) {
    try {
      await query(`DELETE FROM public.cart WHERE user_id = $1`, [req.user.id]);
      res.status(200).json({
        success: true,
        message: 'Cart cleared successfully'
      });
    } catch (err) {
      next(err);
    }
  }
};

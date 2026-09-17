import { query } from '../config/db.js';
import { AppError } from '../middleware/errorHandler.js';

export const couponController = {
  // POST /coupons/validate
  async validateCoupon(req, res, next) {
    try {
      const { code, cartSubtotal = 0 } = req.body;
      const subtotal = Number(cartSubtotal);

      const result = await query(
        `SELECT * FROM public.coupons 
         WHERE code = $1 AND is_active = TRUE`,
        [code.toUpperCase()]
      );

      if (result.rows.length === 0) {
        throw new AppError('Invalid or inactive coupon code', 400, 'INVALID_COUPON');
      }

      const coupon = result.rows[0];
      const now = new Date();

      if (coupon.starts_at && new Date(coupon.starts_at) > now) {
        throw new AppError('This coupon is not yet active', 400, 'COUPON_NOT_STARTED');
      }

      if (coupon.expires_at && new Date(coupon.expires_at) < now) {
        throw new AppError('This coupon has expired', 400, 'COUPON_EXPIRED');
      }

      if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
        throw new AppError('This coupon has reached its maximum usage limit', 400, 'USAGE_LIMIT_REACHED');
      }

      if (subtotal < Number(coupon.minimum_order_amount)) {
        throw new AppError(
          `Minimum order amount of ₹${Math.round(Number(coupon.minimum_order_amount)).toLocaleString('en-IN')} required to use this coupon`,
          400,
          'MIN_ORDER_NOT_MET'
        );
      }

      let discountAmount = 0;
      if (coupon.discount_type === 'percentage') {
        discountAmount = (subtotal * Number(coupon.discount_value)) / 100;
        if (coupon.maximum_discount && discountAmount > Number(coupon.maximum_discount)) {
          discountAmount = Number(coupon.maximum_discount);
        }
      } else {
        discountAmount = Number(coupon.discount_value);
      }

      res.status(200).json({
        success: true,
        message: 'Coupon is valid',
        data: {
          id: coupon.id,
          code: coupon.code,
          discountType: coupon.discount_type,
          discountValue: coupon.discount_value,
          discountAmount: Number(discountAmount.toFixed(2))
        }
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /coupons (Admin list)
  async getCoupons(req, res, next) {
    try {
      const result = await query(`SELECT * FROM public.coupons ORDER BY created_at DESC`);
      res.status(200).json({
        success: true,
        data: result.rows
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /coupons (Admin create)
  async createCoupon(req, res, next) {
    try {
      const {
        code,
        description,
        discountType,
        discountValue,
        minimumOrderAmount = 0,
        maximumDiscount,
        usageLimit,
        expiresAt
      } = req.body;

      const result = await query(
        `INSERT INTO public.coupons (
          code, description, discount_type, discount_value, minimum_order_amount,
          maximum_discount, usage_limit, expires_at, is_active
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE)
        RETURNING *`,
        [
          code.toUpperCase(), description, discountType, discountValue,
          minimumOrderAmount, maximumDiscount || null, usageLimit || null, expiresAt || null
        ]
      );

      res.status(201).json({
        success: true,
        message: 'Coupon created successfully',
        data: result.rows[0]
      });
    } catch (err) {
      next(err);
    }
  },

  // DELETE /coupons/:id (Admin delete)
  async deleteCoupon(req, res, next) {
    try {
      const { id } = req.params;
      const result = await query(`DELETE FROM public.coupons WHERE id = $1 RETURNING id`, [id]);
      if (result.rows.length === 0) throw new AppError('Coupon not found', 404, 'NOT_FOUND');

      res.status(200).json({
        success: true,
        message: 'Coupon deleted successfully'
      });
    } catch (err) {
      next(err);
    }
  }
};

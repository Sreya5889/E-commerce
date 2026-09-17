import { query, getTransactionClient } from '../config/db.js';
import { AppError } from '../middleware/errorHandler.js';

export const orderController = {
  // POST /orders (Atomic checkout with transaction)
  async createOrder(req, res, next) {
    const userId = req.user.id;
    const { couponCode } = req.body;
    const { client, query: tQuery, release } = await getTransactionClient();

    try {
      await tQuery('BEGIN');

      // 1. Fetch user cart items
      const cartRes = await tQuery(
        `SELECT c.course_id, crs.title, crs.price, crs.discount_price, crs.teacher_id
         FROM public.cart c
         JOIN public.courses crs ON c.course_id = crs.id
         WHERE c.user_id = $1`,
        [userId]
      );

      if (cartRes.rows.length === 0) {
        throw new AppError('Cannot create an order with an empty cart.', 400, 'CART_EMPTY');
      }

      // 2. Server-side authoritative pricing
      let subtotal = 0;
      const orderItems = [];

      for (const item of cartRes.rows) {
        const unitPrice = Number(item.price);
        const finalPrice = item.discount_price !== null && Number(item.discount_price) < unitPrice
          ? Number(item.discount_price)
          : unitPrice;
        const discount = unitPrice - finalPrice;

        subtotal += finalPrice;
        orderItems.push({
          courseId: item.course_id,
          teacherId: item.teacher_id,
          title: item.title,
          unitPrice,
          discount,
          finalPrice
        });
      }

      // 3. Coupon validation & application
      let discountAmount = 0;
      let couponId = null;

      if (couponCode) {
        const coupRes = await tQuery(
          `SELECT * FROM public.coupons 
           WHERE code = $1 AND is_active = TRUE AND (expires_at IS NULL OR expires_at > NOW()) AND starts_at <= NOW()
           FOR UPDATE`,
          [couponCode.toUpperCase()]
        );

        if (coupRes.rows.length > 0) {
          const coup = coupRes.rows[0];
          if (subtotal >= Number(coup.minimum_order_amount)) {
            couponId = coup.id;
            if (coup.discount_type === 'percentage') {
              discountAmount = (subtotal * Number(coup.discount_value)) / 100;
              if (coup.maximum_discount && discountAmount > Number(coup.maximum_discount)) {
                discountAmount = Number(coup.maximum_discount);
              }
            } else {
              discountAmount = Number(coup.discount_value);
            }
          }
        }
      }

      const netAmount = Math.max(0, subtotal - discountAmount);
      const taxRate = 0.05;
      const tax = Number((netAmount * taxRate).toFixed(2));
      const total = Number((netAmount + tax).toFixed(2));
      const orderNumber = `EDU-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

      // 4. Create Order Record
      const orderRes = await tQuery(
        `INSERT INTO public.orders (
          user_id, order_number, subtotal, discount, tax, total, currency,
          coupon_id, status, payment_status
        ) VALUES ($1, $2, $3, $4, $5, $6, 'INR', $7, 'pending', 'pending')
        RETURNING *`,
        [userId, orderNumber, subtotal, discountAmount, tax, total, couponId]
      );

      const newOrder = orderRes.rows[0];

      // 5. Insert Order Items
      for (const item of orderItems) {
        await tQuery(
          `INSERT INTO public.order_items (
            order_id, course_id, instructor_id, course_title, unit_price, discount, final_price
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [newOrder.id, item.courseId, item.teacherId, item.title, item.unitPrice, item.discount, item.finalPrice]
        );
      }

      await tQuery('COMMIT');

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: {
          orderId: newOrder.id,
          orderNumber: newOrder.order_number,
          subtotal: newOrder.subtotal,
          discount: newOrder.discount,
          tax: newOrder.tax,
          total: newOrder.total,
          status: newOrder.status,
          paymentStatus: newOrder.payment_status,
          itemCount: orderItems.length
        }
      });
    } catch (err) {
      await tQuery('ROLLBACK');
      next(err);
    } finally {
      release();
    }
  },

  // GET /orders: User order history
  async getOrders(req, res, next) {
    try {
      const ordersRes = await query(
        `SELECT o.*, json_agg(oi.*) as items
         FROM public.orders o
         LEFT JOIN public.order_items oi ON o.id = oi.order_id
         WHERE o.user_id = $1
         GROUP BY o.id
         ORDER BY o.created_at DESC`,
        [req.user.id]
      );

      res.status(200).json({
        success: true,
        data: ordersRes.rows
      });
    } catch (err) {
      next(err);
    }
  },

  // GET /orders/:id
  async getOrderById(req, res, next) {
    try {
      const { id } = req.params;
      const orderRes = await query(
        `SELECT o.*, json_agg(oi.*) as items
         FROM public.orders o
         LEFT JOIN public.order_items oi ON o.id = oi.order_id
         WHERE o.id = $1 AND (o.user_id = $2 OR $3 = TRUE)
         GROUP BY o.id`,
        [id, req.user.id, req.user.isAdmin]
      );

      if (orderRes.rows.length === 0) {
        throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
      }

      res.status(200).json({
        success: true,
        data: orderRes.rows[0]
      });
    } catch (err) {
      next(err);
    }
  },

  // POST /orders/:id/cancel
  async cancelOrder(req, res, next) {
    try {
      const { id } = req.params;
      const result = await query(
        `UPDATE public.orders 
         SET status = 'cancelled', updated_at = NOW() 
         WHERE id = $1 AND user_id = $2 AND status = 'pending'
         RETURNING *`,
        [id, req.user.id]
      );

      if (result.rows.length === 0) {
        throw new AppError('Order cannot be cancelled or was not found', 400, 'CANNOT_CANCEL');
      }

      res.status(200).json({
        success: true,
        message: 'Order cancelled successfully',
        data: result.rows[0]
      });
    } catch (err) {
      next(err);
    }
  }
};

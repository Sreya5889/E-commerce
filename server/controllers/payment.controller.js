import { query, getTransactionClient } from '../config/db.js';
import { AppError } from '../middleware/errorHandler.js';

export const paymentController = {
  // POST /payments/process: Initiates simulated/live checkout payment session
  async processPayment(req, res, next) {
    try {
      const { orderId, paymentMethod = 'credit_card', paymentDetails = {} } = req.body;
      const userId = req.user.id;

      // Verify order exists and belongs to user
      const orderRes = await query(
        `SELECT * FROM public.orders WHERE id = $1 AND user_id = $2 AND status = 'pending'`,
        [orderId, userId]
      );

      if (orderRes.rows.length === 0) {
        throw new AppError('Order not found or is already processed', 400, 'INVALID_ORDER');
      }

      const order = orderRes.rows[0];
      const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      // Execute atomic transaction for payment confirmation
      const { client, query: tQuery, release } = await getTransactionClient();
      try {
        await tQuery('BEGIN');

        // 1. Create Payment record
        await tQuery(
          `INSERT INTO public.payments (
            order_id, user_id, payment_method, payment_gateway, transaction_id,
            amount, currency, status, gateway_response
          ) VALUES ($1, $2, $3, 'stripe_simulator', $4, $5, $6, 'succeeded', $7)`,
          [order.id, userId, paymentMethod, transactionId, order.total, order.currency, JSON.stringify(paymentDetails)]
        );

        // 2. Update Order status
        await tQuery(
          `UPDATE public.orders 
           SET status = 'completed', payment_status = 'succeeded', updated_at = NOW() 
           WHERE id = $1`,
          [order.id]
        );

        // 3. Fetch order items to enroll student
        const itemsRes = await tQuery(
          `SELECT course_id FROM public.order_items WHERE order_id = $1`,
          [order.id]
        );

        for (const item of itemsRes.rows) {
          // Create Enrollment
          await tQuery(
            `INSERT INTO public.enrollments (user_id, course_id, order_id, progress_percentage, completed)
             VALUES ($1, $2, $3, 0.00, false)
             ON CONFLICT (user_id, course_id) DO NOTHING`,
            [userId, item.course_id, order.id]
          );

          // Increment course student count
          await tQuery(
            `UPDATE public.courses SET student_count = student_count + 1 WHERE id = $1`,
            [item.course_id]
          );
        }

        // 4. Clear user's cart
        await tQuery(`DELETE FROM public.cart WHERE user_id = $1`, [userId]);

        // 5. Create notification
        await tQuery(
          `INSERT INTO public.notifications (user_id, title, message, type)
           VALUES ($1, 'Order Confirmed!', 'Thank you for your purchase. Your courses are now unlocked in your dashboard.', 'order_success')`,
          [userId]
        );

        // 6. Record analytics event
        await tQuery(
          `INSERT INTO public.analytics_events (event_type, user_id, metadata)
           VALUES ('payment_success', $1, $2)`,
          [userId, JSON.stringify({ orderId: order.id, total: order.total, transactionId })]
        );

        await tQuery('COMMIT');

        res.status(200).json({
          success: true,
          message: 'Payment processed successfully',
          data: {
            orderId: order.id,
            transactionId,
            status: 'completed',
            paymentStatus: 'succeeded',
            amountPaid: order.total
          }
        });
      } catch (err) {
        await tQuery('ROLLBACK');
        throw err;
      } finally {
        release();
      }
    } catch (err) {
      next(err);
    }
  },

  // POST /payments/webhook: Idempotent gateway webhook listener
  async handleWebhook(req, res, next) {
    try {
      const { event, data } = req.body;
      const transactionId = data?.transactionId || data?.id;

      if (!transactionId) {
        return res.status(400).json({ success: false, message: 'Missing transaction identifier' });
      }

      // Check idempotency: Has this transaction already been recorded?
      const existingPay = await query(
        `SELECT id FROM public.payments WHERE transaction_id = $1`,
        [transactionId]
      );

      if (existingPay.rows.length > 0) {
        return res.status(200).json({ success: true, message: 'Webhook already processed (idempotent)' });
      }

      res.status(200).json({ success: true, message: 'Webhook received' });
    } catch (err) {
      next(err);
    }
  }
};

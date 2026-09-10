import { Router } from 'express';
import { z } from 'zod';
import { orderController } from '../controllers/order.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const createOrderSchema = {
  body: z.object({
    couponCode: z.string().optional().nullable()
  })
};

router.use(requireAuth);

router.post('/', validate(createOrderSchema), orderController.createOrder);
router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderById);
router.post('/:id/cancel', orderController.cancelOrder);

export default router;

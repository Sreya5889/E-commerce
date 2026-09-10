import { Router } from 'express';
import { z } from 'zod';
import { paymentController } from '../controllers/payment.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const processPaymentSchema = {
  body: z.object({
    orderId: z.string().uuid('Invalid order ID'),
    paymentMethod: z.string().default('credit_card'),
    paymentDetails: z.record(z.any()).optional()
  })
};

router.post('/process', requireAuth, validate(processPaymentSchema), paymentController.processPayment);
router.post('/webhook', paymentController.handleWebhook);

export default router;

import { Router } from 'express';
import { z } from 'zod';
import { cartController } from '../controllers/cart.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const addToCartSchema = {
  body: z.object({
    courseId: z.string().uuid('Invalid course ID')
  })
};

router.use(requireAuth);

router.get('/', cartController.getCart);
router.post('/items', validate(addToCartSchema), cartController.addToCart);
router.delete('/items/:courseId', cartController.removeFromCart);
router.delete('/', cartController.clearCart);

export default router;

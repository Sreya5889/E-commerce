import { Router } from 'express';
import { z } from 'zod';
import { couponController } from '../controllers/coupon.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const validateCouponSchema = {
  body: z.object({
    code: z.string().min(1, 'Coupon code is required'),
    cartSubtotal: z.number().min(0).default(0)
  })
};

const createCouponSchema = {
  body: z.object({
    code: z.string().min(2, 'Code must be at least 2 characters'),
    description: z.string().optional(),
    discountType: z.enum(['percentage', 'fixed']),
    discountValue: z.number().min(0.01, 'Discount value must be greater than 0'),
    minimumOrderAmount: z.number().min(0).optional(),
    maximumDiscount: z.number().min(0).optional().nullable(),
    usageLimit: z.number().int().min(1).optional().nullable(),
    expiresAt: z.string().optional().nullable()
  })
};

router.post('/validate', validate(validateCouponSchema), couponController.validateCoupon);
router.get('/', requireAuth, requireAdmin, couponController.getCoupons);
router.post('/', requireAuth, requireAdmin, validate(createCouponSchema), couponController.createCoupon);
router.delete('/:id', requireAuth, requireAdmin, couponController.deleteCoupon);

export default router;

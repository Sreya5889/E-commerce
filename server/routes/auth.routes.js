import { Router } from 'express';
import { z } from 'zod';
import { authController } from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const registerSchema = {
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    fullName: z.string().min(2, 'Full name is required'),
    role: z.enum(['student', 'teacher']).optional()
  })
};

const loginSchema = {
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
  })
};

const forgotPasswordSchema = {
  body: z.object({
    email: z.string().email('Invalid email address')
  })
};

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.get('/me', requireAuth, authController.me);
router.post('/logout', requireAuth, authController.logout);
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);

export default router;

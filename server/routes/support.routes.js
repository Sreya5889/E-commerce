import { Router } from 'express';
import { z } from 'zod';
import { faqController, contactController } from '../controllers/support.controller.js';
import { requireAuth } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/rbac.js';
import { validate } from '../middleware/validate.js';

const router = Router();

const contactSchema = {
  body: z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email'),
    subject: z.string().min(2, 'Subject is required'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
    phone: z.string().optional().nullable()
  })
};

const createFaqSchema = {
  body: z.object({
    question: z.string().min(5, 'Question is required'),
    answer: z.string().min(5, 'Answer is required'),
    category: z.string().optional(),
    sortOrder: z.number().int().optional()
  })
};

// FAQ routes
router.get('/faq', faqController.getFAQs);
router.get('/faq/all', requireAuth, requireAdmin, faqController.getAllFAQs);
router.post('/faq', requireAuth, requireAdmin, validate(createFaqSchema), faqController.createFAQ);
router.delete('/faq/:id', requireAuth, requireAdmin, faqController.deleteFAQ);

// Contact messages routes
router.post('/contact', validate(contactSchema), contactController.submitMessage);
router.get('/contact', requireAuth, requireAdmin, contactController.getMessages);
router.patch('/contact/:id/resolve', requireAuth, requireAdmin, contactController.resolveMessage);

export default router;

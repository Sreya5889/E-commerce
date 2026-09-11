import { Router } from 'express';
import { interviewController } from '../controllers/interview.controller.js';

const router = Router();

router.get('/categories', interviewController.getCategories);
router.get('/questions', interviewController.getQuestions);
router.get('/questions/:id', interviewController.getQuestionById);
router.get('/plans', interviewController.getPlans);

export default router;

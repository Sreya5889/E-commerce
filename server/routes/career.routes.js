import { Router } from 'express';
import { careerController } from '../controllers/career.controller.js';

const router = Router();

router.get('/readiness', careerController.getReadiness);
router.get('/recommendations', careerController.getRecommendations);
router.get('/skill-gap', careerController.getSkillGapAnalysis);
router.get('/study-plan', careerController.getStudyPlan);
router.post('/study-plan', careerController.generateStudyPlan);
router.patch('/study-plan/:planId/tasks/:taskId', careerController.toggleStudyPlanTask);

export default router;

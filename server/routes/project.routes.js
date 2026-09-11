import { Router } from 'express';
import { projectController } from '../controllers/project.controller.js';

const router = Router();

router.get('/', projectController.getAll);
router.get('/my/projects', projectController.getUserProjects);
router.get('/:slug', projectController.getBySlug);
router.patch('/:id/progress', projectController.updateProjectProgress);

export default router;

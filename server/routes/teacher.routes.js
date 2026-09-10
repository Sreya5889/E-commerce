import { Router } from 'express';
import { teacherController } from '../controllers/teacher.controller.js';

const router = Router();

router.get('/', teacherController.getTeachers);
router.get('/:id', teacherController.getTeacherById);

export default router;

import { Router } from 'express';
import { jobController } from '../controllers/job.controller.js';

const router = Router();

router.get('/', jobController.getAll);
router.get('/bookmarks', jobController.getBookmarks);
router.get('/applications', jobController.getApplications);
router.get('/:slug', jobController.getBySlug);
router.post('/:id/bookmark', jobController.toggleBookmark);
router.post('/:id/apply', jobController.apply);

export default router;

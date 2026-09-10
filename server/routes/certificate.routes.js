import { Router } from 'express';
import { certificateController } from '../controllers/certificate.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, certificateController.getUserCertificates);
router.get('/verify/:certificateNumber', certificateController.verifyCertificate);

export default router;

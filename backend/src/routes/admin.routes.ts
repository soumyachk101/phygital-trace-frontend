import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/stats', requireAuth, AdminController.getStats);
router.post('/certificates/:id/retry', requireAuth, AdminController.retryCertificate);

export default router;

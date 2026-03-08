import { Router } from 'express';
import authRoutes from './auth.routes';
import certificateRoutes from './certificate.routes';
import verifyRoutes from './verify.routes';
import profileRoutes from './profile.routes';
import webhookRoutes from './webhook.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/certificates', certificateRoutes);
router.use('/verify', verifyRoutes);
router.use('/profiles', profileRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/admin', adminRoutes);

export default router;

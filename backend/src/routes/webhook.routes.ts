import { Router } from 'express';
import { WebhookController } from '../controllers/webhook.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.post('/', requireAuth, WebhookController.create);
router.get('/', requireAuth, WebhookController.list);

export default router;

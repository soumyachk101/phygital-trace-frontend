import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { updateProfileSchema } from '../schemas/profile.schema';

const router = Router();

router.get('/:handle', ProfileController.getPublicProfile);
router.put('/me', requireAuth, validate(updateProfileSchema), ProfileController.updateProfile);

export default router;

import { Router } from 'express';
import { CertificateController } from '../controllers/certificate.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.post('/', requireAuth, upload.single('image'), CertificateController.create);
router.get('/', requireAuth, CertificateController.list);
router.get('/:id', CertificateController.getById);

export default router;

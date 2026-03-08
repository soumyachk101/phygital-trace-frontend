import { Router } from 'express';
import { VerifyController } from '../controllers/verify.controller';
import { validate } from '../middleware/validate.middleware';
import { verifyByHashSchema, batchVerifySchema } from '../schemas/verify.schema';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.post('/hash', validate(verifyByHashSchema), VerifyController.verifyByHash);
router.post('/upload', upload.single('image'), VerifyController.verifyByUpload);
router.post('/batch', validate(batchVerifySchema), VerifyController.batchVerify);

export default router;

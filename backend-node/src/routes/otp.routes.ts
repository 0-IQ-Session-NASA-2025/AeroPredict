import { Router } from 'express';
import { OtpController } from '../controllers/otp.controller';

const router: Router = Router();

router.post('/send', OtpController.send);
router.post('/verify', OtpController.verify);

export default router;

import { Router } from 'express';
import { NotificationController } from '../../controllers/v1/notification.controller';

const router: Router = Router();

router.post('/register-token', NotificationController.storeFcmtoken);
router.post('/send-bulk', NotificationController.sendBulkNotification);

export default router;

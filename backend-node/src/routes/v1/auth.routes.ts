import { AuthController } from './../../controllers/v1/auth.controller';
import { Router } from 'express';

const router: Router = Router();

router.post('/register', AuthController.Register);
router.post('/login', AuthController.login);
router.post('/google-login', AuthController.googleLogin);
router.post('/reset-password', AuthController.resetPassword);

export default router;

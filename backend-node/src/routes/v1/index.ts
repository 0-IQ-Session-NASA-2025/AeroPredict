import express from 'express';
import otpRouter from './otp.routes';
import publicRouter from './public.routes';
import authRouter from './auth.routes';

const router = express.Router();

// v1 API routes
router.use('/otp', otpRouter);
router.use('/public', publicRouter);
router.use('/user/auth', authRouter);

export default router;
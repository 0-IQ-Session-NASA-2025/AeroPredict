import express from 'express';
import otpRouter from './otp.routes';
import publicRouter from './public.routes'

const router = express.Router();

// v1 API routes
router.use('/otp', otpRouter);
router.use('/public', publicRouter);

export default router;
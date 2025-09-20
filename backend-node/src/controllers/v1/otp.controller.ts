import { Request, Response } from 'express';
import { getCache, deleteCache, setCache } from '../../lib/redis';
import { genHash } from '../../utils/crypto';
import { otpSender } from '../../services/otp.service';
import { Logger } from '../../utils/logger';
import { ResponseHandler } from '../../utils/response';

const logger = Logger.getInstance();

export class OtpController {

    static async send(req: Request, res: Response): Promise<void> {
        try {
            logger.info('---------> OTP Send <---------')
            const { email } = req.body;
            const cachedResult = await getCache(genHash(email));

            if (cachedResult.value !== null) {
                ResponseHandler.success(res, { otpSent: false }, 'OTP already sent');
                return;
            }

            await otpSender(email);

            ResponseHandler.created(res, { otpSent: true }, 'OTP sent successfully');
        } catch (e) {
            ResponseHandler.internalError(res, 'Failed to send OTP', (e as Error).message);
        }
    }

    static async verify(req: Request, res: Response): Promise<void> {
        try {
            logger.info('------> OTP Verify <------');
            const { email, otp } = req.body;
            const cachedResult = await getCache(genHash(email));

            if (!cachedResult.value || cachedResult.value !== otp) {
                ResponseHandler.badRequest(res, 'Invalid or expired OTP', 'OTP verification failed');
                return;
            }

            await deleteCache(genHash(email));
            ResponseHandler.success(res, { isVerified: true, email }, 'OTP verified successfully');
        } catch (e) {
            ResponseHandler.internalError(res, 'OTP verification failed', (e as Error).message);
        }
    }
}
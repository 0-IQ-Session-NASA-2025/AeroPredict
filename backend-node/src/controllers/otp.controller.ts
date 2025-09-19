import { Request, Response } from 'express';
import { getCache, deleteCache, setCache } from '../lib/redis';
import { genHash } from '../utils/crypto';
import { otpSender } from '../services/otp.service';
import { Logger } from '../utils/logger';
const logger = Logger.getInstance();

export class OtpController {

    static async send(req: Request, res: Response): Promise<void> {
        try {
            logger.info('---------> OTP Send <---------')
            const { email } = req.body;
            const cachedResult = await getCache(genHash(email));

            if (cachedResult.value !== null) {
                     res
                    .status(200)
                    .send({ message: 'OTP already sent', otpSent: false });
                    return;
            }

            await otpSender(email);

            res.status(201).send({ message: 'OTP sent', otpSent: true });
        } catch (e) {
            res.status(500).send({ error: (e as Error).message, otpSent: false });
        }
    }

    static async verify(req: Request, res: Response): Promise<void> {
        try {
            console.log('------> OTP Verify <------');
            const { email, otp } = req.body;
            const cachedResult = await getCache(genHash(email));
            if (!cachedResult.value || cachedResult.value !== otp) {
                res.status(200).send({ isVerified: false });
                return;
            }
            await deleteCache(genHash(email));
            res.status(200).send({ isVerified: true, email });
        } catch (e) {
            res.status(500).send({ message: (e as Error).message });
        }
    }
}
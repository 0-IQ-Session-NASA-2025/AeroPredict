import mailSender from '../utils/mail-sender';
import { setCache } from '../lib/redis';
import { genHash } from '../utils/crypto';
import validator from 'validator';

export const otpGen = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();

};

export const otpSender = async (email: string): Promise<void> => {
    const otp = otpGen();
    if (!validator.isEmail(email)) {
        throw new Error("Invalid Email");
    }
    mailSender(email, otp);
    console.log("=========>", otp)
    await setCache(genHash(email), otp, 120);
};




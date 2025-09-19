import { createTransport, Transporter } from 'nodemailer';

interface MailOptions {
    from: string;
    to: string;
    subject: string;
    html: string;
    text: string;
}

const mailSender = async (email: string, otp: string): Promise<void> => {
    const transport: Transporter = createTransport({
        service: "gmail",
        auth: {
            user: process.env.mail as string,
            pass: process.env.pass as string,
        },
    });

    const mailOptions: MailOptions = {
        from: `E-Shop`,
        to: email,
        subject: 'E-Shop 2FA Code',
        text: `${otp} is your email authentication code`,
        html: `<p><strong>${otp}</strong> is your email authentication code</p>`
    };

    const result = await transport.sendMail(mailOptions);
    return result;
};

export default mailSender;

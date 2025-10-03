import { createTransport, Transporter } from 'nodemailer';
import { Resend } from 'resend';

interface MailOptions {
    from: string;
    to: string;
    subject: string;
    html: string;
    text: string;
}

// const mailSender = async (email: string, otp: string): Promise<void> => {
//     // const transport: Transporter = createTransport({
//     //     service: "gmail",
//     //     auth: {
//     //         user: process.env.mail as string,
//     //         pass: process.env.pass as string,
//     //     },
//     // });

//     let transport: Transporter = createTransport({
//         host: 'smtp.gmail.com',
//         port: 587,
//         secure: false,
//         auth: {
//             user: process.env.mail as string,
//             pass: process.env.pass as string,
//         },
//         tls: {
//             rejectUnauthorized: false,
//             ciphers: 'SSLv3'
//         },
//         connectionTimeout: 60000,
//         greetingTimeout: 30000,
//         socketTimeout: 60000,
//         debug: true, // Enable debug logs
//         logger: true
//     });

//     const mailOptions: MailOptions = {
//         from: `Aero-Predict`,
//         to: email,
//         subject: 'Aero-Predict 2FA Code',
//         text: `${otp} is your email authentication code`,
//         html: `<p><strong>${otp}</strong> is your email authentication code</p>`
//     };

//     await transport.verify();
//     console.log('SMTP connection verified');
//     const result = await transport.sendMail(mailOptions);
//     return result;
// };


const resend = new Resend(process.env.RESEND_API_KEY);

const mailSender = async (email: string, otp: string): Promise<void> => {
    try {
        const result = await resend.emails.send({
            from: 'onboarding@resend.dev', // You need a domain: Aero-Predict <noreply@aeropredict.com>
            to: email,
            subject: 'Aero-Predict 2FA Code',
            html: `<p><strong>${otp}</strong> is your email authentication code</p>`,
        });
        console.log('Email sent:', result);
        // return result;
    } catch (error) {
        console.error('Resend error:', error);
        throw error;
    }
};

export default mailSender;

import nodemailer, { Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

export let emailSender: Transporter;
export async function setUpNodemailer(): Promise<void> {
    emailSender = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: +process.env.SMTP_HOST || 587,
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
        },
    });
}

export function sendEmail(to: string, subject: string, html: string): void {
    const mailOptions = {
        from: '"Skeptic Letters" <discussion@skepticletters.com>',
        to: to,
        subject: subject,
        html: html,
    } as Mail.Options;

    emailSender.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });
}
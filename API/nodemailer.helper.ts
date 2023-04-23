import nodemailer, { Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

export let emailSender: Transporter;
export async function setUpNodemailer(): Promise<void> {
    emailSender = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: 587,
        auth: {
            user: process.env.SMTP_USERNAME,
            pass: process.env.SMTP_PASSWORD,
        },
    });
}

export function sendEmail(stringListTo: string, subject: string, html: string): void {
    const listTo = stringListTo.split(','); 

    for (let to of listTo) {
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
}
import { success, badRequest, internalServerError } from "@/lib/utils/response";
import nodemailer from 'nodemailer';

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, subject, text } = body;

        if (!email || !subject || !text) {
            return badRequest('Email, subject et text sont requis.');
        }

        // Vérifier si les credentials SMTP sont configurés
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS || 
            process.env.SMTP_USER === 'your-email@gmail.com' || 
            process.env.SMTP_PASS === 'your-app-password') {
            console.warn('Email non envoyé : credentials SMTP non configurés');
            return success({ 
                message: 'Email non envoyé (service SMTP non configuré)', 
                configured: false 
            });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: subject,
            text: text
        };

        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        
        return success({ message: 'Email envoyé avec succès' });
    } catch (error) {
        console.error('Error sending email:', error);
        // Retourner un succès même en cas d'erreur pour ne pas bloquer le processus
        return success({ 
            message: 'Email non envoyé (erreur SMTP)', 
            configured: false 
        });
    }
}

import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';

export async function PUT(request) {

    const body = await request.json()
    const { subject, text, to, promoCode } = body

    console.log("body : ", { subject, text, to, promoCode })
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
            port: process.env.SMTP_PORT
        }
    });
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: to,
        subject: subject,
        html: text + "<br/>TON CODE : " + promoCode
    };
    const send = await transporter.sendMail(mailOptions);
    if (send) {
        const code = await prisma.newsletter.updateMany({
            where: { email: { in: to } },
            data: {
                promoCode: promoCode,
                promoCodeUsed: false,
                subscribed_at: new Date(),
            }
        });
        return NextResponse.json({ succes: true });
    } 
    else {
        return NextResponse.json({ succes: false })
    }

}


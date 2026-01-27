import nodemailer from 'nodemailer';

export async function sendEmailRegister(toEmail,subject,  text, url) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    service: "Gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
    const info = await transporter.sendMail({
    from: `"No Reply" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: subject,
    text: `${text}\n\n${url}`,
  });
}

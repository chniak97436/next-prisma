import nodemailer from 'nodemailer';

export async function sendEmailRegister(toEmail, subject, text, url) {
  console.log("sendEmailRegister - Received params:", { toEmail, subject, text, url });
  
  // Handle undefined values - convert to empty string
  const safeText = text || '';
  const safeUrl = url || '';
  
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
  
  const mailText = safeUrl ? `${safeText}\n\n${safeUrl}` : safeText;
  
  const info = await transporter.sendMail({
    from: `"No Reply" <${process.env.SMTP_USER}>`,
    to: toEmail,
    subject: subject,
    text: mailText,
  });
  console.log("Email sent successfully, ID:", info.messageId);
}

import { prisma } from '@/lib/prisma';
import { success } from '@/lib/utils/response';
import { sendEmailRegister } from '@/lib/utils/sendEmailRegister';

export async function POST(req){
  //AUTH SMTP GMAIL
    const from = process.env.SMTP_USER
    const auth = process.env.SMTP_AUTH
    const pass = process.env.SMTP_PASS
    const port = process.env.SMTP_PORT

    const body = await req.json()
    console.log("API Route - Received body:", body)
    
    // Handle both 'text' and 'message' field names for compatibility
    const { to, subject, text, message } = body
    
    // Use text if available, otherwise use message, otherwise default to empty string
    const messageText = text || message || ''
    
    console.log("API Route - Extracted values:", {to, subject, text: messageText})

    await sendEmailRegister(to, subject, messageText)
    
    return success({ message: 'Newsletter sent successfully' })
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { success } from '@/lib/utils/response';
import { sendEmailRegister } from '@/lib/utils/sendEmailRegister';

// GET - Récupérer un abonné par ID
export async function GET(request) {
  try {
    const { searchParams = new URL(request.url).searchParams } = request;
    const id = searchParams.get('id');

    // Also check if ID is passed directly in the URL path
    const urlParts = request.url.split('/');
    const urlId = urlParts[urlParts.length - 1];

    const subscriberId = id || urlId;

    if (!subscriberId || subscriberId === 'send') {
      return NextResponse.json({ message: 'ID requis' }, { status: 400 });
    }

    const subscriber = await prisma.newsletter.findUnique({
      where: { id: parseInt(subscriberId) }
    });

    if (!subscriber) {
      return NextResponse.json({ message: 'Abonné non trouvé' }, { status: 404 });
    }

    return NextResponse.json({ newsletter: subscriber }, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'abonné:', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(req){
  //AUTH SMTP GMAIL
    const from = process.env.SMTP_USER
    const auth = process.env.SMTP_AUTH
    const pass = process.env.SMTP_PASS
    const port = process.env.SMTP_PORT

    const body = await req.json()
    console.log("API Route - Received body:", body)
    
    //  'text' et 'message' champs  for compatibility
    const { to, subject, text, message } = body
    
    // Use text si vrai, ou use message,  default vide string
    const messageText = text || message || ''
    
    console.log("API Route - Extracted values:", {to, subject, text: messageText})

    await sendEmailRegister(to, subject, messageText)
    
    return success({ message: 'Newsletter sent successfully' })
}

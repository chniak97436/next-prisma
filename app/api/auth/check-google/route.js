import { getGoogleAuthURL } from '@/lib/googleAuth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const authURL = getGoogleAuthURL();
    
    return NextResponse.json({
      status: 'ok',
      nextAuthUrl: process.env.NEXTAUTH_URL,
      redirectUri: `${process.env.NEXTAUTH_URL}/api/auth/google-callback`,
      googleClientId: process.env.GOOGLE_CLIENT_ID ? 'présent' : 'manquant',
      googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ? 'présent' : 'manquant',
      authURL: authURL,
      message: "Cette URL doit correspondre exactement à celle configurée dans Google Cloud Console"
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error.message
    }, { status: 500 });
  }
}
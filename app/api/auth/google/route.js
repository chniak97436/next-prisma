import { getGoogleAuthURL } from '@/lib/googleAuth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('=== DÉBUT AUTH GOOGLE ===');
    
    const authURL = getGoogleAuthURL();
    console.log('Redirection vers:', authURL.substring(0, 100) + '...');
    
    return NextResponse.redirect(authURL);
  } catch (error) {
    console.error('Erreur génération URL Google:', error);
    return NextResponse.redirect(new URL('/login?error=google_config_error', request.url));
  }
}
import { getGoogleUser } from '@/lib/googleAuth';
import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function GET(request) {
  console.log('=== CALLBACK GOOGLE DÉBUT ===');
  console.log('URL reçue:', request.url);

  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    console.error('Erreur Google:', error);
    return NextResponse.redirect(new URL(`/login?error=google_${error}`, request.url));
  }

  if (!code) {
    console.log('Pas de code dans l\'URL');
    return NextResponse.redirect(new URL('/login?error=no_code', request.url));
  }

  try {
    console.log('Code reçu (longueur):', code.length);

    // Récupérer l'utilisateur Google
    const googleUser = await getGoogleUser(code);
    console.log('Utilisateur Google récupéré:', googleUser.email);

    // Trouver ou créer l'utilisateur dans la base de données locale
    let localUser = await prisma.user.findUnique({
      where: { email: googleUser.email }
    });

    if (!localUser) {
      // Créer un nouvel utilisateur
      console.log('Création nouvel utilisateur:', googleUser.email);
      localUser = await prisma.user.create({
        data: {
          email: googleUser.email,
          username: googleUser.name || googleUser.email.split('@')[0],
          password_hash: 'google_oauth_' + googleUser.googleId, // Mot de passe factice pour OAuth
          first_name: googleUser.name ? googleUser.name.split(' ')[0] : null,
          last_name: googleUser.name && googleUser.name.includes(' ') 
            ? googleUser.name.split(' ').slice(1).join(' ') 
            : null
         
        }
      });
      console.log('Utilisateur créé avec ID:', localUser.id);
    } else {
      console.log('Utilisateur existant trouvé avec ID:', localUser.id);
    }

    // Vérifier si l'utilisateur est admin
    const isAdmin = localUser.role === 'admin';
    console.log('Rôle attribué:', isAdmin ? 'admin' : 'user');

    // Créer le token JWT avec l'ID local de la base de données
    const token = await new SignJWT({
      userId: localUser.id, // Utiliser l'ID local de la DB (integer)
      email: localUser.email,
      name: googleUser.name,
      role: isAdmin ? 'admin' : 'user'
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .sign(JWT_SECRET);

    console.log('Token JWT créé avec succès');

    // Rediriger vers admin avec toutes les infos
    const redirectUrl = new URL('/admin', request.url);
    redirectUrl.searchParams.set('token', token);
    redirectUrl.searchParams.set('email', localUser.email);
    redirectUrl.searchParams.set('name', googleUser.name || '');
    redirectUrl.searchParams.set('role', isAdmin ? 'admin' : 'user');

    console.log('Redirection vers admin avec rôle:', isAdmin ? 'admin' : 'user');
    return NextResponse.redirect(redirectUrl);

  } catch (error) {
    console.error('Erreur callback Google:', error);
    return NextResponse.redirect(new URL('/login?error=google_auth_failed', request.url));
  }
}

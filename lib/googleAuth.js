// Fonction pour générer l'URL d'authentification Google
export function getGoogleAuthURL() {
  const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/google-callback`;
  
  console.log('Generating Google Auth URL with:', {
    redirectUri,
    clientId: process.env.GOOGLE_CLIENT_ID?.substring(0, 10) + '...'
  });

  const options = {
    redirect_uri: redirectUri,
    client_id: process.env.GOOGLE_CLIENT_ID,
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
  };

  const qs = new URLSearchParams(options);
  return `${rootUrl}?${qs.toString()}`;
}

// Fonction pour échanger le code contre les infos utilisateur
export async function getGoogleUser(code) {
  console.log('Getting Google user with code:', code.substring(0, 20) + '...');
  
  const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/google-callback`;
  
  // Échanger le code contre des tokens
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  if (!tokenResponse.ok) {
    const error = await tokenResponse.text();
    throw new Error(`Token exchange failed: ${error}`);
  }

  const tokens = await tokenResponse.json();

  if (!tokens.access_token) {
    throw new Error('No access token received');
  }

  // Récupérer les infos utilisateur
  const userResponse = await fetch(
    'https://www.googleapis.com/oauth2/v2/userinfo',
    {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    }
  );

  if (!userResponse.ok) {
    throw new Error('Failed to get user info');
  }

  const user = await userResponse.json();

  return {
    googleId: user.id,
    email: user.email,
    name: user.name,
    picture: user.picture,
    emailVerified: user.verified_email,
  };
}

// Optionnel : fonction utilitaire pour rafraîchir le token
export async function refreshGoogleToken(refreshToken) {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      grant_type: 'refresh_token',
    }),
  });

  return response.json();
}
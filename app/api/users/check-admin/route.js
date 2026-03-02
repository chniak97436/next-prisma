import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email } = await request.json();
    
    // Liste des admins (vous pouvez aussi vérifier dans votre DB)
    const adminEmails = [
      'urbaniak.n78@gmail.com',
      // Ajoutez d'autres emails admin ici
    ];
    
    const isAdmin = adminEmails.includes(email);
    
    return NextResponse.json({ isAdmin });
    
  } catch (error) {
    console.error('Error checking admin:', error);
    return NextResponse.json({ isAdmin: false }, { status: 500 });
  }
}

// Optionnel: permettre GET pour tester
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  
  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 });
  }
  
  const adminEmails = ['urbaniak.n78@gmail.com'];
  const isAdmin = adminEmails.includes(email);
  
  return NextResponse.json({ isAdmin });
}
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Récupérer un abonné par ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ message: 'ID requis' }, { status: 400 });
    }

    const subscriber = await prisma.newsletter.findUnique({
      where: { id: parseInt(id) }
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


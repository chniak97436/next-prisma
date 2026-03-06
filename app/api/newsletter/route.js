import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Récupérer tous les abonnés actifs
export async function GET() {
 
  try {
    const subscribers = await prisma.newsletter.findMany();
    
    return NextResponse.json({ data: subscribers }, { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération des abonnés:', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

// POST - Ajouter un nouvel abonné
export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ message: 'Email requis' }, { status: 400 });
    }

    // Vérifier si l'email existe déjà
    const existingSubscriber = await prisma.newsletter.findUnique({
      where: { email }
    });

    if (existingSubscriber) {
      return NextResponse.json({ message: 'Vous êtes déjà abonné. Bien essayé...' }, { status: 409 });
    }
    // Créer un nouvel abonné
    const newSubscriber = await prisma.newsletter.create({
      data: { email }
    });

    return NextResponse.json({ newSubscriber, message: 'Abonnement créé avec succès' }, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

// DELETE - Se désabonner
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ message: 'Email requis' }, { status: 400 });
    }

    const subscriber = await prisma.newsletter.findUnique({
      where: { email }
    });

    if (!subscriber) {
      return NextResponse.json({ message: 'Abonné non trouvé' }, { status: 404 });
    }

    // Désactiver l'abonnement
    const updatedSubscriber = await prisma.newsletter.update({
      where: { email },
      data: { is_active: false, unsubscribed_at: new Date() }
    });

    return NextResponse.json({ data: updatedSubscriber, message: 'Désabonnement réussi' }, { status: 200 });
  } catch (error) {
    console.error('Erreur lors du désabonnement:', error);
    return NextResponse.json({ message: 'Erreur serveur' }, { status: 500 });
  }
}

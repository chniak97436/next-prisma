import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';



// POST - Créer des éléments de commande
export async function POST(request) {
  try {
    const body = await request.json();
    const { comandeId, productId, productQuantite, priceUnique, totalAmount } = body;

    if (!comandeId || !productId || !productQuantite || !priceUnique) {
      return NextResponse.json(
        { error: 'Données invalides' },
        { status: 400 }
      );
    }

    // Créer les éléments de commande pour chaque article du panier
    // Handle both single item and multiple items
    let commandeItems;
    
    if (Array.isArray(productId)) {
      // Multiple items - create multiple records
      const itemsData = productId.map((pid, index) => ({
        commande_id: parseInt(comandeId),
        product_id: pid,
        quantity: parseInt(productQuantite[index]),
        unit_price: parseFloat(priceUnique[index])
      }));
      
      commandeItems = await prisma.commandeItem.createMany({
        data: itemsData
      });
    } else {
      // Single item
      commandeItems = await prisma.commandeItem.create({
        data: {
          commande_id: parseInt(comandeId),
          product_id: productId,
          quantity: parseInt(productQuantite),
          unit_price: parseFloat(priceUnique)
        },
      });
    }
     
   

    // Créer l'enregistrement de paiement
    const payment = await prisma.payment.create({
      data: {
        commande_id: parseInt(comandeId),
        payment_method: 'credit_card',
        amount: parseFloat(totalAmount),
        status: 'completé',
      },
    });

    // Mettre à jour le statut de la commande
    await prisma.commande.update({
      where: { id: parseInt(comandeId) },
      data: { status: 'delivered' },
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Commande créée avec succès',
        data: { commandeItems } 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur lors de la création des éléments de commande:', error);
    return NextResponse.json(
      { error: 'Erreur serveur interne' },
      { status: 500 }
    );
  }
}

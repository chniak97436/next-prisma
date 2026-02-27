import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { success, badRequest, internalServerError } from '@/lib/utils/response';

// GET - Récupérer les éléments d'une commande avec les produits
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const commandeId = searchParams.get('commandeId');

    console.log('=== GET commandeItems ===');
    console.log('commandeId reçu:', commandeId);

    if (!commandeId) {
      return badRequest('commandeId est requis');
    }

    const parsedId = parseInt(commandeId);
    console.log('Parsed ID:', parsedId);

    // D'abord vérifier si des items existent
    const allItems = await prisma.commandeItem.findMany();
    console.log('Tous les items en base:', allItems.length);

    // Ensuite chercher ceux de cette commande
    const commandeItems = await prisma.commandeItem.findMany({
      where: {
        commande_id: parsedId
      },
      include: {
        product: true
      }
    });

    console.log('Items trouvés pour commande', parsedId, ':', commandeItems);

    return success({ data: commandeItems });
  } catch (error) {
    console.error('Erreur lors de la récupération des éléments de commande:', error);
    return internalServerError('Une erreur est survenue lors de la récupération des éléments de commande');
  }
}

// POST - Créer des éléments de commande
export async function POST(request) {
  try {
    const body = await request.json();
    const { comandeId, productId, productQuantite, priceUnique, totalAmount } = body;

    console.log('=== Début création items ===');
    console.log('comandeId:', comandeId);
    console.log('productId:', productId);
    console.log('productQuantite:', productQuantite);
    console.log('priceUnique:', priceUnique);

    if (!comandeId || !productId || !productQuantite || !priceUnique) {
      return NextResponse.json(
        { error: 'Données invalides' },
        { status: 400 }
      );
    }

    // Créer les éléments de commande pour chaque article du panier
    let commandeItems;
    
    if (Array.isArray(productId)) {
      // Multiple items - create multiple records
      const itemsData = productId.map((pid, index) => ({
        commande_id: parseInt(comandeId),
        product_id: pid,
        quantity: parseInt(productQuantite[index]),
        unit_price: parseFloat(priceUnique[index])
      }));
      
      console.log('Données à insérer:', JSON.stringify(itemsData));
      
      try {
        commandeItems = await prisma.commandeItem.createMany({
          data: itemsData
        });
        console.log('Résultat createMany:', commandeItems);
      } catch (err) {
        console.error('Erreur createMany:', err);
        throw err;
      }
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
     
    console.log('Items créés avec succès');

    // Créer l'enregistrement de paiement (avec upsert pour éviter l'erreur d'unicité)
    try {
      const payment = await prisma.payment.upsert({
        where: { commande_id: parseInt(comandeId) },
        update: {
          payment_method: 'credit_card',
          amount: parseFloat(totalAmount),
          status: 'completé',
        },
        create: {
          commande_id: parseInt(comandeId),
          payment_method: 'credit_card',
          amount: parseFloat(totalAmount),
          status: 'completé',
        },
      });
      console.log('Payment créé/mis à jour:', payment);
    } catch (payErr) {
      console.error('Erreur création payment:', payErr);
    }

    // Mettre à jour le statut de la commande
    try {
      await prisma.commande.update({
        where: { id: parseInt(comandeId) },
        data: { status: 'delivered' },
      });
      console.log('Commande mise à jour');
    } catch (updErr) {
      console.error('Erreur mise à jour commande:', updErr);
    }

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
      { error: 'Erreur serveur interne: ' + error.message },
      { status: 500 }
    );
  }
}

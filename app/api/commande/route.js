import { prisma } from '@/lib/prisma';
import { success, badRequest, internalServerError } from '@/lib/utils/response';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        let commandes;

        if (!userId) {
            // Return all commandes for admin dashboard
            console.log('=== GET /api/commande (all orders) ===');
            commandes = await prisma.commande.findMany({
                orderBy: {
                    created_at: 'desc'
                }
            });
            console.log('Total commandes:', commandes.length);
        } else {
            // Return commandes for specific user
            console.log('=== GET /api/commande ===');
            console.log('userId demandé:', userId);
            commandes = await prisma.commande.findMany({
                where: {
                    user_id: parseInt(userId)
                },
                orderBy: {
                    created_at: 'desc'
                }
            });
            console.log('Commandes trouvées pour user', userId, ':', commandes.length);
        }

        return success({
            data: commandes
        });
    } catch (err) {
        console.error('Erreur fetching commandes', err);
        return internalServerError('Une erreur est survenue sur le serveur.');
    }

}

export async function POST(req) {
    
    try {
        const body = await req.json()
        const { userid, address, priceTotal } = body

        const newCommande = await prisma.commande.create({
            data: {
                user_id :userid,
                shipping_address :address,
                total_amount :priceTotal
            }
        })
        console.log("body : ", newCommande)
        return success({
            success: true,
            message: 'commande valide.',
            data: { id: newCommande.id }
        }, 201);
    } catch (err) {
        console.error('Erreur commande', err);
        return internalServerError('Une erreur est survenue sur le serveur.');
    }
}

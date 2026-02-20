import commande from '@/app/commande/page';
import { prisma } from '@/lib/prisma';
import { success, badRequest, conflict, internalServerError } from '@/lib/utils/response';

export async function GET(req) {
    if (commande) {
        
        const commande = await prisma.commande.findMany()
        return success({
            data: commande
        });
    }
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return badRequest('userId is required');
        }

        const commandes = await prisma.commande.findMany({
            where: {
                user_id: parseInt(userId)
            },
            orderBy: {
                created_at: 'desc'
            }
        });

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
            message: 'commande valide.'
        }, 201);
    } catch (err) {
        console.error('Erreur commande', err);
        return internalServerError('Une erreur est survenue sur le serveur.');
    }
}

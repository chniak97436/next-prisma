import { success, badRequest, internalServerError } from '@/lib/utils/response';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const productId = searchParams.get('productId');

        const where = {};
        
        if (userId) {
            where.user_id = parseInt(userId);
        }
        
        if (productId) {
            where.product_id = parseInt(productId);
        }

        console.log('=== GET /api/avis ===');
        console.log('Filtre:', where);

        const avis = await prisma.avis.findMany({
            where,
            include: {
                user: true,
                product: true,
            },
        });
        
        console.log('Avis trouvés:', avis.length);

        return success({ data: avis });
    } catch (error) {
        console.error('Erreur lors de la récupération des avis:', error);
        return internalServerError({ message: 'Erreur interne du serveur' });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { userId, productId, note, comment } = body;

        if (!userId || !productId || !note) {
            return badRequest('userId, productId et note sont requis');
        }

        const newAvis = await prisma.avis.create({
            data: {
                user_id: parseInt(userId),
                product_id: parseInt(productId),
                note: parseInt(note),
                comment: comment || null
            }
        });

        return success({ message: 'Avis créé avec succès', data: newAvis }, 201);
    } catch (error) {
        console.error('Erreur lors de la création de l\'avis:', error);
        return internalServerError({ message: 'Erreur interne du serveur' });
    }
}

export async function DELETE(request) {
    const body = await request.json();
    const { avisId } = body;

    try {
        const deletedAvis = await prisma.avis.delete({
            where: { id: parseInt(avisId, 10) },
        });
        return success({ message: 'Avis supprimé avec succès', data: deletedAvis });
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'avis:', error);
        return internalServerError({ message: 'Erreur interne du serveur' });
    }
}

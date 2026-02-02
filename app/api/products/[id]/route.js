import { success, badRequest, internalServerError } from '@/lib/utils/response';
import { prisma } from '@/lib/prisma';

export async function GET(request, { params }) {
    const { id } = await params;
    console.log("id:", id);
    if (!id || isNaN(id)) {
        return badRequest('ID invalide');
    }
    try {
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id, 10) },
            include: {
                category: true,
            },
        });
        if (!product) {
            return badRequest('Produit non trouvé');
        }
        return success({ data: product });
    } catch (error) {
        console.error('Erreur lors de la récupération du produit:', error);
        return internalServerError({ message: 'Erreur interne du serveur' });
    }
}
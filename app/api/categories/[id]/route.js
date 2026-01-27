import { success, badRequest, internalServerError } from '@/lib/utils/response';
import { prisma } from '@/lib/prisma';

export async function GET(request, { params }) {
    const { id } = await params;
    console.log("id:", id);
    if (!id || isNaN(id)) {
        return badRequest('ID invalide');
    }
    try {
        const category = await prisma.category.findUnique({
            where: { id: parseInt(id, 10) },
        });
        if (!category) {
            return badRequest('Catégorie non trouvée');
        }
        return success({ data: category });
    } catch (error) {
        console.error('Erreur lors de la récupération de la catégorie:', error);
        return internalServerError({ message: 'Erreur interne du serveur' });
    }
}

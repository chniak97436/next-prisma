import { success, badRequest, internalServerError } from '@/lib/utils/response';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const avis = await prisma.avis.findMany({
            include: {
                user: true,
                product: true,
            },
        });
        return success({ data: avis });
    } catch (error) {
        console.error('Erreur lors de la récupération des avis:', error);
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

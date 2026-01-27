import { prisma } from '@/lib/prisma';
import { success, badRequest, conflict, internalServerError } from '@/lib/utils/response';

export async function GET() {
    try {
        const users = await prisma.user.findMany();
        return success({ data: users });
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        return internalServerError({ message: 'Erreur interne du serveur' });
    }
}


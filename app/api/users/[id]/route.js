import { prisma } from '@/lib/prisma';
import { success, notFound, internalServerError } from '@/lib/utils/response';

export async function GET(request, { params }) {
    const { id } = await params;
    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) }
        });
        if (!user) {
            return notFound('User not found');
        }
        return success({ data: user });
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        return internalServerError({ message: 'Erreur interne du serveur' });
    }
}

export async function PUT(request, { params }) {
    const { id } = await params;
    const body = await request.json();
    try {
        const user = await prisma.user.update({
            where: { id: parseInt(id) },
            data: body
        });
        return success({ data: user });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
        return internalServerError({ message: 'Erreur interne du serveur' });
    }
}

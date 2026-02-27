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
export async function PUT(req) {
    try {
        const { email, password } = await req.json();
        if (!email || !password) {
            return badRequest({ message: 'Email et mot de passe sont requis.' });
        }
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            const updatedUser = await prisma.user.update({
                where: { email },
                data: { password_hash: password },
            });
            return success({ message: 'Mot de passe mis à jour avec succès.', data: updatedUser });
        } else {
            return conflict({ message: 'Utilisateur non trouvé.' });
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour du mot de passe:', error);
        return internalServerError({ message: 'Erreur interne du serveur' });
    }
}


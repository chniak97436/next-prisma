import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function PUT(req) {
    const { token, password } = await req.json();

    // 1. Chercher l'user via le token unique et non expiré
    const user = await prisma.user.findFirst({
        where: {
            resetPasswordToken: token,
            resetPasswordExpires: { gt: new Date() }
        }
    });

    if (!user) return Response.json({ error: "Lien invalide" }, { status: 400 });

    // 2. Hasher avec Bcrypt (10 rounds)
    const hashedPassword = await bcrypt.hash(password, 12);

    // 3. Update BDD et suppression du token (sécurité)
    await prisma.user.update({
        where: { id: user.id },
        data: {
            password_hash: hashedPassword,
            resetPasswordToken: null,
            resetPasswordExpires: null
        }
    });

    return Response.json({ ok: true });
}
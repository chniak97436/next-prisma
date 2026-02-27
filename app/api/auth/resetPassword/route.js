import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function PUT(req) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return new Response(JSON.stringify({ message: 'Email et nouveau mot de passe requis.' }), { status: 400 });
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return new Response(JSON.stringify({ message: 'Utilisateur non trouvé.' }), { status: 404 });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Update the user's password
        await prisma.user.update({
            where: { email },
            data: { password_hash: hashedPassword },
        });

        return new Response(JSON.stringify({ message: 'Mot de passe réinitialisé avec succès !', ok: true }), { status: 200 });

    } catch (error) {
        console.error('Reset password error:', error);
        return new Response(JSON.stringify({ message: 'Erreur lors de la réinitialisation du mot de passe.' }), { status: 500 });
    }
}

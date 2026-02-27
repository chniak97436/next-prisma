import { prisma } from "@/lib/prisma";

export async function POST(req) {
    try {
        const { email } = await req.json();
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return new Response(JSON.stringify({ message: 'Utilisateur non trouvé.' }), { status: 404 });
        }
        else {
            return new Response(JSON.stringify({ message: 'Email validé.', email: user.email, ok: true }), { status: 200 });
        }

    } 
    catch (error) {
        console.error('Forgot password error:', error);
        return new Response(JSON.stringify({ message: 'Erreur lors de la demande de réinitialisation du mot de passe.' }), { status: 500 });
    }
}
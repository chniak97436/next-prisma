import { prisma } from "@/lib/prisma";
import crypto from 'crypto';
import { sendEmailRegister } from "@/lib/utils/sendEmailRegister";

export async function POST(req) {
    try {
        const body = await req.json();
        // Ensure email is a clean string
        const email = String(body?.email || '').trim().toLowerCase();
        
        console.log("Forgot password request - email:", email, "type:", typeof email);
        
        if (!email) {
            return new Response(JSON.stringify({ message: 'Email requis.' }), { status: 400 });
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return new Response(JSON.stringify({ message: 'Format email invalide.' }), { status: 400 });
        }
        
        console.log("Attempting to find user with email:", email);
        
        let user;
        try {
            // Use findFirst with explicit email match
            user = await prisma.user.findFirst({
                where: { email: email },
            });
        } catch (dbError) {
            console.error("Database query error:", dbError);
            // If there's a conversion error, try raw SQL
            if (dbError.code === 'P2023') {
                console.log("Trying raw SQL query for email:", email);
                try {
                    const result = await prisma.$queryRaw`SELECT * FROM users WHERE LOWER(email) = ${email} LIMIT 1`;
                    user = result[0] || null;
                    console.log("Raw SQL result:", user);
                } catch (rawError) {
                    console.error("Raw SQL error:", rawError);
                    return new Response(JSON.stringify({ message: 'Erreur de données. Veuillez contacter le support.' }), { status: 500 });
                }
            } else {
                throw dbError;
            }
        }
        
        
        if (!user) {
            // Don't reveal whether user exists for security
            return new Response(JSON.stringify({ message: 'Si ce compte existe, un email a été envoyé.' }), { status: 200 });
        }
        else {
            // Générer le token et l'expiration 1h
            const token = crypto.randomBytes(32).toString('hex');
            const expire = new Date(Date.now() + 3600000);
            await prisma.user.update({
                where: { email },
                data: {
                    resetPasswordToken: token,
                    resetPasswordExpires: expire,
                },
            });
            // base url pour reset pwd
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";
            const resetUrl = `${baseUrl}/forgot-password?token=${token}`;
            
            try {
                // Envoyer l'email
                await sendEmailRegister(
                    user.email,
                    "Réinitialisation de votre mot de passe",
                    "Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le lien ci-dessous. Attention, ce lien expire dans 1 heure.",
                    resetUrl
                );
            } catch (emailError) {
                console.error('Email sending error:', emailError);
                return new Response(JSON.stringify({ message: 'Erreur lors de l\'envoi de l\'email. Veuillez réessayer.' }), { status: 500 });
            }
            
            return new Response(JSON.stringify({ message: 'Email de récupération envoyé avec succès.', email: user.email, ok: true }), { status: 200 });
        }

    }
    catch (error) {
        console.error('Forgot password error:', error);
        
        // Provide more specific error messages
        if (error.code === 'P2023') {
            // Inconsistent column data error
            return new Response(JSON.stringify({ message: 'Erreur de données. Veuillez contacter le support.' }), { status: 500 });
        }
        
        return new Response(JSON.stringify({ message: 'Erreur lors de la demande de réinitialisation du mot de passe.' }), { status: 500 });
    }
}

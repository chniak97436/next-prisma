import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export default async function VerifyEmailPage({ searchParams }) {
    const token = searchParams.token;
    console.log("token:", token);
    if (!token) {
        redirect('/register?error=no-token');
    }
    try {
        const { userId } = jwt.verify(token, process.env.JWT_SECRET);
        await prisma.user.update({
            where: { id: userId },
            data: { emailVerified: new Date() },
        });
        redirect('/login?verified=true');
    } catch (error) {
        redirect('/register?error=token-invalid');
    }
}

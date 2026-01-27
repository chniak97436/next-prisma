import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/utils/jwt';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    
    if (!token) {
        return NextResponse.redirect(new URL('/register?error=no-token', request.url));
    }
    try {
        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.redirect(new URL('/register?error=token-invalid', request.url));
        }
        await prisma.user.update({
            where: { id: decoded.userId },
            data: { emailVerified: new Date() },
        });
        return NextResponse.redirect(new URL('/login?verified=true', request.url));
    } catch (error) {
        return NextResponse.redirect(new URL('/register?error=token-invalid', request.url));
    }
}

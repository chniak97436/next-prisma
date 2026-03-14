import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken'

export async function POST(request) {

    const remise = 0.1
    const body = await request.json()
    const { code } = body
    // recup token
    const auth = await request.headers.get("authorization")
    const token = auth?.split(" ")[1];
    // decode token
    let payload;
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        return NextResponse.json(
            { valide: false },
            { message: "invalide token ou non conecté." }
        )
    }
    const email = payload.email;

    // trouve newsletter by email et check si promo code is valid
    const promo = await prisma.newsletter.findUnique({
        where: { email }
    });

    if (!promo) {
        return NextResponse.json(
            { valide: false, message: "Newsletter non trouvée" },
            { status: 404 }
        );
    }

    // Check si promo code use
    if (promo.promoCodeUsed) {
        return NextResponse.json(
            { valide: false, message: "Code promo déjà utilisé." },
            { status: 400 }
        );
    }
    if (promo.promoCode !== code) {
        return NextResponse.json(
            { valide: false, message: "Code promo invalide." },
            { status: 400 }
        );
    }

    return NextResponse.json(
        { valide: true, message: "Code promo validé.", remise: remise },
        { status: 200 });
}

export async function PUT(request){
    // recup token
    const auth = await request.headers.get("authorization")
    const token = auth?.split(" ")[1];
    // decode token
    let payload;
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        return NextResponse.json(
            { valide: false },
            { message: "invalide token ou non conecté." }
        )
    }
    const email = payload.email;

    // trouve newsletter by email et check si promo code is valid
    const promo = await prisma.newsletter.findUnique({
        where: { email }
    });
    if (!promo.promoCodeUsed) {
        const update = await prisma.newsletter.update({
            where : {
                email,
            },
            data : {
                promoCodeUsed: true,
            }
        })
        return NextResponse.json({success: true})
    }


}

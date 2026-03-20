import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request, { params }) {
  const { email } = await params;
  if (!email) {
    return NextResponse.json({ valide: false, message: 'Email requis' }, { status: 400 });
  }
  const promo = await prisma.newsletter.findUnique({ 
    where: { email } 
  });
  if (!promo) {
    return NextResponse.json({ valide: false, message: 'Aucun abonnement newsletter trouvé' });
  }
  return NextResponse.json({ 
    valide: !promo.promoCodeUsed, 
    promoCode: promo.promoCode, 
    used: promo.promoCodeUsed,
    promoCodeUsedAt: promo.promoCodeUsedAt
  });
}

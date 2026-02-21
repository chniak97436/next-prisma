import { prisma } from "@/lib/prisma";
import { success, badRequest, internalServerError } from "@/lib/utils/response";

export async function GET(request) {
    try {
        const payments = await prisma.payment.findMany();
        return success({ data: payments });
    } catch (error) {
        console.error('Erreur lors de la récupération des paiements:', error);
        return internalServerError('Une erreur est survenue lors de la récupération des paiements');
    }
    }
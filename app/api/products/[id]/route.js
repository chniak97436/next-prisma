import { success, badRequest, notFound, internalServerError } from '@/lib/utils/response';
import { prisma } from '@/lib/prisma';

export async function GET(request, { params }) {
    const { id } = await params;
    if (!id || isNaN(id)) {
        return badRequest('ID invalide');
    }
    try {
        const product = await prisma.product.findUnique({
            where: { id: parseInt(id, 10) },
            include: {
                category: true,
            },
        });
        if (!product) {
            return badRequest('Produit non trouvé');
        }
        return success({ data: product });
    } catch (error) {
        console.error('Erreur lors de la récupération du produit:', error);
        return internalServerError({ message: 'Erreur interne du serveur' });
    }
}

export async function PUT(request, { params }) {
    const { id } = await params;
    if (!id || isNaN(id)) {
        return badRequest('ID invalide');
    }
    const body = await request.json();
    try {
        const product = await prisma.product.update({
            where: { id: parseInt(id, 10) },
            data: {
                name: body.name,
                description: body.description,
                price: body.price ? parseFloat(body.price) : undefined,
                stock_quantity: body.stock_quantity ? parseInt(body.stock_quantity, 10) : undefined,
                category_id: body.category_id ? parseInt(body.category_id, 10) : undefined,
                image_url: body.image_url,
            },
        });
        return success({ data: product });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du produit:', error);
        return internalServerError({ message: 'Erreur interne du serveur' });
    }
}

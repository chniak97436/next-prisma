import { success, badRequest, conflict, internalServerError } from '@/lib/utils/response';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            include: {
                category: true,
            },
        });
        return success({ data: products });
    } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
        return internalServerError({ message: 'Erreur interne du serveur' });
    }
}

export async function DELETE(request) {
    const body = await request.json();
    const { productId } = body;

    if (!productId) {
        return badRequest('L\'ID du produit est requis');
    }

    try {
        const deletedProduct = await prisma.product.delete({
            where: { id: parseInt(productId, 10) },
        });
        return success({ message: 'Produit supprimé avec succès', data: deletedProduct });
    } catch (error) {
        console.error('Erreur lors de la suppression du produit:', error);
        return internalServerError({ message: 'Erreur interne du serveur' });
    }
}

export async function POST(request) {
    const formData = await request.formData();
    const name = formData.get('name');
    const description = formData.get('description');
    const price = parseFloat(formData.get('price'));
    const stock_Quantity = parseInt(formData.get('stock_Quantity'), 10);
    const categoryId = parseInt(formData.get('category'), 10);
    const createdAt = formData.get('createdAt');
    const imageFile = formData.get('image');
    let imageUrl = null;
    if (imageFile && imageFile.size > 0) {
        const imagePath = `/uploads/${Date.now()}_${imageFile.name}`;
        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const fs = require('fs');
        fs.writeFileSync(`./public${imagePath}`, buffer);
        imageUrl = imagePath;
    }
    if (!name || !description || isNaN(price) || isNaN(stock_Quantity) || isNaN(categoryId) || !createdAt) {
        return badRequest({ message: 'Tous les champs sont requis' });
    }   
    try {
        const existingProduct = await prisma.product.findFirst({
            where: { name: name },
        });
        if (existingProduct) {
            return conflict({ message: 'Un produit avec ce nom existe déjà' });
        }
        const newProduct = await prisma.product.create({
            data: {
                name,
                description,
                price,
                stock_quantity: stock_Quantity,
                category_id: categoryId,
                created_at: new Date(createdAt),
                image_url: imageUrl,
            },
        });
        return success({ message: 'Produit créé avec succès', data: newProduct });
    } catch (error) {
        console.error('Erreur lors de la création du produit:', error);
        return internalServerError({ message: 'Erreur interne du serveur' });
    }
}

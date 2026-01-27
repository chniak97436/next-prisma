
import { success, badRequest, conflict, internalServerError } from '@/lib/utils/response';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
    const body = await request.json();
    const { catName, catDesc, parent_id } = body;
    if (!catName || !catDesc) {
        return badRequest('le nom et la description de la catégorie sont requis');
    }
    try {
        const existingCategory = await prisma.category.findUnique({
            where: { name: catName },
        });
        if (existingCategory) {
            return conflict('Une catégorie avec ce nom existe déjà');
        }
        const newCategory = await prisma.category.create({
            data: {
                name: catName,
                description: catDesc,
                parent_id: parent_id ? parseInt(parent_id, 10) : null,
            }
        });
        return success({ message: 'Catégorie créée avec succès', data: newCategory });
    } catch (error) {
        console.error('Erreur lors de la création de la catégorie:', error);
        return internalServerError({ message: 'Erreur interne du serveur' });
    }
}

export async function GET() {
    try {
        const categories = await prisma.category.findMany();
        return success({ data: categories });
    } catch (error) {
        console.error('Erreur lors de la récupération des catégories:', error);
        return internalServerError({ message: 'Erreur interne du serveur' });
    }   
}



export async function DELETE(request) {
    const body = await request.json();
    const { categoryId } = body;
              
    try {
        const deletedCategory = await prisma.category.delete({
            where: { id: parseInt(categoryId, 10) },
        });
        return success({ message: 'Catégorie supprimée avec succès', data: deletedCategory });
    } catch (error) {
        console.error('Erreur lors de la suppression de la catégorie:', error);
        return internalServerError({ message: 'Erreur interne du serveur' });
    }
}
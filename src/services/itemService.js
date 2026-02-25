const prisma = require('../config/prisma');
const activityService = require('./activityService');

class ItemService {
    async findAll() {
        return await prisma.item.findMany({
            include: {
                user: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
    }

    async findById(id) {
        return await prisma.item.findUnique({
            where: { id: parseInt(id) },
            include: {
                user: {
                    select: {
                        name: true
                    }
                }
            }
        });
    }

    async create(data, userId) {
        const { item, data: itemDate, origem, destino, servidor, patrimonio } = data;
        const newItem = await prisma.item.create({
            data: {
                item,
                data: new Date(itemDate),
                origem,
                destino,
                servidor,
                patrimonio,
                userId: parseInt(userId)
            }
        });

        await activityService.log(userId, 'CREATE', { itemId: newItem.id, itemName: newItem.item });
        return newItem;
    }

    async update(id, data, userId) {
        const { item, data: itemDate, origem, destino, servidor, patrimonio } = data;
        const updatedItem = await prisma.item.update({
            where: { id: parseInt(id) },
            data: {
                item,
                data: itemDate ? new Date(itemDate) : undefined,
                origem,
                destino,
                servidor,
                patrimonio
            }
        });

        await activityService.log(userId, 'UPDATE', { itemId: updatedItem.id, itemName: updatedItem.item });
        return updatedItem;
    }

    async delete(id, userId) {
        const itemToDelete = await prisma.item.findUnique({ where: { id: parseInt(id) } });
        if (!itemToDelete) throw new Error('Item not found');

        await prisma.item.delete({
            where: { id: parseInt(id) }
        });

        await activityService.log(userId, 'DELETE', { itemId: id, itemName: itemToDelete.item });
    }
}

module.exports = new ItemService();

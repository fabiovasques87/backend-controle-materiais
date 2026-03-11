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
        const { item, data: itemDate, origem, destino, servidor, patrimonio, status } = data;
        try {
            const newItem = await prisma.item.create({
                data: {
                    item,
                    data: new Date(itemDate),
                    origem,
                    destino,
                    servidor,
                    patrimonio,
                    status: status && (status === 'EMPRESTADO' || status === 'DEVOLVIDO') ? status : 'DEVOLVIDO',
                    userId: parseInt(userId)
                }
            });

            await activityService.log(userId, 'CREATE', { itemId: newItem.id, itemName: newItem.item });
            return newItem;
        } catch (error) {
            if (error.code === 'P2002') {
                throw new Error('Este número de patrimônio já está cadastrado em outro item.');
            }
            throw error;
        }
    }

    async update(id, data, userId) {
        const { item, data: itemDate, origem, destino, servidor, patrimonio, status } = data;
        try {
            const updateData = {};
            
            if (item !== undefined) updateData.item = item;
            if (itemDate) updateData.data = new Date(itemDate);
            if (origem !== undefined) updateData.origem = origem;
            if (destino !== undefined) updateData.destino = destino;
            if (servidor !== undefined) updateData.servidor = servidor;
            if (patrimonio !== undefined) updateData.patrimonio = patrimonio;
            if (status !== undefined) updateData.status = status;
            
            const updatedItem = await prisma.item.update({
                where: { id: parseInt(id) },
                data: updateData
            });

            await activityService.log(userId, 'UPDATE', { itemId: updatedItem.id, itemName: updatedItem.item });
            return updatedItem;
        } catch (error) {
            if (error.code === 'P2002') {
                throw new Error('Este número de patrimônio já está cadastrado em outro item.');
            }
            throw error;
        }
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

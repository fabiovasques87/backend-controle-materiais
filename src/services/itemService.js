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

            // registra todos os valores do novo item
            await activityService.log(userId, 'CREATE', {
                itemId: newItem.id,
                newValues: newItem
            });
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
            const existing = await prisma.item.findUnique({ where: { id: parseInt(id) } });
            if (!existing) throw new Error('Item not found');

            const updateData = {};
            const changes = {};

            if (item !== undefined && item !== existing.item) {
                updateData.item = item;
                changes.item = { before: existing.item, after: item };
            }
            if (itemDate && new Date(itemDate).toISOString() !== existing.data.toISOString()) {
                updateData.data = new Date(itemDate);
                changes.data = { before: existing.data, after: new Date(itemDate) };
            }
            if (origem !== undefined && origem !== existing.origem) {
                updateData.origem = origem;
                changes.origem = { before: existing.origem, after: origem };
            }
            if (destino !== undefined && destino !== existing.destino) {
                updateData.destino = destino;
                changes.destino = { before: existing.destino, after: destino };
            }
            if (servidor !== undefined && servidor !== existing.servidor) {
                updateData.servidor = servidor;
                changes.servidor = { before: existing.servidor, after: servidor };
            }
            if (patrimonio !== undefined && patrimonio !== existing.patrimonio) {
                updateData.patrimonio = patrimonio;
                changes.patrimonio = { before: existing.patrimonio, after: patrimonio };
            }
            if (status !== undefined && status !== existing.status &&
                (status === 'EMPRESTADO' || status === 'DEVOLVIDO')) {
                updateData.status = status;
                changes.status = { before: existing.status, after: status };
            }

            if (Object.keys(updateData).length === 0) {
                throw new Error('Nenhum campo válido para atualizar');
            }

            const updatedItem = await prisma.item.update({
                where: { id: parseInt(id) },
                data: updateData
            });

            await activityService.log(userId, 'UPDATE', { 
                itemId: updatedItem.id, 
                itemName: updatedItem.item,
                servidor: updatedItem.servidor,
                changes 
            });
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

        // log com valores excluídos
        await activityService.log(userId, 'DELETE', {
            itemId: id,
            deletedValues: itemToDelete
        });
    }
}

module.exports = new ItemService();

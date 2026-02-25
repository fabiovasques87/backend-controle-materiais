const prisma = require('../config/prisma');

class UserRepository {
    async findAll() {
        return await prisma.user.findMany({
            orderBy: { id: 'asc' }
        });
    }

    async findById(id) {
        return await prisma.user.findUnique({
            where: { id: parseInt(id) }
        });
    }

    async create(user) {
        return await prisma.user.create({
            data: {
                name: user.name,
                email: user.email,
                password: user.password
            }
        });
    }

    async update(id, user) {
        const { name, email, password } = user;
        return await prisma.user.update({
            where: { id: parseInt(id) },
            data: {
                name,
                email,
                password: password || undefined
            }
        });
    }

    async delete(id) {
        await prisma.user.delete({
            where: { id: parseInt(id) }
        });
    }

    async findByEmail(email) {
        return await prisma.user.findUnique({
            where: { email }
        });
    }

    async updatePassword(id, hashedPassword) {
        return await prisma.user.update({
            where: { id: parseInt(id) },
            data: { password: hashedPassword }
        });
    }

    async setResetToken(id, token, expires) {
        await prisma.user.update({
            where: { id: parseInt(id) },
            data: {
                resetToken: token,
                resetTokenExpires: expires
            }
        });
    }

    async findByResetToken(token) {
        return await prisma.user.findFirst({
            where: {
                resetToken: token,
                resetTokenExpires: {
                    gt: new Date()
                }
            }
        });
    }
}

module.exports = new UserRepository();

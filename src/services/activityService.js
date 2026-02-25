const prisma = require('../config/prisma');

class ActivityService {
    async log(userId, action, details) {
        try {
            await prisma.activity.create({
                data: {
                    userId,
                    action,
                    details: JSON.stringify(details)
                }
            });
        } catch (error) {
            console.error('Failed to log activity:', error);
        }
    }

    async findAll() {
        return await prisma.activity.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 50 // Limit to recent activities
        });
    }
}

module.exports = new ActivityService();

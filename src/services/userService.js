const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcrypt');

class UserService {
    async getAllUsers() {
        return await userRepository.findAll();
    }

    async getUserById(id) {
        return await userRepository.findById(id);
    }

    async createUser(data) {
        // Validação simples (pode ser expandida)
        if (!data.name || !data.email || !data.password) {
            throw new Error('Name, email and password are required');
        }
        const hashed = await bcrypt.hash(data.password, 10);
        const user = await userRepository.create({
            name: data.name,
            email: data.email,
            password: hashed,
        });
        delete user.password;
        return user;
    }

    async updateUser(id, data) {
        const existingUser = await userRepository.findById(id);
        if (!existingUser) {
            throw new Error('User not found');
        }

        const updateData = { ...data };
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        const user = await userRepository.update(id, updateData);
        if (user) delete user.password;
        return user;
    }

    async deleteUser(id) {
        const existingUser = await userRepository.findById(id);
        if (!existingUser) {
            throw new Error('User not found');
        }
        return await userRepository.delete(id);
    }
}

module.exports = new UserService();

const userRepository = require('../repositories/userRepository');
const bcrypt = require('bcrypt');
const jwt = require('../utils/jwt');
const crypto = require('crypto');
const mailer = require('../utils/mailer');

class AuthService {
    async register({ name, email, password }) {
        if (!name || !email || !password) {
            throw new Error('Name, email and password are required');
        }

        const existing = await userRepository.findByEmail(email);
        if (existing) {
            throw new Error('Email already in use');
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = await userRepository.create({ name, email, password: hashed });
        // do not return password
        delete user.password;
        return user;
    }

    async login({ email, password }) {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            throw new Error('Invalid credentials');
        }
        const token = jwt.sign({ id: user.id, email: user.email });
        return { token, user: { id: user.id, name: user.name, email: user.email } };
    }

    async forgotPassword(email, frontendUrl) {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            // do not reveal that the email is not registered
            return;
        }
        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
        await userRepository.setResetToken(user.id, token, expires);

        const resetLink = `${frontendUrl}/reset-password?token=${token}`;
        await mailer.sendMail({
            to: email,
            subject: 'Password reset',
            text: `Clique no link para redefinir sua senha: ${resetLink}`,
            html: `<p>Clique no link para redefinir sua senha:</p><a href="${resetLink}">${resetLink}</a>`,
        });
    }

    async resetPassword(token, newPassword) {
        const user = await userRepository.findByResetToken(token);
        if (!user) {
            throw new Error('Invalid or expired token');
        }
        const hashed = await bcrypt.hash(newPassword, 10);
        await userRepository.updatePassword(user.id, hashed);
        // clear token
        await userRepository.setResetToken(user.id, null, null);
    }
}

module.exports = new AuthService();

const authService = require('../services/authService');

class AuthController {
    async register(req, res) {
        try {
            const user = await authService.register(req.body);
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async login(req, res) {
        try {
            const result = await authService.login(req.body);
            res.json(result);
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }

    async forgotPassword(req, res) {
        try {
            const frontendUrl = process.env.FRONTEND_URL || '';
            await authService.forgotPassword(req.body.email, frontendUrl);
            res.json({ message: 'If the email exists, a reset link has been sent' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async resetPassword(req, res) {
        try {
            const { token, password } = req.body;
            await authService.resetPassword(token, password);
            res.json({ message: 'Password updated' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new AuthController();

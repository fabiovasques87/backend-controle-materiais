const db = require('../config/db');

class UserRepository {
    async findAll() {
        const result = await db.query('SELECT * FROM users ORDER BY id ASC');
        return result.rows;
    }

    async findById(id) {
        const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
        return result.rows[0];
    }

    async create(user) {
        const { name, email, password } = user;
        const result = await db.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
            [name, email, password]
        );
        return result.rows[0];
    }

    async update(id, user) {
        const { name, email, password } = user;
        let result;
        if (password) {
            result = await db.query(
                'UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *',
                [name, email, password, id]
            );
        } else {
            result = await db.query(
                'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
                [name, email, id]
            );
        }
        return result.rows[0];
    }

    async delete(id) {
        await db.query('DELETE FROM users WHERE id = $1', [id]);
    }

    // additional helpers for authentication
    async findByEmail(email) {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    }

    async updatePassword(id, hashedPassword) {
        const result = await db.query(
            'UPDATE users SET password = $1 WHERE id = $2 RETURNING *',
            [hashedPassword, id]
        );
        return result.rows[0];
    }

    async setResetToken(id, token, expires) {
        await db.query(
            'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE id = $3',
            [token, expires, id]
        );
    }

    async findByResetToken(token) {
        const now = new Date();
        const result = await db.query(
            'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expires > $2',
            [token, now]
        );
        return result.rows[0];
    }
}

module.exports = new UserRepository();

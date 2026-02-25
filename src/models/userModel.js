/**
 * User Model
 * @typedef {Object} User
 * @property {number} id
 * @property {string} name
 * @property {string} email
 * @property {string} password hashed password
 * @property {string} [reset_token] token used for recovery
 * @property {Date} [reset_token_expires] token expiration
 * @property {Date} created_at
 */

class User {
    constructor(id, name, email, password, reset_token, reset_token_expires) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.reset_token = reset_token;
        this.reset_token_expires = reset_token_expires;
    }
}

module.exports = User;

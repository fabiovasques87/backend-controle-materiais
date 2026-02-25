const jwtLib = require('jsonwebtoken');
require('dotenv').config();

const SECRET = process.env.JWT_SECRET || 'secret';
const EXPIRES_IN = '1h';

module.exports = {
    sign(payload) {
        return jwtLib.sign(payload, SECRET, { expiresIn: EXPIRES_IN });
    },
    verify(token) {
        return jwtLib.verify(token, SECRET);
    },
};

const jwt = require('../utils/jwt');

module.exports = function (req, res, next) {
    const header = req.headers.authorization;
    if (!header) {
        return res.status(401).json({ error: 'No token provided' });
    }
    const parts = header.split(' ');
    if (parts.length !== 2) {
        return res.status(401).json({ error: 'Token error' });
    }
    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({ error: 'Token malformatted' });
    }
    try {
        const decoded = jwt.verify(token);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token invalid' });
    }
};

const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido' });
        }
        req.user = user;
        next();
    });
}

function authorizeRole(role) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Usuário não autenticado' });
        }
        
        if (req.user.role !== role) {
            return res.status(403).json({ message: 'Acesso não autorizado' });
        }
        next();
    };
}

module.exports = { authenticateToken, authorizeRole };
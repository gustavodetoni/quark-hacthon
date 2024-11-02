const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../database/db'); 

const router = express.Router();

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Busque o usuário no banco de dados
        const [user] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);

        if (user.length === 0) {
            return res.status(401).json({ message: 'Usuário não encontrado' });
        }

        // Compare a senha fornecida com o hash armazenado
        const match = await bcrypt.compare(password, user[0].password);

        if (!match) {
            return res.status(401).json({ message: 'Senha incorreta' });
        }

        // Geração do token JWT
        const token = jwt.sign({ username: user[0].username, role: user[0].role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

module.exports = router;

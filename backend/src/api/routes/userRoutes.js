const express = require('express');
const bcrypt = require('bcrypt');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const pool = require('../database/db');

const router = express.Router();

router.post('/create', authenticateToken, authorizeRole('admin'), async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    if (!['admin', 'trainee', 'assessor'].includes(role)) {
        return res.status(400).json({ message: 'Role inválido' });
    }

    try {
        const [existingUser] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
        
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Username já está em uso' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [result] = await pool.query(
            'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
            [username, hashedPassword, role]
        );

        res.status(201).json({ 
            message: 'Usuário criado com sucesso',
            userId: result.insertId
        });
    } catch (error) {
        console.error(error);
        if (error.code === 'ER_DATA_TOO_LONG' || error.code === 'ER_DATA_OUT_OF_RANGE') {
            return res.status(400).json({ message: 'Dados inválidos para um ou mais campos' });
        }
        res.status(500).json({ message: 'Erro ao criar usuário' });
    }
});

router.put('/:id/edit', authenticateToken, authorizeRole('admin'), async (req, res) => {
    const { id } = req.params;
    const { username, password, role } = req.body;

    if (!username && !password && !role) {
        return res.status(400).json({ message: 'Pelo menos um campo deve ser fornecido para atualização' });
    }

    try {
        const updates = {};
        if (username) updates.username = username;
        if (password) updates.password = await bcrypt.hash(password, 10);
        if (role) updates.role = role;

        const [result] = await pool.query('UPDATE users SET ? WHERE id = ?', [updates, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.json({ message: 'Usuário atualizado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar usuário' });
    }
});


router.delete('/:id/delete', authenticateToken, authorizeRole('admin'), async (req, res) => {
    const userId = req.params.id;

    try {
        const [result] = await pool.query('DELETE FROM users WHERE id = ?', [userId]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.json({ message: 'Usuário excluído com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao excluir usuário' });
    }
});

const getUsersByRole = async (role, res) => {
    try {
        const [users] = await pool.query(
            'SELECT id, username, role, created_at FROM users WHERE role = ?', 
            [role]
        );
        return users;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Erro ao buscar usuários com role ${role}` });
    }
};

router.get('/admins', authenticateToken, authorizeRole('admin'), async (req, res) => {
    const users = await getUsersByRole('admin', res);
    res.json(users);
});

router.get('/trainees', authenticateToken, authorizeRole('admin'), async (req, res) => {
    const users = await getUsersByRole('trainee', res);
    res.json(users);
});

router.get('/assessors', authenticateToken, authorizeRole('admin'), async (req, res) => {
    const users = await getUsersByRole('assessor', res);
    res.json(users);
});



module.exports = router;
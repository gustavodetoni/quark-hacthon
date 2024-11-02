const express = require('express');
const User = require('../models/User');
const { authenticateToken, authorizeRole } = require('../middleware/authpassword');
const router = express.Router();

router.post('/create', authenticateToken, authorizeRole('admin'), async (req, res) => {
    const { username, password, role } = req.body;

    try {
        const userId = await User.createUser(username, password, role);
        res.json({ message: 'Usuário criado', userId });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar usuário' });
    }
});

router.get('/admins', authenticateToken, async (req, res) => {
    try {
        const admins = await User.getUsersByRole('admin'); 
        res.json(admins);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar administradores' });
    }
});

router.get('/trainees', authenticateToken, async (req, res) => {
    try {
        const trainees = await User.getUsersByRole('trainee'); 
        res.json(trainees);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar trainees' });
    }
});

router.get('/assessors', authenticateToken, async (req, res) => {
    try {
        const assessors = await User.getUsersByRole('assessor'); 
        res.json(assessors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar assessores' });
    }
});


module.exports = router;

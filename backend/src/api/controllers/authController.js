// src/api/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/userRepository');
const { sendVerificationEmail, generateVerificationCode } = require('../utils/emailUtils');

const verificationCodes = new Map(); 

const authController = {
    async login(req, res) {
        const { username, password } = req.body;
        try {
            const user = await UserRepository.findUserByUsername(username);

            if (!user) return res.status(401).json({ message: 'Usuário não encontrado' });

            const match = await bcrypt.compare(password, user.password);
            if (!match) return res.status(401).json({ message: 'Senha incorreta' });

            if (user.role === 'admin') {
                const verificationCode = generateVerificationCode();
                verificationCodes.set(username, { code: verificationCode, timestamp: Date.now() });

                await sendVerificationEmail(user.username, verificationCode);
                return res.status(200).json({ requiresVerification: true, role: user.role });
                
            }
            const token = jwt.sign({ userId: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token, role: user.role });
            
        } catch (error) {
            console.error('Erro durante o login:', error);
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    },

    async verifyCode(req, res) {
        const { username, code } = req.body;

        try {
            const verification = verificationCodes.get(username);
            if (!verification) {
                return res.status(400).json({ message: 'Código expirado ou inválido' });
            }

            if (Date.now() - verification.timestamp > 5 * 60 * 1000) {
                verificationCodes.delete(username); 
                return res.status(400).json({ message: 'Código expirado' });
            }

            if (verification.code !== code) {
                return res.status(400).json({ message: 'Código incorreto' });
            }

            const user = await UserRepository.findUserByUsername(username);
            const token = jwt.sign({ userId: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

            verificationCodes.delete(username); 

            res.json({ token, role: user.role });
        } catch (error) {
            console.error('Erro durante a verificação do código:', error);
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }
};

module.exports = authController;

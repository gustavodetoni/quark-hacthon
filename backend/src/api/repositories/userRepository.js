const pool = require('../database/db');

const UserRepository = {
    async findUserByUsername(username) {
        const [rows] = await pool.query('SELECT id, username, password, role FROM users WHERE username = ?', [username]);
        return rows[0] || null;
    },

    async createUser(username, hashedPassword, role) {
        const [result] = await pool.query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, role]);
        return result.insertId;
    },

    async getUsersByRole(role) {
        const [users] = await pool.query('SELECT id, username, role, created_at FROM users WHERE role = ?', [role]);
        return users;
    },

    async userExists(username) {
        const [existingUser] = await pool.query('SELECT id FROM users WHERE username = ?', [username]);
        return existingUser.length > 0;
    }
};

module.exports = UserRepository;

const { query } = require('../database/db');

const userModel = {
    findByEmail: async (email) => {
        return await query.get('SELECT * FROM users WHERE LOWER(email) = LOWER(?)', [email]);
    },

    findById: async (id) => {
        return await query.get('SELECT id, name, email, role, department, created_at FROM users WHERE id = ?', [id]);
    },

    create: async ({ name, email, password, role = 'student', department = 'Computer Science' }) => {
        const result = await query.run(
            'INSERT INTO users (name, email, password, role, department) VALUES (?, ?, ?, ?, ?)',
            [name, email, password, role, department]
        );
        return {
            id: result.lastID,
            name,
            email,
            role,
            department
        };
    },

    getAll: async () => {
        return await query.all('SELECT id, name, email, role, department, created_at FROM users ORDER BY id ASC');
    }
};

module.exports = userModel;

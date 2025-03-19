const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
    static async createTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(50) NOT NULL UNIQUE,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role ENUM('admin', 'user') DEFAULT 'user',
                banned BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await pool.execute(query);
        await this.createAdminUser();
    }
    static async createAdminUser() {
      // Check if the admin user already exists
      const existingAdmin = await this.findByEmail('admin@example.com');
      if (!existingAdmin) {
          // Hash the password
          const hashedPassword = await bcrypt.hash('password', 10);
          // Create the admin user
          await this.create({
              username: 'admin',
              email: 'admin@example.com',
              password: hashedPassword,
              role: 'admin'
          });
          console.log('Admin user created');
      }
  }

    static async create({ username, email, password, role }) {
        const query = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
        const [result] = await pool.execute(query, [username, email, password, role || 'user']);
        return result.insertId;
    }

    static async findByEmail(email) {
        const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await pool.execute('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0];
    }

    // Updated getAll with filter and sort
    static async getAll({ filter = {}, sort = {} }) {
        let query = 'SELECT id, username, email, role, banned, created_at FROM users WHERE 1=1';
        const params = [];
      
        if (filter.role) {
          query += ' AND role = ?';
          params.push(filter.role);
        }
        if (filter.username) {
          query += ' AND username LIKE ?';
          params.push(`%${filter.username}%`);
        }
        if (filter.email) {
          query += ' AND email LIKE ?';
          params.push(`%${filter.email}%`);
        }
        // Fix for banned filter: Convert string 'true'/'false' to boolean
        if (filter.banned !== undefined && filter.banned !== '') {
            const bannedValue = filter.banned === true || filter.banned === 'true' ? 1 : 0;
            query += ' AND banned = ?';
            params.push(bannedValue);
        }
      
        if (sort.field && ['username', 'email', 'created_at'].includes(sort.field)) {
          const direction = sort.direction === 'desc' ? 'DESC' : 'ASC';
          query += ` ORDER BY ${sort.field} ${direction}`;
        }
      
        try {
          const [rows] = await pool.execute(query, params);
          return rows;
        } catch (error) {
          console.error('Database error in getAll:', error);
          throw error; // Let the route handler catch this
        }
      }

      static async update(id, data) {
        let query = 'UPDATE users SET ';
        const params = [];
        const fields = [];
      
        for (const [key, value] of Object.entries(data)) {
          fields.push(`${key} = ?`);
          params.push(value);
        }
        query += fields.join(', ') + ' WHERE id = ?';
        params.push(id);
      
        const [result] = await pool.execute(query, params);
        return result.affectedRows;
      }

    static async delete(id) {
        const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);
        return result.affectedRows;
    }

    // Ban/Unban user
    static async setBanStatus(id, banned) {
        const query = 'UPDATE users SET banned = ? WHERE id = ?';
        const [result] = await pool.execute(query, [banned, id]);
        return result.affectedRows;
    }
}

module.exports = User;
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'admin_panel',
    waitForConnections: true,
    connectionLimit: 10,
});

const connectDB = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('MySQL Database connected');
        connection.release();
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
};

module.exports = { connectDB, pool };
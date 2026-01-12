require('dotenv').config();
const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'tapodhan_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

const connectDB = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('MySQL Connected Successfully');
        connection.release();
        return pool;
    } catch (error) {
        console.error('MySQL Connection Error:', error);
        process.exit(1);
    }
};

const getPool = () => pool;

module.exports = { pool, connectDB, getPool };


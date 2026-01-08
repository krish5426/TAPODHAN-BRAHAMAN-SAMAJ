const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mydatabase',
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


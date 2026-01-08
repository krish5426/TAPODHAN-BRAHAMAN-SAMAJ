const { connectDB } = require('./mysql-config');

async function inspect() {
    try {
        const pool = await connectDB();
        const [rows] = await pool.execute('DESCRIBE businesses');
        console.log(JSON.stringify(rows, null, 2));
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

inspect();

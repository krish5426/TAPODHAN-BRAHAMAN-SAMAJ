const { connectDB } = require('./mysql-config');

async function migrate() {
    try {
        const pool = await connectDB();

        // Add columns if they don't exist
        // We'll execute individual ALTER statements. If they fail (duplicate column), we catch and continue.

        const columns = [
            "ADD COLUMN category VARCHAR(255) AFTER businessName",
            "ADD COLUMN businessType VARCHAR(255) AFTER category",
            "ADD COLUMN description TEXT AFTER address",
            "ADD COLUMN website VARCHAR(255) AFTER email",
            "ADD COLUMN city VARCHAR(255) AFTER address",
            "ADD COLUMN state VARCHAR(255) AFTER city"
        ];

        for (const col of columns) {
            try {
                await pool.execute(`ALTER TABLE businesses ${col}`);
                console.log(`Executed: ${col}`);
            } catch (err) {
                if (err.code === 'ER_DUP_FIELDNAME') {
                    console.log(`Skipped (already exists): ${col}`);
                } else {
                    console.error(`Error executing ${col}:`, err);
                }
            }
        }

        console.log("Migration completed.");
        process.exit(0);
    } catch (error) {
        console.error("Migration fatal error:", error);
        process.exit(1);
    }
}

migrate();

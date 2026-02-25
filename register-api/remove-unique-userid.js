const { connectDB } = require('./mysql-config');

const removeUniqueConstraint = async () => {
    const pool = await connectDB();
    const connection = await pool.getConnection();

    try {
        console.log('Checking for constraints on userId in profiles table...');

        // 1. Find the Foreign Key constraint name
        const [fkRows] = await connection.execute(`
            SELECT CONSTRAINT_NAME 
            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
            WHERE TABLE_SCHEMA = DATABASE() 
              AND TABLE_NAME = 'profiles' 
              AND COLUMN_NAME = 'userId' 
              AND REFERENCED_TABLE_NAME = 'users'
        `);

        if (fkRows.length > 0) {
            const fkName = fkRows[0].CONSTRAINT_NAME;
            console.log(`Found Foreign Key constraint: ${fkName}. Dropping it temporarily...`);
            
            await connection.execute(`ALTER TABLE profiles DROP FOREIGN KEY ${fkName}`);
            console.log('Foreign Key constraint dropped.');

            // 2. Drop the Unique Index
            // Assuming the index name is 'userId' based on previous error, but let's verify or try dropping it.
            try {
                // Determine index name - usually same as column or constraint name
                const [indexRows] = await connection.execute(`
                    SHOW INDEX FROM profiles WHERE Column_name = 'userId' AND Non_unique = 0
                `);
                
                if (indexRows.length > 0) {
                    const indexName = indexRows[0].Key_name;
                    console.log(`Found unique index: ${indexName}. Dropping it...`);
                    await connection.execute(`DROP INDEX ${indexName} ON profiles`);
                    console.log('Unique index dropped.');
                } else {
                    console.log('No unique index found on userId.');
                }
            } catch (idxError) {
                console.log('Error checking/dropping index:', idxError.message);
            }

            // 3. Add a standard (non-unique) index
            try {
                await connection.execute(`CREATE INDEX idx_userId ON profiles (userId)`);
                console.log('Created standard non-unique index on userId.');
            } catch (idxError) {
                console.log('Note: Could not create index (might already exist):', idxError.message);
            }

            // 4. Re-add the Foreign Key constraint
            console.log('Re-adding Foreign Key constraint...');
            await connection.execute(`
                ALTER TABLE profiles 
                ADD CONSTRAINT ${fkName} 
                FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
            `);
            console.log('Foreign Key constraint re-added successfully.');

        } else {
            console.log('No Foreign Key constraint found on userId column? This is unexpected.');
        }

    } catch (error) {
        console.error('Error modifying profiles table:', error);
    } finally {
        connection.release();
        process.exit();
    }
};

removeUniqueConstraint();

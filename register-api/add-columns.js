const { connectDB } = require('./mysql-config');

const addMissingColumns = async () => {
  const pool = await connectDB();
  
  try {
    // Add missing columns to businesses table
    await pool.execute(`
      ALTER TABLE businesses 
      ADD COLUMN IF NOT EXISTS category VARCHAR(255),
      ADD COLUMN IF NOT EXISTS businessType VARCHAR(255),
      ADD COLUMN IF NOT EXISTS description TEXT,
      ADD COLUMN IF NOT EXISTS website VARCHAR(255),
      ADD COLUMN IF NOT EXISTS city VARCHAR(255),
      ADD COLUMN IF NOT EXISTS state VARCHAR(255)
    `);
    
    console.log('Missing columns added successfully');
  } catch (error) {
    console.error('Error adding columns:', error);
  }
};

addMissingColumns().then(() => process.exit(0));
const { connectDB } = require('./mysql-config');

const addOtpColumns = async () => {
  const pool = await connectDB();
  
  try {
    // Add missing otp columns to users table
    await pool.execute(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS resetOtp VARCHAR(10) DEFAULT NULL,
      ADD COLUMN IF NOT EXISTS resetOtpExpiry DATETIME DEFAULT NULL
    `);
    
    console.log('OTP columns added successfully');
  } catch (error) {
    if (error.code === 'ER_DUP_FIELDNAME') {
      console.log('Columns already exist.');
    } else {
      console.error('Error adding columns:', error);
    }
  }
};

addOtpColumns().then(() => process.exit(0));

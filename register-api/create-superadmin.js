const bcrypt = require('bcryptjs');
const { connectDB } = require('./mysql-config');
const { createTables } = require('./mysql-schema');

const createSuperAdmin = async () => {
  try {
    const pool = await connectDB();
    await createTables();
    
    const email = "super@gmail.com";
    const mobile = "5050505050";
    const password = "Su@12345";
    
    // Check if superadmin already exists
    const [existing] = await pool.execute('SELECT * FROM admins WHERE email = ?', [email]);
    if (existing.length > 0) {
      console.log('Super Admin already exists');
      return;
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await pool.execute(
      'INSERT INTO admins (firstName, lastName, email, mobile, password, isMainAdmin, role, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      ['Super', 'Admin', email, mobile, hashedPassword, true, 'super-admin', 'approved']
    );
    
    console.log('Super Admin created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    
  } catch (error) {
    console.error('Error creating Super Admin:', error);
  } finally {
    process.exit(0);
  }
};

createSuperAdmin();
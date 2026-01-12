const { connectDB } = require('./mysql-config');

const checkData = async () => {
  const pool = await connectDB();
  
  try {
    // Check users
    const [users] = await pool.execute('SELECT * FROM users ORDER BY id DESC LIMIT 5');
    console.log('Users:', users.length);
    
    // Check profiles
    const [profiles] = await pool.execute('SELECT * FROM profiles ORDER BY id DESC LIMIT 5');
    console.log('Profiles:', profiles.length);
    
    // Check profile requests
    const [requests] = await pool.execute('SELECT * FROM profile_requests ORDER BY id DESC LIMIT 5');
    console.log('Profile Requests:', requests.length);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
};

checkData();
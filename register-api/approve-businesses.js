const { connectDB } = require('./mysql-config');

const approveBusinesses = async () => {
  try {
    const pool = await connectDB();
    
    // Get super admin ID
    const [admin] = await pool.execute('SELECT id FROM admins WHERE email = ?', ['super@gmail.com']);
    const adminId = admin[0].id;
    
    // Approve all businesses
    await pool.execute(
      'UPDATE businesses SET status = ?, approvedBy = ?, approvedAt = ? WHERE status = ?',
      ['approved', adminId, new Date(), 'pending']
    );
    
    // Approve all business requests
    await pool.execute(
      'UPDATE business_requests SET status = ?, approvedBy = ?, approvedAt = ? WHERE status = ?',
      ['approved', adminId, new Date(), 'pending']
    );
    
    console.log('✅ All businesses approved successfully!');
    
  } catch (error) {
    console.error('Error approving businesses:', error);
  } finally {
    process.exit(0);
  }
};

approveBusinesses();
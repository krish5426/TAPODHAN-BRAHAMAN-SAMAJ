const { connectDB } = require('./mysql-config');

const createDummyBusinesses = async () => {
  try {
    const pool = await connectDB();
    
    // First create 5 dummy users for businesses
    const users = [
      ['Raj', 'Patel', 'raj.patel@gmail.com', '9876543210', '$2a$10$hashedpassword1'],
      ['Amit', 'Shah', 'amit.shah@gmail.com', '9876543211', '$2a$10$hashedpassword2'],
      ['Priya', 'Sharma', 'priya.sharma@gmail.com', '9876543212', '$2a$10$hashedpassword3'],
      ['Vikash', 'Kumar', 'vikash.kumar@gmail.com', '9876543213', '$2a$10$hashedpassword4'],
      ['Neha', 'Gupta', 'neha.gupta@gmail.com', '9876543214', '$2a$10$hashedpassword5']
    ];

    const userIds = [];
    for (const user of users) {
      const [result] = await pool.execute(
        'INSERT INTO users (firstName, lastName, email, mobile, password) VALUES (?, ?, ?, ?, ?)',
        user
      );
      userIds.push(result.insertId);
    }

    // Create 5 dummy businesses
    const businesses = [
      [userIds[0], 'Patel Electronics', 'Raj Patel', 'raj.patel@gmail.com', '9876543210', '123 Main Street, Mumbai', 'business1.jpg'],
      [userIds[1], 'Shah Textiles', 'Amit Shah', 'amit.shah@gmail.com', '9876543211', '456 Market Road, Delhi', 'business2.jpg'],
      [userIds[2], 'Sharma Sweets', 'Priya Sharma', 'priya.sharma@gmail.com', '9876543212', '789 Sweet Lane, Pune', 'business3.jpg'],
      [userIds[3], 'Kumar Motors', 'Vikash Kumar', 'vikash.kumar@gmail.com', '9876543213', '321 Auto Street, Bangalore', 'business4.jpg'],
      [userIds[4], 'Gupta Jewellers', 'Neha Gupta', 'neha.gupta@gmail.com', '9876543214', '654 Gold Market, Jaipur', 'business5.jpg']
    ];

    const businessIds = [];
    for (const business of businesses) {
      const [result] = await pool.execute(
        'INSERT INTO businesses (userId, businessName, ownerName, email, contactNumber, address, posterPhoto, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [...business, 'pending']
      );
      businessIds.push(result.insertId);
    }

    // Create 5 business requests
    for (let i = 0; i < 5; i++) {
      await pool.execute(
        'INSERT INTO business_requests (businessId, userId, status) VALUES (?, ?, ?)',
        [businessIds[i], userIds[i], 'pending']
      );
    }

    console.log('✅ Created 5 dummy businesses and business requests');
    console.log('Business IDs:', businessIds);
    
  } catch (error) {
    console.error('Error creating dummy data:', error);
  } finally {
    process.exit(0);
  }
};

createDummyBusinesses();
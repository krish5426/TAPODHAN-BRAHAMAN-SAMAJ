const { connectDB } = require('./mysql-config');

const createTables = async () => {
  const pool = await connectDB();
  
  try {
    // Users table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        firstName VARCHAR(255),
        lastName VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        mobile VARCHAR(20) UNIQUE,
        password VARCHAR(255),
        registerForProfile BOOLEAN DEFAULT FALSE,
        acceptTerms BOOLEAN DEFAULT FALSE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Admins table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT AUTO_INCREMENT PRIMARY KEY,
        firstName VARCHAR(255) NOT NULL,
        lastName VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        mobile VARCHAR(20) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        isMainAdmin BOOLEAN DEFAULT FALSE,
        role ENUM('profile_admin', 'business_admin', 'super-admin') DEFAULT NULL,
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        approvedBy INT,
        approvedAt TIMESTAMP NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (approvedBy) REFERENCES admins(id)
      )
    `);

    // Profiles table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS profiles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT UNIQUE NOT NULL,
        profileFor VARCHAR(255) NOT NULL,
        maritalStatus VARCHAR(255) NOT NULL,
        noOfChildren VARCHAR(255) NOT NULL,
        firstName VARCHAR(255) NOT NULL,
        fatherName VARCHAR(255) NOT NULL,
        surname VARCHAR(255) NOT NULL,
        gender VARCHAR(255) NOT NULL,
        dateOfBirth DATE NOT NULL,
        timeOfBirth VARCHAR(255) NOT NULL,
        birthPlace VARCHAR(255) NOT NULL,
        height VARCHAR(255) NOT NULL,
        weight VARCHAR(255) NOT NULL,
        physicalDisability VARCHAR(255) NOT NULL,
        glasses VARCHAR(255) NOT NULL,
        mangal VARCHAR(255) NOT NULL,
        expectation TEXT NOT NULL,
        educationQualification VARCHAR(255) NOT NULL,
        educationDetails TEXT NOT NULL,
        jobType VARCHAR(255) NOT NULL,
        jobDescription TEXT NOT NULL,
        designation VARCHAR(255) NOT NULL,
        currentLocation VARCHAR(255) NOT NULL,
        incomeCurrency VARCHAR(255) NOT NULL,
        monthlyIncome VARCHAR(255) NOT NULL,
        fatherFullName VARCHAR(255) NOT NULL,
        motherFullName VARCHAR(255) NOT NULL,
        fatherOccupation VARCHAR(255) NOT NULL,
        motherOccupation VARCHAR(255) NOT NULL,
        totalFamilyMembers VARCHAR(255) NOT NULL,
        totalBrothers VARCHAR(255) NOT NULL,
        totalSisters VARCHAR(255) NOT NULL,
        marriedBrothers VARCHAR(255) NOT NULL,
        marriedSisters VARCHAR(255) NOT NULL,
        familyType VARCHAR(255) NOT NULL,
        familyValues VARCHAR(255) NOT NULL,
        familyLocation VARCHAR(255) NOT NULL,
        nativePlace VARCHAR(255) NOT NULL,
        familyWealth VARCHAR(255) NOT NULL,
        contactPersonName VARCHAR(255) NOT NULL,
        contactPersonRelation VARCHAR(255) NOT NULL,
        contactPersonNumber VARCHAR(20) NOT NULL,
        contactPersonEmail VARCHAR(255) NOT NULL,
        contactPersonAddress TEXT NOT NULL,
        profilePhoto VARCHAR(255),
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        approvedBy INT,
        approvedAt TIMESTAMP NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (approvedBy) REFERENCES admins(id)
      )
    `);

    // Profile requests table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS profile_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        profileId INT NOT NULL,
        userId INT NOT NULL,
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        approvedBy INT,
        approvedAt TIMESTAMP NULL,
        rejectionReason TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (profileId) REFERENCES profiles(id) ON DELETE CASCADE,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (approvedBy) REFERENCES admins(id)
      )
    `);

    // Businesses table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS businesses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        userId INT UNIQUE NOT NULL,
        businessName VARCHAR(255) NOT NULL,
        ownerName VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        contactNumber VARCHAR(20) NOT NULL,
        address TEXT NOT NULL,
        posterPhoto VARCHAR(255) NOT NULL,
        category VARCHAR(255),
        businessType VARCHAR(255),
        description TEXT,
        website VARCHAR(255),
        city VARCHAR(255),
        state VARCHAR(255),
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        approvedBy INT,
        approvedAt TIMESTAMP NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (approvedBy) REFERENCES admins(id)
      )
    `);

    // Business requests table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS business_requests (
        id INT AUTO_INCREMENT PRIMARY KEY,
        businessId INT NOT NULL,
        userId INT NOT NULL,
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        approvedBy INT,
        approvedAt TIMESTAMP NULL,
        rejectionReason TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (businessId) REFERENCES businesses(id) ON DELETE CASCADE,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (approvedBy) REFERENCES admins(id)
      )
    `);

    // Events table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        date DATE NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Event images table (for multiple images per event)
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS event_images (
        id INT AUTO_INCREMENT PRIMARY KEY,
        eventId INT NOT NULL,
        imagePath VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (eventId) REFERENCES events(id) ON DELETE CASCADE
      )
    `);

    console.log('All tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
};

module.exports = { createTables };

// Run if called directly
if (require.main === module) {
  createTables().then(() => process.exit(0));
}
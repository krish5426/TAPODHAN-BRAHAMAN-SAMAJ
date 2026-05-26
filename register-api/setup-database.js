/**
 * Database Setup Script
 * Creates the database, tables, and imports default business data.
 * 
 * Usage: node setup-database.js
 */
require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const DB_NAME = process.env.MYSQL_DATABASE || 'tapodhan_db';

async function setup() {
  // 1. Connect without database to create it if needed
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    multipleStatements: true
  });

  console.log('Connected to MySQL server.');

  // 2. Create database
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
  await connection.query(`USE \`${DB_NAME}\``);
  console.log(`Database "${DB_NAME}" ready.`);

  // 3. Create tables (inline, matching mysql-schema.js)
  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      firstName VARCHAR(255),
      lastName VARCHAR(255),
      email VARCHAR(255) UNIQUE,
      mobile VARCHAR(20) UNIQUE,
      password VARCHAR(255),
      registerForProfile BOOLEAN DEFAULT FALSE,
      acceptTerms BOOLEAN DEFAULT FALSE,
      resetOtp VARCHAR(10) DEFAULT NULL,
      resetOtpExpiry DATETIME DEFAULT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await connection.query(`
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

  await connection.query(`
    CREATE TABLE IF NOT EXISTS profiles (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT NOT NULL,
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

  await connection.query(`
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

  await connection.query(`
    CREATE TABLE IF NOT EXISTS businesses (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT NOT NULL,
      businessName VARCHAR(255) NOT NULL,
      ownerName VARCHAR(255) NOT NULL,
      email VARCHAR(255) DEFAULT NULL,
      contactNumber VARCHAR(20) NOT NULL,
      address TEXT NOT NULL,
      posterPhoto VARCHAR(255) DEFAULT NULL,
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

  await connection.query(`
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

  await connection.query(`
    CREATE TABLE IF NOT EXISTS events (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      date DATE NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS event_images (
      id INT AUTO_INCREMENT PRIMARY KEY,
      eventId INT NOT NULL,
      imagePath VARCHAR(255) NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (eventId) REFERENCES events(id) ON DELETE CASCADE
    )
  `);

  console.log('All tables created.');

  // 4. Insert a default admin (needed for FK references in businesses)
  const [existingAdmins] = await connection.query('SELECT COUNT(*) as count FROM admins');
  if (existingAdmins[0].count === 0) {
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await connection.query(`
      INSERT INTO admins (id, firstName, lastName, email, mobile, password, isMainAdmin, role, status)
      VALUES (1, 'Super', 'Admin', 'admin@tapodhan.com', '9999999999', ?, TRUE, 'super-admin', 'approved')
    `, [hashedPassword]);
    console.log('Default admin created (email: admin@tapodhan.com, password: admin123)');
  }

  // 5. Import businesses.sql data
  const sqlFile = path.join(__dirname, '..', 'businesses.sql');
  if (fs.existsSync(sqlFile)) {
    console.log('Importing businesses.sql...');

    // Disable FK checks so we can insert businesses even if referenced users don't all exist yet
    await connection.query('SET FOREIGN_KEY_CHECKS = 0');

    // Read and execute the SQL file
    const sql = fs.readFileSync(sqlFile, 'utf8');
    
    // Drop existing businesses table and recreate from the SQL dump
    await connection.query('DROP TABLE IF EXISTS business_requests');
    await connection.query('DROP TABLE IF EXISTS businesses');
    await connection.query(sql);

    // Re-enable FK checks
    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    // Recreate business_requests table (was dropped due to FK dependency)
    await connection.query(`
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

    console.log('businesses.sql imported successfully!');
  } else {
    console.log('businesses.sql not found at:', sqlFile);
  }

  // 6. Verify
  const [rows] = await connection.query('SELECT COUNT(*) as count FROM businesses');
  console.log(`Total businesses in database: ${rows[0].count}`);

  await connection.end();
  console.log('\nDatabase setup complete!');
}

setup().catch(err => {
  console.error('Setup failed:', err.message);
  process.exit(1);
});

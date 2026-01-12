const { connectDB } = require('./mysql-config');

const createDummyData = async () => {
  const pool = await connectDB();
  
  try {
    // Create 5 dummy users first
    const users = [];
    for (let i = 1; i <= 5; i++) {
      const hashedPassword = 'password123';
      const [userResult] = await pool.execute(
        'INSERT INTO users (firstName, lastName, email, mobile, password, registerForProfile, acceptTerms) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [`User${i}`, `LastName${i}`, `user${i}@example.com`, `900000000${i}`, hashedPassword, true, true]
      );
      users.push(userResult.insertId);
    }

    // Create 5 dummy profiles with approved status
    const profiles = [];
    for (let i = 0; i < 5; i++) {
      const [profileResult] = await pool.execute(`
        INSERT INTO profiles (
          userId, profileFor, maritalStatus, noOfChildren, firstName, fatherName, surname, 
          gender, dateOfBirth, timeOfBirth, birthPlace, height, weight, physicalDisability, 
          glasses, mangal, expectation, educationQualification, educationDetails, jobType, 
          jobDescription, designation, currentLocation, incomeCurrency, monthlyIncome, 
          fatherFullName, motherFullName, fatherOccupation, motherOccupation, totalFamilyMembers, 
          totalBrothers, totalSisters, marriedBrothers, marriedSisters, familyType, familyValues, 
          familyLocation, nativePlace, familyWealth, contactPersonName, contactPersonRelation, 
          contactPersonNumber, contactPersonEmail, contactPersonAddress, status, approvedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        users[i], 'Self', 'Single', '0', `Profile${i+1}`, `Father${i+1}`, `Surname${i+1}`,
        i % 2 === 0 ? 'Male' : 'Female', '1995-01-01', '10:00 AM', `City${i+1}`, '5.8', '70kg', 'None',
        'No', 'No', 'Looking for suitable match', 'Graduate', 'Computer Science', 'Private Job',
        'Software Engineer', 'Senior Developer', `Location${i+1}`, 'INR', '50000',
        `Father Full Name ${i+1}`, `Mother Full Name ${i+1}`, 'Business', 'Housewife', '4',
        '1', '1', '0', '0', 'Nuclear', 'Traditional', `Family Location ${i+1}`,
        `Native Place ${i+1}`, 'Middle Class', `Contact Person ${i+1}`, 'Father',
        `900000100${i}`, `contact${i+1}@example.com`, `Address Line ${i+1}`, 'approved', new Date()
      ]);
      profiles.push(profileResult.insertId);
    }

    // Create 5 dummy profile requests with approved status
    for (let i = 0; i < 5; i++) {
      await pool.execute(`
        INSERT INTO profile_requests (profileId, userId, status, approvedAt) 
        VALUES (?, ?, ?, ?)
      `, [profiles[i], users[i], 'approved', new Date()]);
    }

    console.log('Successfully created 5 dummy users, profiles, and profile requests with approved status');
    
  } catch (error) {
    console.error('Error creating dummy data:', error);
  } finally {
    process.exit(0);
  }
};

createDummyData();
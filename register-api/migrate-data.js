const mongoose = require('mongoose');
const { connectDB } = require('./mysql-config');
const { createTables } = require('./mysql-schema');

// MongoDB connection
const connectMongoDB = async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/mydatabase");
  console.log("MongoDB Connected for migration");
};

// MongoDB Models (existing)
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  mobile: String,
  password: String,
  registerForProfile: Boolean,
  acceptTerms: Boolean
});

const adminSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isMainAdmin: { type: Boolean, default: false },
  role: { type: String, enum: ['profile_admin', 'business_admin', 'super-admin'], default: null },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
  approvedAt: { type: Date, default: null }
}, { timestamps: true });

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  profileFor: { type: String, required: true },
  maritalStatus: { type: String, required: true },
  noOfChildren: { type: String, required: true },
  firstName: { type: String, required: true },
  fatherName: { type: String, required: true },
  surname: { type: String, required: true },
  gender: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  timeOfBirth: { type: String, required: true },
  birthPlace: { type: String, required: true },
  height: { type: String, required: true },
  weight: { type: String, required: true },
  physicalDisability: { type: String, required: true },
  glasses: { type: String, required: true },
  mangal: { type: String, required: true },
  expectation: { type: String, required: true },
  educationQualification: { type: String, required: true },
  educationDetails: { type: String, required: true },
  jobType: { type: String, required: true },
  jobDescription: { type: String, required: true },
  designation: { type: String, required: true },
  currentLocation: { type: String, required: true },
  incomeCurrency: { type: String, required: true },
  monthlyIncome: { type: String, required: true },
  fatherFullName: { type: String, required: true },
  motherFullName: { type: String, required: true },
  fatherOccupation: { type: String, required: true },
  motherOccupation: { type: String, required: true },
  totalFamilyMembers: { type: String, required: true },
  totalBrothers: { type: String, required: true },
  totalSisters: { type: String, required: true },
  marriedBrothers: { type: String, required: true },
  marriedSisters: { type: String, required: true },
  familyType: { type: String, required: true },
  familyValues: { type: String, required: true },
  familyLocation: { type: String, required: true },
  nativePlace: { type: String, required: true },
  familyWealth: { type: String, required: true },
  contactPersonName: { type: String, required: true },
  contactPersonRelation: { type: String, required: true },
  contactPersonNumber: { type: String, required: true },
  contactPersonEmail: { type: String, required: true },
  contactPersonAddress: { type: String, required: true },
  profilePhoto: { type: String },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
  approvedAt: { type: Date, default: null }
}, { timestamps: true });

const businessSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  businessName: { type: String, required: true },
  ownerName: { type: String, required: true },
  email: { type: String, required: true },
  contactNumber: { type: String, required: true },
  address: { type: String, required: true },
  posterPhoto: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
  approvedAt: { type: Date, default: null }
}, { timestamps: true });

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  images: {
    type: [String],
    validate: {
      validator: function (arr) { return arr.length <= 5; },
      message: "Maximum 5 images allowed"
    },
    default: []
  },
}, { timestamps: true });

const MongoUser = mongoose.model("User", userSchema);
const MongoAdmin = mongoose.model("Admin", adminSchema);
const MongoProfile = mongoose.model("Profile", profileSchema);
const MongoBusiness = mongoose.model("Business", businessSchema);
const MongoEvent = mongoose.model("Event", eventSchema);

const migrateData = async () => {
  try {
    // Connect to both databases
    await connectMongoDB();
    const mysqlPool = await connectDB();
    
    // Create MySQL tables
    await createTables();
    
    console.log('Starting data migration...');
    
    // Migrate Users
    console.log('Migrating users...');
    const mongoUsers = await MongoUser.find({});
    const userIdMap = new Map(); // MongoDB ID -> MySQL ID mapping
    
    for (const user of mongoUsers) {
      try {
        const [result] = await mysqlPool.execute(
          'INSERT INTO users (firstName, lastName, email, mobile, password, registerForProfile, acceptTerms, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [
            user.firstName,
            user.lastName,
            user.email,
            user.mobile,
            user.password,
            user.registerForProfile || false,
            user.acceptTerms || false,
            user.createdAt || new Date(),
            user.updatedAt || new Date()
          ]
        );
        userIdMap.set(user._id.toString(), result.insertId);
      } catch (error) {
        console.error(`Error migrating user ${user.email}:`, error.message);
      }
    }
    console.log(`Migrated ${userIdMap.size} users`);
    
    // Migrate Admins
    console.log('Migrating admins...');
    const mongoAdmins = await MongoAdmin.find({});
    const adminIdMap = new Map(); // MongoDB ID -> MySQL ID mapping
    
    for (const admin of mongoAdmins) {
      try {
        const [result] = await mysqlPool.execute(
          'INSERT INTO admins (firstName, lastName, email, mobile, password, isMainAdmin, role, status, approvedAt, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [
            admin.firstName,
            admin.lastName,
            admin.email,
            admin.mobile,
            admin.password,
            admin.isMainAdmin || false,
            admin.role,
            admin.status || 'pending',
            admin.approvedAt,
            admin.createdAt || new Date(),
            admin.updatedAt || new Date()
          ]
        );
        adminIdMap.set(admin._id.toString(), result.insertId);
      } catch (error) {
        console.error(`Error migrating admin ${admin.email}:`, error.message);
      }
    }
    console.log(`Migrated ${adminIdMap.size} admins`);
    
    // Update admin approvedBy references
    for (const admin of mongoAdmins) {
      if (admin.approvedBy && adminIdMap.has(admin.approvedBy.toString())) {
        const mysqlAdminId = adminIdMap.get(admin._id.toString());
        const approvedByMysqlId = adminIdMap.get(admin.approvedBy.toString());
        
        await mysqlPool.execute(
          'UPDATE admins SET approvedBy = ? WHERE id = ?',
          [approvedByMysqlId, mysqlAdminId]
        );
      }
    }
    
    // Migrate Profiles
    console.log('Migrating profiles...');
    const mongoProfiles = await MongoProfile.find({});
    
    for (const profile of mongoProfiles) {
      try {
        const mysqlUserId = userIdMap.get(profile.userId.toString());
        if (!mysqlUserId) {
          console.error(`User not found for profile: ${profile._id}`);
          continue;
        }
        
        const approvedByMysqlId = profile.approvedBy && adminIdMap.has(profile.approvedBy.toString()) 
          ? adminIdMap.get(profile.approvedBy.toString()) 
          : null;
        
        await mysqlPool.execute(`
          INSERT INTO profiles (
            userId, profileFor, maritalStatus, noOfChildren, firstName, fatherName, surname, gender,
            dateOfBirth, timeOfBirth, birthPlace, height, weight, physicalDisability, glasses, mangal,
            expectation, educationQualification, educationDetails, jobType, jobDescription, designation,
            currentLocation, incomeCurrency, monthlyIncome, fatherFullName, motherFullName, fatherOccupation,
            motherOccupation, totalFamilyMembers, totalBrothers, totalSisters, marriedBrothers, marriedSisters,
            familyType, familyValues, familyLocation, nativePlace, familyWealth, contactPersonName,
            contactPersonRelation, contactPersonNumber, contactPersonEmail, contactPersonAddress,
            profilePhoto, status, approvedBy, approvedAt, createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          mysqlUserId, profile.profileFor, profile.maritalStatus, profile.noOfChildren,
          profile.firstName, profile.fatherName, profile.surname, profile.gender,
          profile.dateOfBirth, profile.timeOfBirth, profile.birthPlace, profile.height,
          profile.weight, profile.physicalDisability, profile.glasses, profile.mangal,
          profile.expectation, profile.educationQualification, profile.educationDetails,
          profile.jobType, profile.jobDescription, profile.designation, profile.currentLocation,
          profile.incomeCurrency, profile.monthlyIncome, profile.fatherFullName, profile.motherFullName,
          profile.fatherOccupation, profile.motherOccupation, profile.totalFamilyMembers,
          profile.totalBrothers, profile.totalSisters, profile.marriedBrothers, profile.marriedSisters,
          profile.familyType, profile.familyValues, profile.familyLocation, profile.nativePlace,
          profile.familyWealth, profile.contactPersonName, profile.contactPersonRelation,
          profile.contactPersonNumber, profile.contactPersonEmail, profile.contactPersonAddress,
          profile.profilePhoto, profile.status || 'pending', approvedByMysqlId, profile.approvedAt,
          profile.createdAt || new Date(), profile.updatedAt || new Date()
        ]);
      } catch (error) {
        console.error(`Error migrating profile ${profile._id}:`, error.message);
      }
    }
    console.log(`Migrated ${mongoProfiles.length} profiles`);
    
    // Migrate Businesses
    console.log('Migrating businesses...');
    const mongoBusinesses = await MongoBusiness.find({});
    
    for (const business of mongoBusinesses) {
      try {
        const mysqlUserId = userIdMap.get(business.userId.toString());
        if (!mysqlUserId) {
          console.error(`User not found for business: ${business._id}`);
          continue;
        }
        
        const approvedByMysqlId = business.approvedBy && adminIdMap.has(business.approvedBy.toString()) 
          ? adminIdMap.get(business.approvedBy.toString()) 
          : null;
        
        await mysqlPool.execute(
          'INSERT INTO businesses (userId, businessName, ownerName, email, contactNumber, address, posterPhoto, status, approvedBy, approvedAt, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [
            mysqlUserId, business.businessName, business.ownerName, business.email,
            business.contactNumber, business.address, business.posterPhoto,
            business.status || 'pending', approvedByMysqlId, business.approvedAt,
            business.createdAt || new Date(), business.updatedAt || new Date()
          ]
        );
      } catch (error) {
        console.error(`Error migrating business ${business._id}:`, error.message);
      }
    }
    console.log(`Migrated ${mongoBusinesses.length} businesses`);
    
    // Migrate Events
    console.log('Migrating events...');
    const mongoEvents = await MongoEvent.find({});
    
    for (const event of mongoEvents) {
      try {
        const [result] = await mysqlPool.execute(
          'INSERT INTO events (title, description, date, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)',
          [
            event.title,
            event.description,
            event.date,
            event.createdAt || new Date(),
            event.updatedAt || new Date()
          ]
        );
        
        const eventId = result.insertId;
        
        // Insert event images
        if (event.images && event.images.length > 0) {
          for (const imagePath of event.images) {
            await mysqlPool.execute(
              'INSERT INTO event_images (eventId, imagePath) VALUES (?, ?)',
              [eventId, imagePath]
            );
          }
        }
      } catch (error) {
        console.error(`Error migrating event ${event._id}:`, error.message);
      }
    }
    console.log(`Migrated ${mongoEvents.length} events`);
    
    console.log('Data migration completed successfully!');
    
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

// Run migration
if (require.main === module) {
  migrateData();
}

module.exports = { migrateData };
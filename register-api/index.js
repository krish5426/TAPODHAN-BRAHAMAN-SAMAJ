// index.js (final ready-to-run)
// Keep your register/login code unchanged; profile part is enhanced + auth

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
app.use((req, res, next) => {
  const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});


// -------------------------------------------------------------------------------------
// ⭐ SUPER ADMIN INPUT SECTION (EDIT HERE)
// -------------------------------------------------------------------------------------
const SUPER_ADMIN_EMAIL = "super@gmail.com";
const SUPER_ADMIN_MOBILE = "5050505050";
const SUPER_ADMIN_PASSWORD = "Su@12345";
// -------------------------------------------------------------------------------------
// NOTE: This logic runs automatically on server start.
// Once the Super Admin is created, you can safely remove this section 
// and the createSuperAdmin() function call below.
// -------------------------------------------------------------------------------------


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ----------------- MONGODB CONNECTION -----------------
mongoose.connect("mongodb://127.0.0.1:27017/mydatabase")
  .then(() => {
    console.log("MongoDB Connected");
    createSuperAdmin(); // Try to create super admin on connection
  })
  .catch((err) => console.log("DB Error:", err));

// ----------------- USER SCHEMA & MODEL (unchanged) -----------------
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  mobile: String,
  password: String,
  registerForProfile: Boolean,
  acceptTerms: Boolean
});

const User = mongoose.model("User", userSchema);

// ----------------- ADMIN SCHEMA & MODEL -----------------
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

const Admin = mongoose.model("Admin", adminSchema);

// ----------------- PROFILE REQUEST SCHEMA & MODEL -----------------
const profileRequestSchema = new mongoose.Schema({
  profileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
  approvedAt: { type: Date, default: null },
  rejectionReason: { type: String, default: null }
}, { timestamps: true });

const ProfileRequest = mongoose.model("ProfileRequest", profileRequestSchema);

// ----------------- BUSINESS SCHEMA & MODEL -----------------
const businessSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  businessName: { type: String, required: true },
  ownerName: { type: String, required: true },
  email: { type: String, required: true, match: [/^[a-zA-Z0-9._%+-]+@gmail\.com$/, "Email must be @gmail.com"] },
  contactNumber: { type: String, required: true, match: [/^\d{10}$/, "Contact must be 10 digits"] },
  address: { type: String, required: true },
  posterPhoto: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
  approvedAt: { type: Date, default: null }
}, { timestamps: true });

const Business = mongoose.model("Business", businessSchema);

// ----------------- BUSINESS REQUEST SCHEMA & MODEL -----------------
const businessRequestSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
  approvedAt: { type: Date, default: null },
  rejectionReason: { type: String, default: null }
}, { timestamps: true });

const BusinessRequest = mongoose.model("BusinessRequest", businessRequestSchema);

// ----------------- EVENT SCHEMA & MODEL -----------------
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

const Event = mongoose.model("Event", eventSchema);

// ---------------- JWT SECRET ----------------
const JWT_SECRET = "MY_SECRET_KEY"; // same as you used earlier

// ----------------------------
// PROFILE + UPLOAD SETUP
// ----------------------------
const UPLOAD_DIR = path.join(__dirname, "uploads");

// Ensure upload directory exists - blocking sync is fine on startup
if (!fs.existsSync(UPLOAD_DIR)) {
  try {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  } catch (err) {
    console.error("Failed to create upload directory:", err);
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Double check existence in case it was deleted
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
    cb(null, UPLOAD_DIR)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext)
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_\-]/g, "");
    const fname = `${base}_${Date.now()}${ext}`;
    cb(null, fname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png/i; // Case insensitive
    const ext = path.extname(file.originalname); // Keep dot
    if (allowed.test(ext)) cb(null, true);
    else cb(new Error("Only images (jpg, jpeg, png) are allowed"));
  }
});

// ----------------- PROFILE SCHEMA & MODEL (with userId) -----------------
const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },

  // Personal
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

  // Education & Job
  educationQualification: { type: String, required: true },
  educationDetails: { type: String, required: true },
  jobType: { type: String, required: true },
  jobDescription: { type: String, required: true },
  designation: { type: String, required: true },
  currentLocation: { type: String, required: true },
  incomeCurrency: { type: String, required: true },
  monthlyIncome: { type: String, required: true },

  // Family
  fatherFullName: { type: String, required: true },
  motherFullName: { type: String, required: true },
  parentBusiness: { type: String, required: true },
  subcast: { type: String, required: true },
  nativePlace: { type: String, required: true },

  // Contact & Address
  parentCountryCode: { type: String, required: true },
  parentContactNo: { type: String, required: true, match: [/^\d{10}$/, "Parent contact must be 10 digits"] },
  secondaryCountryCode: { type: String, required: true },
  secondaryContactNo: { type: String, required: true, match: [/^\d{10}$/, "Secondary contact must be 10 digits"] },
  whatsappCountryCode: { type: String, required: true },
  whatsappNumber: { type: String, required: true, match: [/^\d{10}$/, "Whatsapp must be 10 digits"] },
  email: { type: String, required: true, lowercase: true, match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email"] },

  addressLine1: { type: String, required: true },
  addressLine2: { type: String, required: true },
  landmark: { type: String, required: true },
  areaVillage: { type: String, required: true },

  country: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true, match: [/^\d{6}$/, "Pincode must be 6 digits"] },

  // Images
  images: {
    type: [String],
    validate: {
      validator: function (arr) { return arr.length <= 3; },
      message: "Maximum 3 images allowed"
    },
    default: []
  },

  // Approval Status
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
  approvedAt: { type: Date, default: null }

}, { timestamps: true });

const Profile = mongoose.model("Profile", profileSchema);

// ----------------- AUTH MIDDLEWARE -----------------
function verifyToken(req, res, next) {
  const auth = req.headers["authorization"] || req.headers["Authorization"];
  if (!auth) return res.status(401).json({ message: "Authorization header missing" });

  const parts = auth.split(" ");
  if (parts.length !== 2) return res.status(401).json({ message: "Invalid Authorization header format" });

  const scheme = parts[0];
  const token = parts[1];

  if (!/^Bearer$/i.test(scheme)) return res.status(401).json({ message: "Invalid Authorization scheme" });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// ----------------- ADMIN AUTH MIDDLEWARE -----------------
function verifyAdminToken(req, res, next) {
  const auth = req.headers["authorization"] || req.headers["Authorization"];
  if (!auth) return res.status(401).json({ message: "Authorization header missing" });

  const parts = auth.split(" ");
  if (parts.length !== 2) return res.status(401).json({ message: "Invalid Authorization header format" });

  const scheme = parts[0];
  const token = parts[1];

  if (!/^Bearer$/i.test(scheme)) return res.status(401).json({ message: "Invalid Authorization scheme" });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.adminId = payload.adminId;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired admin token" });
  }
}

// ----------------- MAIN ADMIN AUTH MIDDLEWARE -----------------
async function verifyMainAdmin(req, res, next) {
  try {
    const admin = await Admin.findById(req.adminId);
    if (!admin || !admin.isMainAdmin) {
      return res.status(403).json({ message: "Access denied. Main admin only." });
    }
    next();
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
}

// ------------------------------------------------------------
// ⭐ REGISTRATION API (WITH CHECKBOX VALIDATION)  (unchanged)
// ------------------------------------------------------------
app.post("/register", async (req, res) => {

  const {
    firstName,
    lastName,
    email,
    mobile,
    password,
    registerForProfile,
    acceptTerms
  } = req.body;

  // EMPTY FIELD VALIDATION
  if (!firstName || !lastName || !email || !mobile || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  // EMAIL VALIDATION
  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/
    ;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format!" });
  }

  // MOBILE VALIDATION
  if (!/^\d{10}$/.test(mobile)) {
    return res.status(400).json({ message: "Mobile must be 10 digits!" });
  }

  // PASSWORD VALIDATION  
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{1,8}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must contain 1 uppercase, 1 number, 1 special char & max 8 characters!"
    });
  }

  // ------------------- CHECKBOX VALIDATION -------------------
  if (typeof registerForProfile !== "boolean") {
    return res.status(400).json({ message: "registerForProfile must be true or false!" });
  }

  if (typeof acceptTerms !== "boolean") {
    return res.status(400).json({ message: "acceptTerms must be true or false!" });
  }

  if (!acceptTerms) {
    return res.status(400).json({ message: "You must accept terms & conditions!" });
  }
  // -------------------------------------------------------------

  // CHECK USER EXISTS
  const exists = await User.findOne({ $or: [{ email }, { mobile }] });
  if (exists) {
    return res.status(400).json({ message: "User already registered!" });
  }

  const hashed = await bcrypt.hash(password, 10);

  await User.create({
    firstName,
    lastName,
    email,
    mobile,
    password: hashed,
    registerForProfile,
    acceptTerms
  });

  return res.status(200).json({ message: "Registration Successful!" });
});

// ------------------------------------------------------------
// ⭐ LOGIN API (EMAIL or MOBILE + PASSWORD) + TOKEN  (unchanged)
// ------------------------------------------------------------
app.post("/login", async (req, res) => {

  const { email, mobile, password } = req.body;

  // REQUIRE ANY ONE: email+password OR mobile+password
  if ((!email && !mobile) || !password) {
    return res.status(400).json({
      message: "Email or Mobile and Password are required!"
    });
  }

  // FIND USER BY EMAIL OR MOBILE
  const user = await User.findOne({
    $or: [{ email }, { mobile }]
  });

  if (!user) {
    return res.status(404).json({ message: "User not registered!" });
  }

  // PASSWORD CHECK
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(400).json({ message: "Incorrect password!" });
  }

  // TOKEN CREATE
  const token = jwt.sign(
    { userId: user._id },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  // OUTPUT: ONLY EMAIL+PASSWORD OR MOBILE+PASSWORD
  let responseUser = {};

  if (email) {
    responseUser.email = user.email;
  } else {
    responseUser.mobile = user.mobile;
  }

  return res.status(200).json({
    message: "Login Successful!",
    token: token,
    user: responseUser
  });
});

// ------------------------------------------------------------
// ⭐ ADMIN LOGIN API
// ------------------------------------------------------------
app.post("/main-admin/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and Password are required!" });
  }

  // Find Admin
  const admin = await Admin.findOne({ email });
  if (!admin) {
    return res.status(404).json({ message: "Admin not found!" });
  }

  // Check Password
  const match = await bcrypt.compare(password, admin.password);
  if (!match) {
    return res.status(400).json({ message: "Incorrect password!" });
  }

  // Generate Token
  const token = jwt.sign(
    { adminId: admin._id },
    JWT_SECRET,
    { expiresIn: "12h" }
  );

  return res.status(200).json({
    message: "Admin Login Successful!",
    token: token,
    admin: {
      email: admin.email,
      firstName: admin.firstName,
      lastName: admin.lastName,
      role: admin.role,
      isMainAdmin: admin.isMainAdmin
    }
  });
});

// ------------------------------------------------------------
// 1) POST /profile/create  (form-data, images: up to 3 files, field names for files: images)
//    Now requires authentication — token must be set in Authorization header (Bearer <token>)
// ------------------------------------------------------------
app.post("/profile/create", verifyToken, upload.array("images", 3), async (req, res) => {
  try {
    // ensure user exists
    const user = await User.findById(req.userId);
    if (!user) {
      if (req.files && req.files.length) req.files.forEach(f => fs.unlinkSync(f.path));
      return res.status(401).json({ message: "User not found" });
    }

    // prevent multiple profiles per user
    const existing = await Profile.findOne({ userId: req.userId });
    if (existing) {
      if (req.files && req.files.length) req.files.forEach(f => fs.unlinkSync(f.path));
      return res.status(400).json({ message: "Profile already exists for this user" });
    }

    const body = req.body;

    // Required field list (same as schema)
    const requiredFields = [
      "profileFor", "maritalStatus", "noOfChildren", "firstName", "fatherName", "surname", "gender",
      "dateOfBirth", "timeOfBirth", "birthPlace", "height", "weight", "physicalDisability", "glasses", "mangal", "expectation",
      "educationQualification", "educationDetails", "jobType", "jobDescription", "designation", "currentLocation", "incomeCurrency", "monthlyIncome",
      "fatherFullName", "motherFullName", "parentBusiness", "subcast", "nativePlace",
      "parentCountryCode", "parentContactNo", "secondaryCountryCode", "secondaryContactNo", "whatsappCountryCode", "whatsappNumber", "email",
      "addressLine1", "addressLine2", "landmark", "areaVillage", "country", "state", "city", "pincode"
    ];

    // Check all required fields present (non-empty)
    for (let key of requiredFields) {
      if (!body[key] || String(body[key]).trim() === "") {
        if (req.files && req.files.length) req.files.forEach(f => fs.unlinkSync(f.path));
        return res.status(400).json({ message: `Field '${key}' is required` });
      }
    }

    // Specific validations
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(body.parentContactNo)) return res.status(400).json({ message: "Parent contact must be 10 digits" });
    if (!phoneRegex.test(body.secondaryContactNo)) return res.status(400).json({ message: "Secondary contact must be 10 digits" });
    if (!phoneRegex.test(body.whatsappNumber)) return res.status(400).json({ message: "Whatsapp number must be 10 digits" });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) return res.status(400).json({ message: "Invalid email format" });

    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(body.pincode)) return res.status(400).json({ message: "Pincode must be 6 digits" });

    // Images validation: multer already limited to max 3 and filtered by extension
    const files = req.files || [];
    if (files.length === 0) return res.status(400).json({ message: "At least one image is required (field name: images)" });
    if (files.length > 3) {
      files.forEach(f => fs.unlinkSync(f.path));
      return res.status(400).json({ message: "Maximum 3 images allowed" });
    }

    const imagePaths = files.map(f => `/uploads/${path.basename(f.path)}`);

    // Build profile object with userId
    const profileObj = {
      userId: req.userId,
      profileFor: body.profileFor,
      maritalStatus: body.maritalStatus,
      noOfChildren: body.noOfChildren,
      firstName: body.firstName,
      fatherName: body.fatherName,
      surname: body.surname,
      gender: body.gender,
      dateOfBirth: new Date(body.dateOfBirth),
      timeOfBirth: body.timeOfBirth,
      birthPlace: body.birthPlace,
      height: body.height,
      weight: body.weight,
      physicalDisability: body.physicalDisability,
      glasses: body.glasses,
      mangal: body.mangal,
      expectation: body.expectation,

      educationQualification: body.educationQualification,
      educationDetails: body.educationDetails,
      jobType: body.jobType,
      jobDescription: body.jobDescription,
      designation: body.designation,
      currentLocation: body.currentLocation,
      incomeCurrency: body.incomeCurrency,
      monthlyIncome: body.monthlyIncome,

      fatherFullName: body.fatherFullName,
      motherFullName: body.motherFullName,
      parentBusiness: body.parentBusiness,
      subcast: body.subcast,
      nativePlace: body.nativePlace,

      parentCountryCode: body.parentCountryCode,
      parentContactNo: body.parentContactNo,
      secondaryCountryCode: body.secondaryCountryCode,
      secondaryContactNo: body.secondaryContactNo,
      whatsappCountryCode: body.whatsappCountryCode,
      whatsappNumber: body.whatsappNumber,
      email: body.email,

      addressLine1: body.addressLine1,
      addressLine2: body.addressLine2,
      landmark: body.landmark,
      areaVillage: body.areaVillage,
      country: body.country,
      state: body.state,
      city: body.city,
      pincode: body.pincode,

      images: imagePaths
    };

    const created = await Profile.create(profileObj);

    // Create profile approval request
    await ProfileRequest.create({
      profileId: created._id,
      userId: req.userId,
      status: 'pending'
    });

    return res.status(201).json({
      message: "Profile created successfully and sent for approval",
      profileId: created._id,
      status: "pending",
      images: created.images
    });

  } catch (err) {
    if (req.files && req.files.length) req.files.forEach(f => { if (fs.existsSync(f.path)) fs.unlinkSync(f.path); });
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ------------------------------------------------------------
// 2) PUT /profile/update/:id  -> Partial update + optional images[] to append; ensures <=3 images total
//    Requires auth: only the profile owner (by userId) can update
// ------------------------------------------------------------
app.put("/profile/update/:id", verifyToken, upload.array("images", 3), async (req, res) => {
  try {
    const profileId = req.params.id;
    const body = req.body;
    const files = req.files || [];

    const profile = await Profile.findById(profileId);
    if (!profile) {
      if (files.length) files.forEach(f => fs.unlinkSync(f.path));
      return res.status(404).json({ message: "Profile not found" });
    }

    // ownership check
    if (String(profile.userId) !== String(req.userId)) {
      if (files.length) files.forEach(f => fs.unlinkSync(f.path));
      return res.status(403).json({ message: "Not authorized to update this profile" });
    }

    // validations if provided
    const phoneRegex = /^\d{10}$/;
    if (body.parentContactNo && !phoneRegex.test(String(body.parentContactNo))) return res.status(400).json({ message: "Parent contact must be 10 digits" });
    if (body.secondaryContactNo && !phoneRegex.test(String(body.secondaryContactNo))) return res.status(400).json({ message: "Secondary contact must be 10 digits" });
    if (body.whatsappNumber && !phoneRegex.test(String(body.whatsappNumber))) return res.status(400).json({ message: "Whatsapp number must be 10 digits" });
    if (body.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(String(body.email).toLowerCase())) return res.status(400).json({ message: "Invalid email format" });
    }
    if (body.pincode && !/^\d{6}$/.test(String(body.pincode))) return res.status(400).json({ message: "Pincode must be 6 digits" });

    // Append images if provided, but ensure total <= 3
    if (files.length) {
      const existingCount = profile.images ? profile.images.length : 0;
      if (existingCount + files.length > 3) {
        files.forEach(f => fs.unlinkSync(f.path));
        return res.status(400).json({ message: "Cannot upload images: would exceed 3 images total" });
      }
      const newPaths = files.map(f => `/uploads/${path.basename(f.path)}`);
      profile.images = profile.images.concat(newPaths);
    }

    // Update allowed fields (partial)
    const updatable = [
      "profileFor", "maritalStatus", "noOfChildren", "firstName", "fatherName", "surname", "gender",
      "dateOfBirth", "timeOfBirth", "birthPlace", "height", "weight", "physicalDisability", "glasses", "mangal", "expectation",
      "educationQualification", "educationDetails", "jobType", "jobDescription", "designation", "currentLocation", "incomeCurrency", "monthlyIncome",
      "fatherFullName", "motherFullName", "parentBusiness", "subcast", "nativePlace",
      "parentCountryCode", "parentContactNo", "secondaryCountryCode", "secondaryContactNo", "whatsappCountryCode", "whatsappNumber", "email",
      "addressLine1", "addressLine2", "landmark", "areaVillage", "country", "state", "city", "pincode"
    ];

    updatable.forEach(k => {
      if (body[k] !== undefined) {
        if (k === "dateOfBirth") profile[k] = new Date(body[k]);
        else profile[k] = body[k];
      }
    });

    await profile.save();

    return res.status(200).json({ message: "Profile updated successfully", profile });

  } catch (err) {
    if (req.files && req.files.length) req.files.forEach(f => { if (fs.existsSync(f.path)) fs.unlinkSync(f.path); });
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ------------------------------------------------------------
// 3) POST /profile/upload-images/:id  (only files, append up to 3 total) - requires auth and ownership
// ------------------------------------------------------------
app.post("/profile/upload-images/:id", verifyToken, upload.array("images", 3), async (req, res) => {
  try {
    const profileId = req.params.id;
    const files = req.files || [];

    if (!files.length) return res.status(400).json({ message: "No images uploaded (field name: images)" });

    const profile = await Profile.findById(profileId);
    if (!profile) {
      files.forEach(f => fs.unlinkSync(f.path));
      return res.status(404).json({ message: "Profile not found" });
    }

    // ownership check
    if (String(profile.userId) !== String(req.userId)) {
      files.forEach(f => fs.unlinkSync(f.path));
      return res.status(403).json({ message: "Not authorized to upload images for this profile" });
    }

    const existingCount = profile.images ? profile.images.length : 0;
    if (existingCount + files.length > 3) {
      files.forEach(f => fs.unlinkSync(f.path));
      return res.status(400).json({ message: "Would exceed max 3 images for profile" });
    }

    const newPaths = files.map(f => `/uploads/${path.basename(f.path)}`);
    profile.images = profile.images.concat(newPaths);
    await profile.save();

    return res.status(200).json({ message: "Images uploaded", images: profile.images });

  } catch (err) {
    if (req.files && req.files.length) req.files.forEach(f => { if (fs.existsSync(f.path)) fs.unlinkSync(f.path); });
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ------------------------------------------------------------
// 4) GET /profile/me  -> fetch profile for logged-in user (if exists)
// ------------------------------------------------------------
app.get("/profile/me", verifyToken, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.userId });
    if (!profile) return res.status(404).json({ message: "Profile not found for this user" });
    return res.status(200).json({ profile });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ------------------------------------------------------------
// DEBUG: GET /profiles/all -> check all profiles in database
// ------------------------------------------------------------
app.get("/profiles/all", async (req, res) => {
  try {
    const allProfiles = await Profile.find({});
    return res.status(200).json({
      message: "All profiles in database",
      count: allProfiles.length,
      profiles: allProfiles
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ------------------------------------------------------------
// 5) GET /profiles/fetch?gender=Male/Female&search=name&page=1 -> fetch bride/groom profiles with search and pagination
//    Public: limited fields, Auth: full profile data
// ------------------------------------------------------------
app.get("/profiles/fetch", async (req, res) => {
  try {
    const { gender, search, page = 1 } = req.query;

    if (!gender) {
      return res.status(400).json({ message: "Gender query parameter is required (Male or Female)" });
    }

    // Build search query - only show approved profiles
    let query = { gender: gender, status: 'approved' };

    if (search) {
      const searchTerm = search.trim();

      // Check if search term is a number (age search)
      if (!isNaN(searchTerm)) {
        const searchAge = parseInt(searchTerm);
        const currentYear = new Date().getFullYear();
        const birthYearStart = currentYear - searchAge - 1;
        const birthYearEnd = currentYear - searchAge;

        query.dateOfBirth = {
          $gte: new Date(birthYearStart, 0, 1),
          $lt: new Date(birthYearEnd + 1, 0, 1)
        };
      } else {
        // Search by firstName or surname
        query.$or = [
          { firstName: { $regex: searchTerm, $options: 'i' } },
          { surname: { $regex: searchTerm, $options: 'i' } }
        ];
      }
    }

    // Pagination setup
    const limit = 3;
    const skip = (page - 1) * limit;

    // Get total count for pagination info
    const totalProfiles = await Profile.countDocuments(query);
    const totalPages = Math.ceil(totalProfiles / limit);

    // Fetch profiles with pagination
    const profiles = await Profile.find(query).skip(skip).limit(limit).sort({ approvedAt: -1 });

    if (!profiles.length) {
      const message = search ?
        `There is no profile with this ${isNaN(search.trim()) ? 'name' : 'age'}.` :
        "No profiles found";

      return res.status(200).json({
        message: message,
        count: 0,
        profiles: [],
        pagination: {
          currentPage: parseInt(page),
          totalPages: 0,
          totalProfiles: 0,
          hasNextPage: false,
          hasPrevPage: false
        }
      });
    }

    // Check if user is authenticated
    const auth = req.headers["authorization"];
    let isAuthenticated = false;

    if (auth) {
      const parts = auth.split(" ");
      if (parts.length === 2 && parts[0] === "Bearer") {
        try {
          jwt.verify(parts[1], JWT_SECRET);
          isAuthenticated = true;
        } catch (err) {
          // Token invalid, treat as unauthenticated
        }
      }
    }

    // Pagination info
    const paginationInfo = {
      currentPage: parseInt(page),
      totalPages: totalPages,
      totalProfiles: totalProfiles,
      hasNextPage: parseInt(page) < totalPages,
      hasPrevPage: parseInt(page) > 1
    };

    if (!isAuthenticated) {
      // Return limited data for unauthenticated users
      const limitedProfiles = profiles.map(p => ({
        firstName: p.firstName,
        surname: p.surname,
        age: new Date().getFullYear() - new Date(p.dateOfBirth).getFullYear(),
        city: p.city,
        image: p.images?.[0] || null
      }));

      return res.status(200).json({
        message: `${gender} profiles (public view)`,
        count: limitedProfiles.length,
        profiles: limitedProfiles,
        pagination: paginationInfo
      });
    }

    // Return full data for authenticated users
    return res.status(200).json({
      message: `${gender} profiles (full data)`,
      count: profiles.length,
      profiles: profiles,
      pagination: paginationInfo
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ------------------------------------------------------------
// ADMIN REGISTRATION API
// ------------------------------------------------------------
app.post("/admin/register", async (req, res) => {
  try {
    const { firstName, lastName, email, mobile, password } = req.body;

    if (!firstName || !lastName || !email || !mobile || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    // EMAIL VALIDATION - ONLY @gmail.com ALLOWED
    const emailRegex = /^[^\s@]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Email must be @gmail.com only!" });
    }

    // MOBILE VALIDATION
    if (!/^\d{10}$/.test(mobile)) {
      return res.status(400).json({ message: "Mobile must be 10 digits!" });
    }

    // PASSWORD VALIDATION
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{1,8}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Password must contain 1 uppercase, 1 number, 1 special char & max 8 characters!"
      });
    }

    // CHECK ADMIN EXISTS
    const exists = await Admin.findOne({ $or: [{ email }, { mobile }] });
    if (exists) {
      return res.status(400).json({ message: "Admin already registered!" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await Admin.create({
      firstName,
      lastName,
      email,
      mobile,
      password: hashed,
      status: 'pending'
    });

    return res.status(200).json({ message: "Admin registration request sent for approval!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ------------------------------------------------------------
// MAIN ADMIN LOGIN API
// ------------------------------------------------------------
app.post("/main-admin/login", async (req, res) => {
  try {
    const { email, mobile, password } = req.body;

    if ((!email && !mobile) || !password) {
      return res.status(400).json({ message: "Email or Mobile and Password are required!" });
    }

    // EMAIL VALIDATION - ONLY @gmail.com ALLOWED (if email provided)
    if (email) {
      const emailRegex = /^[^\s@]+@gmail\.com$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Email must be @gmail.com only!" });
      }
    }

    const admin = await Admin.findOne({ $or: [{ email }, { mobile }], isMainAdmin: true });
    if (!admin) {
      return res.status(404).json({ message: "Main Admin not found!" });
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(400).json({ message: "Incorrect password!" });
    }

    const token = jwt.sign({ adminId: admin._id }, JWT_SECRET, { expiresIn: "1h" });

    let responseAdmin = { isMainAdmin: true };
    if (email) {
      responseAdmin.email = admin.email;
    } else {
      responseAdmin.mobile = admin.mobile;
    }

    return res.status(200).json({
      message: "Main Admin Login Successful!",
      token: token,
      admin: responseAdmin
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ------------------------------------------------------------
// NORMAL ADMIN LOGIN API
// ------------------------------------------------------------
app.post("/admin/login", async (req, res) => {
  try {
    const { email, mobile, password } = req.body;

    if ((!email && !mobile) || !password) {
      return res.status(400).json({ message: "Email or Mobile and Password are required!" });
    }

    // EMAIL VALIDATION - ONLY @gmail.com ALLOWED (if email provided)
    if (email) {
      const emailRegex = /^[^\s@]+@gmail\.com$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Email must be @gmail.com only!" });
      }
    }

    const admin = await Admin.findOne({ $or: [{ email }, { mobile }], isMainAdmin: false });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found!" });
    }

    if (admin.status !== 'approved') {
      return res.status(403).json({ message: "Admin account pending approval from main admin!" });
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(400).json({ message: "Incorrect password!" });
    }

    const token = jwt.sign({ adminId: admin._id }, JWT_SECRET, { expiresIn: "1h" });

    let responseAdmin = { isMainAdmin: false };
    if (email) {
      responseAdmin.email = admin.email;
    } else {
      responseAdmin.mobile = admin.mobile;
    }

    return res.status(200).json({
      message: "Admin Login Successful!",
      token: token,
      admin: responseAdmin
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ------------------------------------------------------------
// GET PENDING ADMIN REQUESTS (MAIN ADMIN ONLY)
// ------------------------------------------------------------
app.get("/admin/pending-requests", verifyAdminToken, verifyMainAdmin, async (req, res) => {
  try {
    const pendingAdmins = await Admin.find({ status: 'pending' }).select('-password');
    return res.status(200).json({
      message: "Pending admin requests",
      count: pendingAdmins.length,
      requests: pendingAdmins
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ------------------------------------------------------------
// APPROVE/REJECT ADMIN REQUEST (MAIN ADMIN ONLY)
// ------------------------------------------------------------
app.put("/admin/approve/:adminId", verifyAdminToken, verifyMainAdmin, async (req, res) => {
  try {
    const { adminId } = req.params;
    const { action, role } = req.body; // 'approve' or 'reject', role: 'profile_admin' or 'business_admin'

    if (!action || (action !== 'approve' && action !== 'reject')) {
      return res.status(400).json({ message: "Action must be 'approve' or 'reject'" });
    }

    if (action === 'approve' && (!role || (role !== 'profile_admin' && role !== 'business_admin'))) {
      return res.status(400).json({ message: "Role must be 'profile_admin' or 'business_admin' when approving" });
    }

    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin request not found" });
    }

    if (admin.status !== 'pending') {
      return res.status(400).json({ message: "Admin request already processed" });
    }

    admin.status = action === 'approve' ? 'approved' : 'rejected';
    admin.approvedBy = req.adminId;
    admin.approvedAt = new Date();
    if (action === 'approve') {
      admin.role = role;
    }
    await admin.save();

    return res.status(200).json({
      message: `Admin request ${action}d successfully`,
      adminId: admin._id,
      status: admin.status,
      role: admin.role
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ------------------------------------------------------------
// GET PENDING PROFILE REQUESTS (ALL APPROVED ADMINS)
// ------------------------------------------------------------
app.get("/admin/pending-profiles", verifyAdminToken, async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId);
    if (!admin || admin.status !== 'approved') {
      return res.status(403).json({ message: "Access denied. Approved admin only." });
    }

    const pendingRequests = await ProfileRequest.find({ status: 'pending' })
      .populate('profileId')
      .populate('userId', 'firstName lastName email mobile');

    return res.status(200).json({
      message: "Pending profile requests",
      count: pendingRequests.length,
      requests: pendingRequests
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ------------------------------------------------------------
// APPROVE/REJECT PROFILE REQUEST (ALL APPROVED ADMINS)
// ------------------------------------------------------------
app.put("/admin/approve-profile/:requestId", verifyAdminToken, async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId);
    if (!admin || admin.status !== 'approved') {
      return res.status(403).json({ message: "Access denied. Approved admin only." });
    }

    if (!admin.isMainAdmin && admin.role !== 'profile_admin') {
      return res.status(403).json({ message: "Access denied. Profile admin role required." });
    }

    const { requestId } = req.params;
    const { action, rejectionReason } = req.body; // 'approve' or 'reject'

    if (!action || (action !== 'approve' && action !== 'reject')) {
      return res.status(400).json({ message: "Action must be 'approve' or 'reject'" });
    }

    const profileRequest = await ProfileRequest.findById(requestId).populate('profileId');
    if (!profileRequest) {
      return res.status(404).json({ message: "Profile request not found" });
    }

    if (profileRequest.status !== 'pending') {
      return res.status(400).json({ message: "Profile request already processed" });
    }

    // Update profile request
    profileRequest.status = action === 'approve' ? 'approved' : 'rejected';
    profileRequest.approvedBy = req.adminId;
    profileRequest.approvedAt = new Date();
    if (action === 'reject' && rejectionReason) {
      profileRequest.rejectionReason = rejectionReason;
    }
    await profileRequest.save();

    // Update profile status
    const profile = await Profile.findById(profileRequest.profileId);
    if (profile) {
      profile.status = action === 'approve' ? 'approved' : 'rejected';
      profile.approvedBy = req.adminId;
      profile.approvedAt = new Date();
      await profile.save();
    }

    return res.status(200).json({
      message: `Profile ${action}d successfully`,
      requestId: profileRequest._id,
      profileId: profileRequest.profileId,
      status: profileRequest.status
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ------------------------------------------------------------
// BUSINESS REGISTRATION API (REQUIRES USER LOGIN)
// ------------------------------------------------------------
app.post("/business/register", verifyToken, upload.single("posterPhoto"), async (req, res) => {
  try {
    // Ensure user exists
    const user = await User.findById(req.userId);
    if (!user) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(401).json({ message: "User not found" });
    }

    // Prevent multiple businesses per user
    const existingBusiness = await Business.findOne({ userId: req.userId });
    if (existingBusiness) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Business already exists for this user" });
    }

    const { businessName, ownerName, email, contactNumber, address } = req.body;

    if (!businessName || !ownerName || !email || !contactNumber || !address) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "All fields are required!" });
    }

    // EMAIL VALIDATION - ONLY @gmail.com ALLOWED
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(email)) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Email must be @gmail.com only!" });
    }

    // CONTACT VALIDATION
    if (!/^\d{10}$/.test(contactNumber)) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Contact number must be 10 digits!" });
    }

    // POSTER PHOTO VALIDATION
    if (!req.file) {
      return res.status(400).json({ message: "Business poster photo is required!" });
    }

    const posterPath = `/uploads/${path.basename(req.file.path)}`;

    const business = await Business.create({
      userId: req.userId,
      businessName,
      ownerName,
      email,
      contactNumber,
      address,
      posterPhoto: posterPath,
      status: 'pending'
    });

    // Create business approval request
    await BusinessRequest.create({
      businessId: business._id,
      userId: req.userId,
      status: 'pending'
    });

    return res.status(201).json({
      message: "Business registered successfully and sent for approval",
      businessId: business._id,
      status: "pending"
    });
  } catch (err) {
    if (req.file) fs.unlinkSync(req.file.path);
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ------------------------------------------------------------
// GET PENDING BUSINESS REQUESTS (BUSINESS ADMINS ONLY)
// ------------------------------------------------------------
app.get("/admin/pending-businesses", verifyAdminToken, async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId);
    if (!admin || admin.status !== 'approved') {
      return res.status(403).json({ message: "Access denied. Approved admin only." });
    }

    if (!admin.isMainAdmin && admin.role !== 'business_admin') {
      return res.status(403).json({ message: "Access denied. Business admin role required." });
    }

    const pendingRequests = await BusinessRequest.find({ status: 'pending' })
      .populate('businessId');

    return res.status(200).json({
      message: "Pending business requests",
      count: pendingRequests.length,
      requests: pendingRequests
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ------------------------------------------------------------
// APPROVE/REJECT BUSINESS REQUEST (BUSINESS ADMINS ONLY)
// ------------------------------------------------------------
app.put("/admin/approve-business/:requestId", verifyAdminToken, async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId);
    if (!admin || admin.status !== 'approved') {
      return res.status(403).json({ message: "Access denied. Approved admin only." });
    }

    if (!admin.isMainAdmin && admin.role !== 'business_admin') {
      return res.status(403).json({ message: "Access denied. Business admin role required." });
    }

    const { requestId } = req.params;
    const { action, rejectionReason } = req.body;

    if (!action || (action !== 'approve' && action !== 'reject')) {
      return res.status(400).json({ message: "Action must be 'approve' or 'reject'" });
    }

    const businessRequest = await BusinessRequest.findById(requestId).populate('businessId');
    if (!businessRequest) {
      return res.status(404).json({ message: "Business request not found" });
    }

    if (businessRequest.status !== 'pending') {
      return res.status(400).json({ message: "Business request already processed" });
    }

    // Update business request
    businessRequest.status = action === 'approve' ? 'approved' : 'rejected';
    businessRequest.approvedBy = req.adminId;
    businessRequest.approvedAt = new Date();
    if (action === 'reject' && rejectionReason) {
      businessRequest.rejectionReason = rejectionReason;
    }
    await businessRequest.save();

    // Update business status
    const business = await Business.findById(businessRequest.businessId);
    if (business) {
      business.status = action === 'approve' ? 'approved' : 'rejected';
      business.approvedBy = req.adminId;
      business.approvedAt = new Date();
      await business.save();
    }

    return res.status(200).json({
      message: `Business ${action}d successfully`,
      requestId: businessRequest._id,
      businessId: businessRequest.businessId,
      status: businessRequest.status
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ------------------------------------------------------------
// GET ADVERTISED BUSINESSES (APPROVED ONLY) WITH SEARCH & PAGINATION
// ------------------------------------------------------------
app.get("/businesses/fetch", async (req, res) => {
  try {
    const { search, page = 1 } = req.query;

    // Build search query - only show approved businesses
    let query = { status: 'approved' };

    if (search) {
      const searchTerm = search.trim();
      // Search by business name
      query.businessName = { $regex: searchTerm, $options: 'i' };
    }

    // Pagination setup
    const limit = 3; // 3 businesses per page
    const skip = (page - 1) * limit;

    // Get total count for pagination info
    const totalBusinesses = await Business.countDocuments(query);
    const totalPages = Math.ceil(totalBusinesses / limit);

    // Fetch businesses with pagination
    const businesses = await Business.find(query).skip(skip).limit(limit).sort({ approvedAt: -1 });

    if (!businesses.length) {
      const message = search ?
        "There is no business with this name." :
        "No advertised businesses found";

      return res.status(200).json({
        message: message,
        count: 0,
        businesses: [],
        pagination: {
          currentPage: parseInt(page),
          totalPages: 0,
          totalBusinesses: 0,
          hasNextPage: false,
          hasPrevPage: false
        }
      });
    }

    // Check if user is authenticated
    const auth = req.headers["authorization"];
    let isAuthenticated = false;

    if (auth) {
      const parts = auth.split(" ");
      if (parts.length === 2 && parts[0] === "Bearer") {
        try {
          jwt.verify(parts[1], JWT_SECRET);
          isAuthenticated = true;
        } catch (err) {
          // Token invalid, treat as unauthenticated
        }
      }
    }

    // Pagination info
    const paginationInfo = {
      currentPage: parseInt(page),
      totalPages: totalPages,
      totalBusinesses: totalBusinesses,
      hasNextPage: parseInt(page) < totalPages,
      hasPrevPage: parseInt(page) > 1
    };

    if (!isAuthenticated) {
      // Return limited data for unauthenticated users
      const limitedBusinesses = businesses.map(b => ({
        businessName: b.businessName,
        ownerName: b.ownerName,
        address: b.address,
        posterPhoto: b.posterPhoto
      }));

      return res.status(200).json({
        message: "Advertised businesses (public view)",
        count: limitedBusinesses.length,
        businesses: limitedBusinesses,
        pagination: paginationInfo
      });
    }

    // Return full data for authenticated users
    return res.status(200).json({
      message: "Advertised businesses (full data)",
      count: businesses.length,
      businesses: businesses,
      pagination: paginationInfo
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ------------------------------------------------------------
// USER UPDATE BUSINESS API
// ------------------------------------------------------------
app.put("/business/update/:id", verifyToken, upload.single("posterPhoto"), async (req, res) => {
  try {
    const businessId = req.params.id;
    const body = req.body;

    const business = await Business.findById(businessId);
    if (!business) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: "Business not found" });
    }

    // Ownership check
    if (String(business.userId) !== String(req.userId)) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(403).json({ message: "Not authorized to update this business" });
    }

    // Validations if provided
    if (body.email) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
      if (!emailRegex.test(body.email)) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: "Email must be @gmail.com only" });
      }
    }
    if (body.contactNumber && !/^\d{10}$/.test(body.contactNumber)) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Contact number must be 10 digits" });
    }

    // Update poster photo if provided
    if (req.file) {
      business.posterPhoto = `/uploads/${path.basename(req.file.path)}`;
    }

    // Update allowed fields (partial)
    const updatable = ["businessName", "ownerName", "email", "contactNumber", "address"];

    updatable.forEach(k => {
      if (body[k] !== undefined) {
        business[k] = body[k];
      }
    });

    await business.save();

    return res.status(200).json({
      message: "Business updated successfully",
      business
    });

  } catch (err) {
    if (req.file) fs.unlinkSync(req.file.path);
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ------------------------------------------------------------
// MAIN ADMIN EDIT PROFILE API
// ------------------------------------------------------------
app.put("/main-admin/edit-profile/:profileId", verifyAdminToken, verifyMainAdmin, upload.array("images", 3), async (req, res) => {
  try {
    const { profileId } = req.params;
    const body = req.body;
    const files = req.files || [];

    const profile = await Profile.findById(profileId);
    if (!profile) {
      if (files.length) files.forEach(f => fs.unlinkSync(f.path));
      return res.status(404).json({ message: "Profile not found" });
    }

    // Validations if provided
    const phoneRegex = /^\d{10}$/;
    if (body.parentContactNo && !phoneRegex.test(String(body.parentContactNo))) {
      if (files.length) files.forEach(f => fs.unlinkSync(f.path));
      return res.status(400).json({ message: "Parent contact must be 10 digits" });
    }
    if (body.secondaryContactNo && !phoneRegex.test(String(body.secondaryContactNo))) {
      if (files.length) files.forEach(f => fs.unlinkSync(f.path));
      return res.status(400).json({ message: "Secondary contact must be 10 digits" });
    }
    if (body.whatsappNumber && !phoneRegex.test(String(body.whatsappNumber))) {
      if (files.length) files.forEach(f => fs.unlinkSync(f.path));
      return res.status(400).json({ message: "Whatsapp number must be 10 digits" });
    }
    if (body.email) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
      if (!emailRegex.test(String(body.email).toLowerCase())) {
        if (files.length) files.forEach(f => fs.unlinkSync(f.path));
        return res.status(400).json({ message: "Email must be @gmail.com only" });
      }
    }
    if (body.pincode && !/^\d{6}$/.test(String(body.pincode))) {
      if (files.length) files.forEach(f => fs.unlinkSync(f.path));
      return res.status(400).json({ message: "Pincode must be 6 digits" });
    }

    // Replace images if provided
    if (files.length) {
      if (files.length > 3) {
        files.forEach(f => fs.unlinkSync(f.path));
        return res.status(400).json({ message: "Maximum 3 images allowed" });
      }
      const newPaths = files.map(f => `/uploads/${path.basename(f.path)}`);
      profile.images = newPaths;
    }

    // Update all allowed fields
    const updatable = [
      "profileFor", "maritalStatus", "noOfChildren", "firstName", "fatherName", "surname", "gender",
      "dateOfBirth", "timeOfBirth", "birthPlace", "height", "weight", "physicalDisability", "glasses", "mangal", "expectation",
      "educationQualification", "educationDetails", "jobType", "jobDescription", "designation", "currentLocation", "incomeCurrency", "monthlyIncome",
      "fatherFullName", "motherFullName", "parentBusiness", "subcast", "nativePlace",
      "parentCountryCode", "parentContactNo", "secondaryCountryCode", "secondaryContactNo", "whatsappCountryCode", "whatsappNumber", "email",
      "addressLine1", "addressLine2", "landmark", "areaVillage", "country", "state", "city", "pincode", "status"
    ];

    updatable.forEach(k => {
      if (body[k] !== undefined) {
        if (k === "dateOfBirth") profile[k] = new Date(body[k]);
        else profile[k] = body[k];
      }
    });

    await profile.save();

    return res.status(200).json({
      message: "Profile updated successfully by main admin",
      profile
    });

  } catch (err) {
    if (req.files && req.files.length) req.files.forEach(f => { if (fs.existsSync(f.path)) fs.unlinkSync(f.path); });
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
})

// ------------------------------------------------------------
// MAIN ADMIN EDIT BUSINESS API
// ------------------------------------------------------------
app.put("/main-admin/edit-business/:businessId", verifyAdminToken, verifyMainAdmin, upload.single("posterPhoto"), async (req, res) => {
  try {
    const { businessId } = req.params;
    const body = req.body;

    const business = await Business.findById(businessId);
    if (!business) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: "Business not found" });
    }

    // Validations if provided
    if (body.email) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
      if (!emailRegex.test(body.email)) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(400).json({ message: "Email must be @gmail.com only" });
      }
    }
    if (body.contactNumber && !/^\d{10}$/.test(body.contactNumber)) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "Contact number must be 10 digits" });
    }

    // Update poster photo if provided
    if (req.file) {
      business.posterPhoto = `/uploads/${path.basename(req.file.path)}`;
    }

    // Update all allowed fields
    const updatable = ["businessName", "ownerName", "email", "contactNumber", "address", "status"];

    updatable.forEach(k => {
      if (body[k] !== undefined) {
        business[k] = body[k];
      }
    });

    await business.save();

    return res.status(200).json({
      message: "Business updated successfully by main admin",
      business
    });

  } catch (err) {
    if (req.file) fs.unlinkSync(req.file.path);
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ------------------------------------------------------------
// 🔎 GET SINGLE PROFILE (ADMIN)
// ------------------------------------------------------------
app.get("/api/admin/profiles/:id", verifyAdminToken, async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ------------------------------------------------------------
// 🔎 GET SINGLE BUSINESS (ADMIN)
// ------------------------------------------------------------
app.get("/api/admin/business/:id", verifyAdminToken, async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) return res.status(404).json({ message: "Business not found" });
    res.json(business);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ------------------------------------------------------------
// 📅 EVENTS CRUD API (ADMIN)
// ------------------------------------------------------------

// 1. ADD EVENT
// 1. ADD EVENT
app.post("/api/admin/events", verifyAdminToken, upload.array("images", 5), async (req, res) => {
  try {
    console.log(">> ADD EVENT REQUEST RECEIVED");
    console.log("Body:", req.body);
    console.log("Files:", req.files ? req.files.length : 0);

    const { title, description, date } = req.body;
    const files = req.files || [];

    if (!title || !date) {
      console.log("Missing title or date");
      // Cleanup files safely
      files.forEach(f => {
        try { if (fs.existsSync(f.path)) fs.unlinkSync(f.path); } catch (e) { console.error("Cleanup error:", e.message); }
      });
      return res.status(400).json({ message: "Title and Date are required" });
    }

    if (files.length > 5) {
      console.log("Too many files");
      files.forEach(f => {
        try { if (fs.existsSync(f.path)) fs.unlinkSync(f.path); } catch (e) { console.error("Cleanup error:", e.message); }
      });
      return res.status(400).json({ message: "Maximum 5 images allowed" });
    }

    const imagePaths = files.map(f => `/uploads/${path.basename(f.path)}`);

    console.log("Creating DB Entry...");
    const newEvent = await Event.create({
      title,
      description,
      date: new Date(date),
      images: imagePaths
    });
    console.log("Event Created:", newEvent._id);

    return res.status(201).json({ message: "Event created successfully", event: newEvent });

  } catch (err) {
    console.error("❌ ADD EVENT ERROR:", err);
    // Safe cleanup
    if (req.files && req.files.length) {
      req.files.forEach(f => {
        try { if (fs.existsSync(f.path)) fs.unlinkSync(f.path); } catch (e) { console.error("Cleanup error:", e.message); }
      });
    }
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// 2. GET ALL EVENTS
app.get("/api/admin/events", verifyAdminToken, async (req, res) => {
  try {
    const events = await Event.find({}).sort({ date: 1 });
    return res.status(200).json(events);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// 3. GET SINGLE EVENT
app.get("/api/admin/events/:id", verifyAdminToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    return res.status(200).json(event);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// 4. UPDATE EVENT
app.put("/api/admin/events/:id", verifyAdminToken, upload.array("images", 5), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, existingImages } = req.body; // existingImages sent as JSON string or array
    const files = req.files || [];

    const event = await Event.findById(id);
    if (!event) {
      if (files.length) files.forEach(f => fs.unlinkSync(f.path));
      return res.status(404).json({ message: "Event not found" });
    }

    // Keep existing images (parse if string)
    let keptImages = [];
    if (existingImages) {
      if (Array.isArray(existingImages)) keptImages = existingImages;
      else keptImages = [existingImages];
    }

    // Check total images
    if (keptImages.length + files.length > 5) {
      if (files.length) files.forEach(f => fs.unlinkSync(f.path));
      return res.status(400).json({ message: "Total images cannot exceed 5" });
    }

    const newImagePaths = files.map(f => `/uploads/${path.basename(f.path)}`);
    const finalImages = [...keptImages, ...newImagePaths];

    event.title = title || event.title;
    event.description = description || event.description;
    if (date) event.date = new Date(date);
    event.images = finalImages;

    await event.save();

    return res.status(200).json({ message: "Event updated successfully", event });

  } catch (err) {
    if (req.files && req.files.length) req.files.forEach(f => { if (fs.existsSync(f.path)) fs.unlinkSync(f.path); });
    console.error(err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

// 5. DELETE EVENT
app.delete("/api/admin/events/:id", verifyAdminToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // Optional: Delete images from disk (advanced) - for now just delete DB record
    // event.images.forEach(...)

    await Event.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

async function createSuperAdmin() {
  try {
    // 1. Check if Super Admin already exists
    const existingAdmin = await Admin.findOne({ email: SUPER_ADMIN_EMAIL });
    if (existingAdmin) {
      console.log(">> CHECK: Super Admin already exists. No action taken.");
      return;
    }

    // 2. Create Super Admin if not exists
    console.log(">> CREATING: Super Admin not found. Creating now...");

    // Hash password
    const hashedPassword = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 10);

    const newAdmin = new Admin({
      firstName: "Super",
      lastName: "Admin",
      email: SUPER_ADMIN_EMAIL,
      mobile: SUPER_ADMIN_MOBILE,
      password: hashedPassword,
      isMainAdmin: true,
      role: "super-admin",
      status: "approved"
    });

    await newAdmin.save();
    console.log("✅ SUCCESS: Super Admin created successfully!");

  } catch (error) {
    console.error("❌ ERROR: Failed to create Super Admin:", error.message);
  }
}

// ------------------------------------------------------------
// 📊 DASHBOARD COUNTS API
// ------------------------------------------------------------
app.get("/api/admin/dashboard/counts", verifyAdminToken, async (req, res) => {
  try {
    // Case-insensitive gender check with whitespace tolerance
    const totalBrides = await Profile.countDocuments({ gender: { $regex: /^\s*female\s*$/i }, status: 'approved' });
    const totalGrooms = await Profile.countDocuments({ gender: { $regex: /^\s*male\s*$/i }, status: 'approved' });
    const totalBusiness = await Business.countDocuments({ status: 'approved' });
    const totalEvents = await Event.countDocuments({});

    res.status(200).json({
      totalBrides,
      totalGrooms,
      totalBusiness,
      totalEvents
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ------------------------------------------------------------
// 👰 BRIDES LIST API (Internal Admin)
// ------------------------------------------------------------
app.get("/api/admin/brides", verifyAdminToken, async (req, res) => {
  try {
    const brides = await Profile.find({ gender: { $regex: /^\s*female\s*$/i }, status: 'approved' }).sort({ createdAt: -1 });
    res.status(200).json(brides);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ------------------------------------------------------------
// 🤵 GROOMS LIST API (Internal Admin)
// ------------------------------------------------------------
app.get("/api/admin/grooms", verifyAdminToken, async (req, res) => {
  try {
    const grooms = await Profile.find({ gender: { $regex: /^\s*male\s*$/i }, status: 'approved' }).sort({ createdAt: -1 });
    res.status(200).json(grooms);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ------------------------------------------------------------
// 🏢 BUSINESS LIST API (Internal Admin)
// ------------------------------------------------------------
app.get("/api/admin/business", verifyAdminToken, async (req, res) => {
  try {
    const business = await Business.find({ status: 'approved' }).sort({ createdAt: -1 });
    res.status(200).json(business);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ------------------------------------------------------------
app.listen(3001, () => {
  console.log("Server running on port 3001");
});

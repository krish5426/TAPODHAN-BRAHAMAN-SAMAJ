require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer');
const axios = require("axios");

/* =========================
   DB IMPORTS
========================= */
const { connectDB, getPool } = require("./mysql-config");
const { createTables } = require("./mysql-schema");
const { User, Admin, Profile, ProfileRequest, Business, Event } = require('./mysql-models');

/* =========================
   MIDDLEWARES
========================= */
app.use(cors({
  origin: [

    // "https://tapodhanbrahmansamaj.com",
    //"https://www.tapodhanbrahmansamaj.com",

    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.disable("etag");
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "MY_SECRET_KEY";

// Upload Configuration
const UPLOAD_DIR = path.join(__dirname, "uploads");
const PROFILE_UPLOAD_DIR = path.join(UPLOAD_DIR, "profile");
const EVENTS_UPLOAD_DIR = path.join(UPLOAD_DIR, "events");

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
      console.log('Created directory:', dir);
    } catch (err) {
      console.error("Failed to create directory:", dir, err);
    }
  }
};

ensureDir(PROFILE_UPLOAD_DIR);
ensureDir(EVENTS_UPLOAD_DIR);

// Profile Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PROFILE_UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fname = `profile_${Date.now()}_${Math.round(Math.random() * 1E9)}${ext}`;
    cb(null, fname);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/i;
    const ext = path.extname(file.originalname);
    if (allowed.test(ext)) cb(null, true);
    else cb(new Error("Only images (jpg, jpeg, png, webp) are allowed"));
  }
});

// Event Storage
const eventStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, EVENTS_UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fname = `event_${Date.now()}_${Math.round(Math.random() * 1E9)}${ext}`;
    cb(null, fname);
  }
});

const eventUpload = multer({
  storage: eventStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/i;
    const ext = path.extname(file.originalname);
    if (allowed.test(ext)) cb(null, true);
    else cb(new Error("Only images (jpg, jpeg, png, webp) are allowed"));
  }
}).any();

// Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

/* =========================
   ROOT TEST ROUTE
========================= */
app.get("/", (req, res) => {
  res.status(200).send("API working");
});

/* =========================
   EVENTS ROUTE (SAFE)
========================= */
// Get Events
app.get("/events", async (req, res) => {
  try {
    const events = await Event.findAll();
    res.json(events);
  } catch (error) {
    console.error("Get events error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get Profiles
app.get("/profiles", async (req, res) => {
  try {
    const { status, gender, ageMin, ageMax, maritalStatus } = req.query;
    const filters = {};

    if (status) filters.status = status;
    if (gender) filters.gender = gender;
    if (ageMin) filters.ageMin = parseInt(ageMin);
    if (ageMax) filters.ageMax = parseInt(ageMax);
    if (maritalStatus) filters.maritalStatus = maritalStatus;

    const profiles = await Profile.findAll(filters);
    res.json(profiles);
  } catch (error) {
    console.error("Get profiles error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get Profile by ID
app.get("/profiles/:id", async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    res.json(profile);
  } catch (error) {
    console.error("Get profile by ID error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get Businesses
app.get("/businesses", async (req, res) => {
  try {
    const { status, businessName, location } = req.query;
    const filters = {};

    if (status) filters.status = status;
    if (businessName) filters.businessName = businessName;
    if (location) filters.location = location;

    const businesses = await Business.findAll(filters);
    res.json(businesses);
  } catch (error) {
    console.error("Get businesses error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get user profile
app.get("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove password from response
    const { password, ...userProfile } = user;
    res.json(userProfile);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get user's matrimony profiles (multiple)
app.get("/my-matrimony-profiles", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const profiles = await Profile.findAllByUserId(userId);

    res.json(profiles);
  } catch (error) {
    console.error("Get my matrimony profiles error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get user's matrimony profile (legacy - returns first profile)
app.get("/my-matrimony-profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const profile = await Profile.findByUserId(userId);

    if (!profile) {
      return res.status(404).json({ message: "No matrimony profile found" });
    }

    res.json(profile);
  } catch (error) {
    console.error("Get my matrimony profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get User's Businesses
app.get("/my-business", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const businesses = await Business.findAllByUserId(userId);

    res.json(businesses || []);
  } catch (error) {
    console.error("Get my business error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get Businesses
app.get("/businesses", async (req, res) => {
  try {
    const { status, businessName, location } = req.query;
    const filters = {};

    if (status) filters.status = status;
    if (businessName) filters.businessName = businessName;
    if (location) filters.location = location;

    const businesses = await Business.findAll(filters);
    res.json(businesses);
  } catch (error) {
    console.error("Get businesses error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get Profile Requests
app.get("/profile-requests", async (req, res) => {
  try {
    const { status } = req.query;
    const filters = {};

    if (status) filters.status = status;

    const requests = await ProfileRequest.findAll(filters);
    res.json(requests);
  } catch (error) {
    console.error("Get profile requests error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Admin API endpoints
app.get("/api/admin/bride", authenticateToken, async (req, res) => {
  try {
    const brides = await Profile.findAll({ status: 'approved', gender: 'Female' });
    res.json(brides);
  } catch (error) {
    console.error("Get admin brides error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/admin/brides", authenticateToken, async (req, res) => {
  try {
    const brides = await Profile.findAll({ gender: 'Female' });
    res.json(brides);
  } catch (error) {
    console.error("Get admin brides error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/admin/matrimony/grooms", authenticateToken, async (req, res) => {
  try {
    const grooms = await Profile.findAll({ gender: 'Male' });
    res.json(grooms);
  } catch (error) {
    console.error("Get admin grooms error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/admin/grooms", authenticateToken, async (req, res) => {
  try {
    const grooms = await Profile.findAll({ gender: 'Male' });
    res.json(grooms);
  } catch (error) {
    console.error("Get admin grooms error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Test route without auth
app.get("/test/grooms", async (req, res) => {
  try {
    const grooms = await Profile.findAll({ gender: 'Male' });
    res.json({ count: grooms.length, grooms });
  } catch (error) {
    console.error("Test grooms error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Debug route to check all profiles
app.get("/test/profiles", async (req, res) => {
  try {
    const allProfiles = await Profile.findAll();
    const pendingProfiles = await Profile.findAll({ status: 'pending' });
    res.json({
      total: allProfiles.length,
      pending: pendingProfiles.length,
      allProfiles: allProfiles.slice(0, 3), // Show first 3 for debugging
      pendingProfiles
    });
  } catch (error) {
    console.error("Test profiles error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/admin/business", authenticateToken, async (req, res) => {
  try {
    const { search, businessName, location } = req.query;
    const filters = {};
    if (search) filters.search = search; // Keep legacy support if needed, or remove
    if (businessName) filters.businessName = businessName;
    if (location) filters.location = location;

    const businesses = await Business.findAll(filters);
    res.json(businesses);
  } catch (error) {
    console.error("Get admin businesses error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/admin/profiles", authenticateToken, async (req, res) => {
  try {
    const { status } = req.query;
    const filters = {};
    if (status) filters.status = status;

    const profiles = await Profile.findAll(filters);
    res.json(profiles);
  } catch (error) {
    console.error("Get admin profiles error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/admin/profiles/:id", authenticateToken, async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});


// Dashboard Counts
app.get("/api/admin/dashboard/counts", authenticateToken, async (req, res) => {
  try {
    const totalBrides = (await Profile.findAll({ gender: 'Female' })).length;
    const totalGrooms = (await Profile.findAll({ gender: 'Male' })).length;
    const totalBusiness = (await Business.findAll()).length;
    const totalEvents = (await Event.findAll()).length;
    const pendingBusinessRequests = (await Business.findAll({ status: 'pending' })).length;
    const pendingProfiles = (await Profile.findAll({ status: 'pending' })).length;

    res.json({
      totalBrides,
      totalGrooms,
      totalBusiness,
      totalEvents,
      pendingBusinessRequests,
      pendingProfiles
    });
  } catch (error) {
    console.error("Dashboard counts error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Admin Events
app.get("/api/admin/events", authenticateToken, async (req, res) => {
  try {
    const events = await Event.findAll();
    res.json(events);
  } catch (error) {
    console.error("Get admin events error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Admin Events
app.get("/api/admin/events", authenticateToken, async (req, res) => {
  try {
    const events = await Event.findAll();
    res.json(events);
  } catch (error) {
    console.error("Get admin events error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/api/admin/business/:id", authenticateToken, async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) return res.status(404).json({ message: "Business not found" });
    res.json(business);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});



// Create Business by Admin
app.post("/api/admin/business", authenticateToken, upload.single("posterPhoto"), async (req, res) => {
  try {
    console.log("Admin create business body:", req.body);
    console.log("Admin create business file:", req.file);

    const {
      businessName, ownerName, email, contactNumber, address,
      status, category, businessType, description, website, city, state
    } = req.body;

    if (!businessName || !ownerName || !contactNumber || !address) {
      return res.status(400).json({ message: "All required fields must be provided: Business Name, Owner Name, Contact Number, Address." });
    }

    // 1. Find or Create User
    let user = null;

    // Try to find by email if provided
    if (email) {
      user = await User.findByEmail(email);
    }

    // If not found by email (or email not provided), try by mobile
    if (!user) {
      user = await User.findByMobile(contactNumber);
    }

    let userId;
    if (user) {
      userId = user.id;
      // Check if user already has a business
      const existingBusiness = await Business.findByUserId(userId);
      if (existingBusiness) {
        return res.status(400).json({ message: "This user already has a registered business." });
      }
    } else {
      // Create new user
      const hashedPassword = await bcrypt.hash("123456", 10); // Default password
      const nameParts = ownerName.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ") || ".";

      const newUser = await User.create({
        firstName,
        lastName,
        email: email || null, // Allow null email if DB supports it, or it will fail if UNIQUE constraint is strict on empty strings
        mobile: contactNumber,
        password: hashedPassword,
        registerForProfile: false,
        acceptTerms: true
      });
      userId = newUser.id;
    }

    // 2. Create Business
    // Handle optional poster photo
    const posterPhoto = req.file ? req.file.filename : "default_business.jpg"; // Use a default or empty string if allowed

    const businessData = {
      userId,
      businessName,
      ownerName,
      email: email || "", // Use empty string for business email if missing (DB requires NOT NULL)
      contactNumber,
      address,
      posterPhoto,
      status: status || 'approved',
      category,
      businessType,
      description,
      website,
      city,
      state
    };

    const newBusiness = await Business.create(businessData);

    // 3. Send Emails (Only if email exists)
    if (email) {
      try {
        await sendBusinessStatusEmail(email, ownerName, businessName, status || 'approved');
      } catch (emailError) {
        console.error('Failed to send business registration emails:', emailError);
      }
    }

    res.status(201).json({
      message: "Business created successfully",
      business: newBusiness
    });

  } catch (error) {
    console.error("Create admin business error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// Delete Business by Admin
app.delete("/api/admin/business/:id", authenticateToken, async (req, res) => {
  try {
    const result = await Business.delete(req.params.id);
    if (result) {
      res.json({ message: "Business deleted successfully" });
    } else {
      res.status(404).json({ message: "Business not found" });
    }
  } catch (error) {
    console.error("Delete business error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get User Profile
app.get("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove password from response
    const { password, ...userProfile } = user;
    res.json(userProfile);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// User Registration
app.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, mobile, password, registerForProfile, acceptTerms } = req.body;

    if (!firstName || !lastName || !email || !mobile || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUserByEmail = await User.findByEmail(email);
    if (existingUserByEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const existingUserByMobile = await User.findByMobile(mobile);
    if (existingUserByMobile) {
      return res.status(400).json({ message: "Mobile number already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      mobile,
      password: hashedPassword,
      registerForProfile: registerForProfile || false,
      acceptTerms: acceptTerms || false
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        mobile: newUser.mobile
      }
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// User Login
app.post("/login", async (req, res) => {
  try {
    const { email: identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: "Email/Mobile and password are required" });
    }

    let user;
    if (identifier.includes('@')) {
      user = await User.findByEmail(identifier);
    } else {
      user = await User.findByMobile(identifier);
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Forgot Password
app.post("/forgot-password", async (req, res) => {
  try {
    const { identifier } = req.body;

    if (!identifier) {
      return res.status(400).json({ message: "Email or Mobile Number is required" });
    }

    let user;
    let isEmail = false;

    if (identifier.includes('@')) {
      user = await User.findByEmail(identifier);
      isEmail = true;
    } else {
      user = await User.findByMobile(identifier);
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

    await User.saveOtp(user.id, otp, expiry);

    if (isEmail) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.hostinger.com',
        port: process.env.SMTP_PORT || 465,
        secure: process.env.SMTP_PORT == 465, // Use `true` for port 465, `false` for all other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      const mailOptions = {
        from: `"Tapodhan Brahman Samaj" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: 'Password Reset OTP - Tapodhan Brahman Samaj',
        html: `
          <h3>Password Reset Request</h3>
          <p>Dear ${user.firstName},</p>
          <p>Your OTP for password reset is <strong>${otp}</strong>.</p>
          <p>This OTP is valid for 15 minutes.</p>
          <p>If you didn't request this, you can safely ignore this email.</p>
        `
      };

      await transporter.sendMail(mailOptions);
    } else {
      // Send SMS via Brevo
      const brevoApiKey = process.env.BREVO_API_KEY;

      if (!brevoApiKey) {
        console.warn("BREVO_API_KEY not configured. Falling back to returning OTP in response for development.");
        return res.json({ message: "OTP generated", devOtp: otp });
      }

      try {
        await axios.post(
          'https://api.brevo.com/v3/transactionalSMS/sms',
          {
            sender: 'TAPODHAN', // Customize sender up to 11 chars
            recipient: `+91${user.mobile}`, // Assuming Indian numbers, or format accordingly
            content: `Your OTP for Tapodhan Brahman Samaj password reset is ${otp}. Valid for 15 mins.`,
            type: "transactional"
          },
          {
            headers: {
              'accept': 'application/json',
              'api-key': brevoApiKey,
              'content-type': 'application/json'
            }
          }
        );
      } catch (smsError) {
        console.warn("SMS sending failed (likely out of credits). Returning OTP in response for development.", smsError.response?.data || smsError.message);
        return res.json({ message: "OTP generated but SMS failed. Use this OTP for testing.", devOtp: otp });
      }
    }

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Reset Password
app.post("/reset-password", async (req, res) => {
  try {
    const { identifier, otp, newPassword } = req.body;

    if (!identifier || !otp || !newPassword) {
      return res.status(400).json({ message: "Identifier, OTP, and new password are required" });
    }

    let user;
    if (identifier.includes('@')) {
      user = await User.findByEmail(identifier);
    } else {
      user = await User.findByMobile(identifier);
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.resetOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (new Date() > new Date(user.resetOtpExpiry)) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updatePassword(user.id, hashedPassword);

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Change Password
app.post("/change-password", authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current password and new password are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.updatePassword(user.id, hashedPassword);

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Admin Login
app.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const admin = await Admin.findByEmail(email);
    if (!admin) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (admin.status !== 'approved') {
      return res.status(400).json({ message: "Admin account not approved" });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { adminId: admin.id, email: admin.email, role: admin.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      message: "Admin login successful",
      token,
      admin: {
        id: admin.id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email,
        role: admin.role,
        isMainAdmin: admin.isMainAdmin
      }
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Profile Creation
app.post("/profile", authenticateToken, upload.single("profilePhoto"), async (req, res) => {
  try {
    const userId = req.user.userId;

    const profileData = { ...req.body, userId };

    if (req.file) {
      profileData.profilePhoto = req.file.filename;
    }

    const newProfile = await Profile.create(profileData);

    res.status(201).json({
      message: "Profile created successfully",
      profile: newProfile
    });
  } catch (error) {
    console.error("Profile creation error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Business Registration
app.post("/business", authenticateToken, upload.single("posterPhoto"), async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log('Business registration request:', { userId, body: req.body, file: req.file });

    const { businessName, ownerName, email, contactNumber, address } = req.body;

    // Removed email from required fields to match admin route consistency
    if (!businessName || !ownerName || !contactNumber || !address) {
      return res.status(400).json({ message: "All required fields must be provided: Business Name, Owner Name, Contact Number, Address." });
    }

    // Handle optional poster photo
    const posterPhoto = req.file ? `profile/${req.file.filename}` : "default_business.jpg";

    const businessData = {
      ...req.body,
      userId,
      email: email || "", // Allow empty email
      posterPhoto,
      status: 'pending'
    };

    const newBusiness = await Business.create(businessData);

    // Send email notifications only if email is provided
    if (email) {
      console.log('Attempting to send business registration emails...');
      try {
        await sendBusinessRegistrationEmails(email, ownerName, businessName);
        console.log('Business registration emails sent successfully');
      } catch (emailError) {
        console.error('Failed to send business registration emails:', emailError);
      }
    }

    res.status(201).json({
      message: "Business registered successfully",
      business: newBusiness
    });
  } catch (error) {
    console.error("Business registration error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });

  }
});

// Email notification function
async function sendBusinessRegistrationEmails(userEmail, ownerName, businessName) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('SMTP not configured, skipping business registration emails');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  // Email to user
  console.log('Sending email to user:', userEmail);
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: userEmail,
    subject: 'Business Registration Received',
    html: `
      <h2>Thank you for registering your business!</h2>
      <p>Dear ${ownerName},</p>
      <p>Your business "${businessName}" has been successfully registered and is pending approval.</p>
      <p>You will receive a notification once your business is approved by our admin team.</p>
      <p>Best regards,<br>Tapodhan Brahman Samaj Team</p>
    `
  });
  console.log('User email sent');

  // Email to admin
  console.log('Sending email to admin:', process.env.SMTP_TO);
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: process.env.SMTP_TO,
    subject: 'New Business Registration - Approval Required',
    html: `
      <h2>New Business Registration</h2>
      <p>A new business has been registered and requires your approval:</p>
      <ul>
        <li><strong>Business Name:</strong> ${businessName}</li>
        <li><strong>Owner:</strong> ${ownerName}</li>
        <li><strong>Email:</strong> ${userEmail}</li>
      </ul>
      <p>Please login to the admin panel to review and approve this business.</p>
    `
  });
  console.log('Admin email sent');
}

// Email notification for business status change
async function sendBusinessStatusEmail(userEmail, ownerName, businessName, status) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('SMTP not configured, skipping status email');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  const isApproved = status === 'approved';
  const subject = isApproved ? 'Business Approved!' : 'Business Registration Update';
  const message = isApproved
    ? `<h2>Congratulations!</h2>
       <p>Dear ${ownerName},</p>
       <p>Your business "${businessName}" has been approved and is now live on our platform.</p>
       <p>Thank you for being part of Tapodhan Brahman Samaj community.</p>
       <p>Best regards,<br>Tapodhan Brahman Samaj Team</p>`
    : `<h2>Business Registration Update</h2>
       <p>Dear ${ownerName},</p>
       <p>We regret to inform you that your business "${businessName}" registration has been rejected.</p>
       <p>If you have any questions, please contact our support team.</p>
       <p>Best regards,<br>Tapodhan Brahman Samaj Team</p>`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: userEmail,
    subject,
    html: message
  });
  console.log(`Status email sent to ${userEmail}`);
}


// Update user profile
app.put("/profile", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { firstName, lastName, mobile } = req.body;

    if (!firstName || !lastName || !mobile) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const pool = getPool();
    await pool.execute(
      'UPDATE users SET firstName = ?, lastName = ?, mobile = ? WHERE id = ?',
      [firstName, lastName, mobile, userId]
    );

    const updatedUser = await User.findById(userId);
    const { password, ...userProfile } = updatedUser;

    res.json({ message: "Profile updated successfully", user: userProfile });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Event Creation
app.post("/events", upload.array("images", 5), async (req, res) => {
  try {
    const { title, description, date } = req.body;

    if (!title || !date) {
      return res.status(400).json({ message: "Title and date are required" });
    }

    const images = req.files ? req.files.map(file => file.filename) : [];

    const newEvent = await Event.create({
      title,
      description,
      date,
      images
    });

    res.status(201).json({
      message: "Event created successfully",
      event: newEvent
    });
  } catch (error) {
    console.error("Event creation error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/api/admin/profiles/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const adminId = req.user.adminId;

    const profile = await Profile.findById(id);
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    // Update profile status
    const pool = getPool();
    await pool.execute(
      'UPDATE profiles SET status = ?, approvedBy = ?, approvedAt = ? WHERE id = ?',
      [status, adminId, new Date(), id]
    );

    res.json({ message: `Profile ${status} successfully` });
  } catch (error) {
    console.error("Update profile status error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/api/admin/events", authenticateToken, eventUpload, async (req, res) => {
  try {
    const eventData = { ...req.body };

    // Handle poster image (single)
    const posterFiles = req.files?.filter(file => file.fieldname === 'posterImage');
    if (posterFiles && posterFiles.length > 0) {
      eventData.posterImage = `events/${posterFiles[0].filename}`;
    }

    // Handle event images (multiple)
    const imageFiles = req.files?.filter(file => file.fieldname === 'images');
    if (imageFiles && imageFiles.length > 0) {
      eventData.images = imageFiles.map(file => `events/${file.filename}`);
    }

    const newEvent = await Event.create(eventData);
    res.status(201).json({ message: "Event created successfully", event: newEvent });
  } catch (error) {
    console.error("Create event error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/api/admin/events/:id", authenticateToken, eventUpload, async (req, res) => {
  try {
    const { id } = req.params;
    const eventData = { ...req.body };

    // Handle poster image (single)
    const posterFiles = req.files?.filter(file => file.fieldname === 'posterImage');
    if (posterFiles && posterFiles.length > 0) {
      eventData.posterImage = `events/${posterFiles[0].filename}`;
    }

    // Handle event images (multiple)
    const imageFiles = req.files?.filter(file => file.fieldname === 'images');
    if (imageFiles && imageFiles.length > 0) {
      eventData.images = imageFiles.map(file => `events/${file.filename}`);
    }

    const updatedEvent = await Event.update(id, eventData);
    if (!updatedEvent) return res.status(404).json({ message: "Event not found" });

    res.json({ message: "Event updated successfully", event: updatedEvent });
  } catch (error) {
    console.error("Update event error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/api/admin/events/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await Event.delete(id);
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Delete event error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/api/admin/business/:id", authenticateToken, upload.single("posterPhoto"), async (req, res) => {
  try {
    const { id } = req.params;
    const businessData = { ...req.body };

    if (req.file) {
      businessData.posterPhoto = `profile/${req.file.filename}`;
    }

    const updatedBusiness = await Business.update(id, businessData);

    if (!updatedBusiness) return res.status(404).json({ message: "Business not found" });

    res.json({ message: "Business updated successfully", business: updatedBusiness });
  } catch (error) {
    console.error("Update business error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/api/admin/business/:id/status", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const adminId = req.user.adminId;

    const business = await Business.findById(id);
    if (!business) return res.status(404).json({ message: "Business not found" });

    await Business.updateStatus(id, status, adminId);

    // Send email notification to business owner
    try {
      await sendBusinessStatusEmail(business.email, business.ownerName, business.businessName, status);
    } catch (emailError) {
      console.error('Failed to send status email:', emailError);
    }

    res.json({ message: `Business ${status} successfully` });
  } catch (error) {
    console.error("Update business status error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Contact Form Submission
app.post("/contact", async (req, res) => {
  try {
    const { fullName, email, phone, message } = req.body;

    if (!fullName || !email || !phone || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if SMTP is configured
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('Contact form submission (SMTP not configured):', { fullName, email, phone, message });
      return res.status(200).json({ message: "Message received successfully" });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_TO,
      subject: 'New Contact Form Submission - TBS Website',
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
});

/* =========================
   DB HEALTH CHECK
========================= */
app.get("/health/db", async (req, res) => {
  try {
    const pool = getPool();
    await pool.query("SELECT 1");
    res.json({ db: "connected" });
  } catch (err) {
    res.status(500).json({
      db: "disconnected",
      error: err.message
    });
  }
});

/* =========================
   GLOBAL ERROR LOGGING
========================= */
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    console.log("🚀 Starting server...");
    await connectDB();
    await createTables();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
})();

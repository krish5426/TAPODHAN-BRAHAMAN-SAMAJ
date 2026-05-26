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
const csv = require("csv-parser");

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
    "https://tapodhanbrahmansamaj.com",
    "https://www.tapodhanbrahmansamaj.com",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:5175",
    "http://127.0.0.1:5175",
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
    const { status, businessName, location, category } = req.query;
    const filters = {};

    if (status) filters.status = status;
    if (businessName) filters.businessName = businessName;
    if (location) filters.location = location;
    if (category) filters.category = category;

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
    const { status, businessName, location, category } = req.query;
    const filters = {};

    if (status) filters.status = status;
    if (businessName) filters.businessName = businessName;
    if (location) filters.location = location;
    if (category) filters.category = category;

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
      const smtpHost = process.env.SMTP_HOST;
      const smtpUser = process.env.SMTP_USER;
      const smtpPass = process.env.SMTP_PASS;
      const brevoApiKey = process.env.BREVO_API_KEY;

      if (smtpHost && smtpUser && smtpPass) {
        // Use SMTP if configured
        try {
          const smtpPort = parseInt(process.env.SMTP_PORT) || 465;
          const transporter = nodemailer.createTransport({
            host: smtpHost,
            port: smtpPort,
            secure: smtpPort === 465, // True for 465, false for others
            auth: {
              user: smtpUser,
              pass: smtpPass
            }
          });

          const mailOptions = {
            from: `"Tapodhan Brahman Samaj" <${smtpUser}>`,
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
          console.log(`Password reset email sent to ${user.email} via SMTP`);
        } catch (smtpError) {
          console.error("SMTP Error:", smtpError.message);
          // Fall through to Brevo or Dev fallback
        }
      } else if (brevoApiKey) {
        // Use Brevo API for Email if SMTP is not configured but Brevo is
        try {
          await axios.post(
            'https://api.brevo.com/v3/smtp/email',
            {
              sender: { name: "Tapodhan Brahman Samaj", email: "noreply@tapodhanbrahmansamaj.com" },
              to: [{ email: user.email, name: user.firstName }],
              subject: "Password Reset OTP - Tapodhan Brahman Samaj",
              htmlContent: `
                <h3>Password Reset Request</h3>
                <p>Dear ${user.firstName},</p>
                <p>Your OTP for password reset is <strong>${otp}</strong>.</p>
                <p>This OTP is valid for 15 minutes.</p>
                <p>If you didn't request this, you can safely ignore this email.</p>
              `
            },
            {
              headers: {
                'accept': 'application/json',
                'api-key': brevoApiKey,
                'content-type': 'application/json'
              }
            }
          );
          console.log(`Password reset email sent to ${user.email} via Brevo API`);
          return res.json({ message: "OTP sent successfully via Email" });
        } catch (brevoError) {
          console.error("Brevo Email Error:", brevoError.response?.data || brevoError.message);
          // Fall through to Dev fallback
        }
      }

      // If no mailing method worked/configured, fallback to dev response
      if (!smtpUser && !brevoApiKey) {
        console.warn("No email service (SMTP/Brevo) configured. Returning OTP in response for development.");
        return res.json({ message: "OTP generated", devOtp: otp });
      } else {
        // Services were configured but failed
        console.warn("Email services failed. Returning OTP in response for development.");
        return res.json({ message: "OTP generated (Email delivery failed)", devOtp: otp });
      }
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

    // Send email notification to admin
    try {
      await sendMatrimonyProfileEmail(profileData, newProfile.id);
    } catch (emailError) {
      console.error('Failed to send matrimony profile email:', emailError);
    }

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

// Matrimonial profile email notifications
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://tapodhanbrahmansamaj.com';
const ADMIN_URL = process.env.ADMIN_URL || FRONTEND_URL + '/admin';

async function sendMatrimonyProfileEmail(profileData, profileId) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('SMTP not configured, skipping matrimony profile email');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });

  const adminViewUrl = `${ADMIN_URL}/matrimony/view/${profileId}`;
  const adminEditUrl = `${ADMIN_URL}/matrimony/edit/${profileId}`;

  const emailTemplate = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
    <body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;">
        <tr>
          <td style="background:linear-gradient(135deg,#e65100 0%,#ff8f00 100%);padding:30px;text-align:center;">
            <h1 style="color:#ffffff;margin:0;font-size:24px;">Tapodhan Brahman Samaj</h1>
            <p style="color:#ffe0b2;margin:8px 0 0;font-size:14px;">Matrimonial Services</p>
          </td>
        </tr>
        <tr>
          <td style="padding:30px;">
            <h2 style="color:#333;margin:0 0 20px;font-size:20px;">New Matrimonial Profile Registered</h2>
            <p style="color:#555;line-height:1.6;">A new matrimonial profile has been submitted and requires your review.</p>
            <table width="100%" style="background:#fafafa;border-radius:8px;border:1px solid #eee;margin:20px 0;">
              <tr><td style="padding:20px;">
                <p style="margin:5px 0;"><strong>Name:</strong> ${profileData.firstName || ''} ${profileData.surname || ''}</p>
                <p style="margin:5px 0;"><strong>Gender:</strong> ${profileData.gender || '-'}</p>
                <p style="margin:5px 0;"><strong>DOB:</strong> ${profileData.dateOfBirth || '-'}</p>
                <p style="margin:5px 0;"><strong>Education:</strong> ${profileData.educationQualification || '-'}</p>
                <p style="margin:5px 0;"><strong>Occupation:</strong> ${profileData.jobType || '-'}</p>
                <p style="margin:5px 0;"><strong>Location:</strong> ${profileData.currentLocation || '-'}</p>
                <p style="margin:5px 0;"><strong>Native:</strong> ${profileData.nativePlace || '-'}</p>
                <p style="margin:5px 0;"><strong>Contact:</strong> ${profileData.contactPersonName || '-'} (${profileData.contactPersonNumber || '-'})</p>
              </td></tr>
            </table>
            <p style="margin:20px 0 10px;">
              <a href="${adminViewUrl}" style="display:inline-block;background:#1976d2;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:14px;margin-right:10px;">View in Admin</a>
              <a href="${adminEditUrl}" style="display:inline-block;background:#388e3c;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:14px;">Edit Profile</a>
            </p>
          </td>
        </tr>
        <tr>
          <td style="background:#333;padding:20px;text-align:center;">
            <p style="color:#aaa;margin:0;font-size:12px;">Tapodhan Brahman Samaj Charitable Trust</p>
          </td>
        </tr>
      </table>
    </body>
    </html>`;

  await transporter.sendMail({
    from: '"Tapodhan Brahman Samaj" <' + (process.env.SMTP_FROM || process.env.SMTP_USER) + '>',
    to: process.env.EMAIL_TO_ADMIN || process.env.SMTP_TO,
    subject: 'New Matrimonial Profile: ' + (profileData.firstName || '') + ' ' + (profileData.surname || '') + ' (' + (profileData.gender || '') + ')',
    html: emailTemplate
  });
  console.log('Matrimony admin notification email sent');
}

async function sendMatrimonyStatusEmail(userEmail, profileData, profileId, status) {
  if (!userEmail || !process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('SMTP not configured or no email, skipping matrimony status email');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });

  const profileViewUrl = FRONTEND_URL + '/matrimonial-detail/' + profileId;
  const isApproved = status === 'approved';

  const emailTemplate = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
    <body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;">
        <tr>
          <td style="background:linear-gradient(135deg,${isApproved ? '#2e7d32,#66bb6a' : '#c62828,#ef5350'});padding:30px;text-align:center;">
            <h1 style="color:#ffffff;margin:0;font-size:24px;">Tapodhan Brahman Samaj</h1>
            <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px;">Matrimonial Services</p>
          </td>
        </tr>
        <tr>
          <td style="padding:30px;">
            ${isApproved ? '<h2 style="color:#2e7d32;margin:0 0 20px;">Profile Approved!</h2><p style="color:#555;line-height:1.6;">Dear <strong>' + (profileData.firstName || '') + '</strong>,</p><p style="color:#555;line-height:1.6;">Congratulations! Your matrimonial profile has been approved and is now visible to other members.</p><p style="margin:25px 0;"><a href="' + profileViewUrl + '" style="display:inline-block;background:#e65100;color:#fff;padding:14px 28px;border-radius:6px;text-decoration:none;font-weight:bold;">View Your Profile</a></p>' : '<h2 style="color:#c62828;margin:0 0 20px;">Profile Update</h2><p style="color:#555;line-height:1.6;">Dear <strong>' + (profileData.firstName || '') + '</strong>,</p><p style="color:#555;line-height:1.6;">We regret to inform you that your matrimonial profile has not been approved at this time. Please contact our team for more details.</p>'}
            <p style="color:#555;line-height:1.6;margin-top:20px;">Best regards,<br><strong>Tapodhan Brahman Samaj Team</strong></p>
          </td>
        </tr>
        <tr>
          <td style="background:#333;padding:20px;text-align:center;">
            <p style="color:#aaa;margin:0;font-size:12px;">Tapodhan Brahman Samaj Charitable Trust</p>
          </td>
        </tr>
      </table>
    </body>
    </html>`;

  await transporter.sendMail({
    from: '"Tapodhan Brahman Samaj" <' + (process.env.SMTP_FROM || process.env.SMTP_USER) + '>',
    to: userEmail,
    subject: isApproved ? 'Your Matrimonial Profile is Approved! - Tapodhan Brahman Samaj' : 'Matrimonial Profile Update - Tapodhan Brahman Samaj',
    html: emailTemplate
  });
  console.log('Matrimony status email sent to ' + userEmail);
}

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

    // Send status email to user
    try {
      const user = await User.findById(profile.userId);
      if (user && user.email) {
        await sendMatrimonyStatusEmail(user.email, profile, id, status);
      }
    } catch (emailError) {
      console.error('Failed to send matrimony status email:', emailError);
    }

    res.json({ message: `Profile ${status} successfully` });
  } catch (error) {
    console.error("Update profile status error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Full profile update (admin edit)
app.put("/api/admin/profiles/:id/edit", authenticateToken, upload.single("profilePhoto"), async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    const profile = await Profile.findById(id);
    if (!profile) return res.status(404).json({ message: "Profile not found" });

    // Build update fields from body
    const allowedFields = [
      'firstName', 'surname', 'fatherName', 'gender', 'dateOfBirth', 'timeOfBirth',
      'birthPlace', 'profileFor', 'maritalStatus', 'noOfChildren', 'height', 'weight',
      'physicalDisability', 'glasses', 'mangal', 'expectation', 'educationQualification',
      'educationDetails', 'jobType', 'jobDescription', 'designation', 'currentLocation',
      'incomeCurrency', 'monthlyIncome', 'fatherFullName', 'motherFullName',
      'fatherOccupation', 'motherOccupation', 'totalFamilyMembers', 'totalBrothers',
      'totalSisters', 'marriedBrothers', 'marriedSisters', 'familyType', 'familyValues',
      'familyLocation', 'nativePlace', 'familyWealth', 'contactPersonName',
      'contactPersonRelation', 'contactPersonNumber', 'contactPersonEmail',
      'contactPersonAddress', 'status', 'profilePhoto'
    ];

    const updates = [];
    const values = [];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined && req.body[field] !== '') {
        let val = req.body[field];
        
        // Handle date format conversion
        if (field === 'dateOfBirth' && val) {
          if (val.includes('T')) {
            // ISO format: 2000-12-11T18:30:00.000Z -> 2000-12-11
            val = val.split('T')[0];
          } else if (val.includes('/')) {
            const parts = val.split('/');
            if (parts.length === 3) {
              const [d, m, y] = parts;
              val = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
            }
          }
        }
        
        updates.push(`\`${field}\` = ?`);
        values.push(val);
      }
    }

    // Handle profile photo upload
    if (req.file) {
      updates.push('profilePhoto = ?');
      values.push(req.file.filename);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    values.push(id);
    await pool.execute(
      `UPDATE profiles SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    const updatedProfile = await Profile.findById(id);
    res.json({ message: "Profile updated successfully", profile: updatedProfile });
  } catch (error) {
    console.error("Full profile update error:", error.message, error.sql || '');
    res.status(500).json({ message: "Internal server error: " + error.message });
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

// Parse CSV Memory Upload
const memoryUpload = multer({ storage: multer.memoryStorage() });
const streamifier = require('stream');

app.post("/api/admin/business/import", authenticateToken, memoryUpload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No CSV file uploaded" });
    }

    const results = [];
    const bufferStream = new streamifier.PassThrough();
    bufferStream.end(req.file.buffer);

    bufferStream
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        const importSummary = { success: 0, errors: [], total: results.length };

        for (let i = 0; i < results.length; i++) {
          const row = results[i];
          try {
            // Trim keys in case of bad CSV headers
            const getCol = (name) => {
              const key = Object.keys(row).find(k => k.trim().replace(/\*$/, '').replace(/\r$/, '') === name);
              return key ? row[key].replace(/\r$/, '').trim() : '';
            };

            const userFirstName = getCol('User First Name');
            const userLastName = getCol('User Last Name');
            const userEmail = getCol('User Email');
            const userMobile = getCol('User Mobile');

            const businessName = getCol('Business Name');
            const ownerName = getCol('Owner Name');
            const businessEmail = getCol('Business Email');
            const contactNumber = getCol('Contact Number');
            const address = getCol('Address');

            // --- DEBUG LOGS ---
            console.log(`[CSV Import Debug] Row ${i+2}`);
            console.log(`Raw keys:`, Object.keys(row));
            console.log(`Parsed -> Business: "${businessName}", Owner: "${ownerName}", Contact: "${contactNumber}"`);
            // ------------------

            if (!businessName || !ownerName || !contactNumber) {
              importSummary.errors.push(`Row ${i + 2}: Missing required business fields (Name, Owner, or Contact).`);
              continue; // Skip this row
            }

            let category = getCol('Category');
            const validIndustries = [
              "Aerospace", "Agriculture", "Artificial Intelligence", "Architecture", "Automotive", "Banking",
              "Beauty & Personal Care", "Biotechnology", "Blockchain", "Chemical Industry", "Construction",
              "Consulting", "Consumer Electronics", "Cybersecurity", "Defense", "Education", "EdTech",
              "Energy", "Event Management", "E-commerce", "Fashion & Apparel", "Finance", "FinTech",
              "Fitness & Wellness", "FMCG (Fast-Moving Consumer Goods)", "Food & Beverage", "Furniture",
              "Gaming", "Healthcare", "HealthTech", "Home Decor", "Hospitality", "Human Resources",
              "Information Technology", "Insurance", "Interior Design", "Investment Management", "Legal Services",
              "Logistics", "Manufacturing", "Marine Industry", "Marketing & Advertising", "Media & Entertainment",
              "Mining", "Oil & Gas", "Pharmaceuticals", "Printing & Packaging", "Real Estate", "Renewable Energy",
              "Research & Development", "Retail", "SaaS (Software as a Service)", "Software Development", "Sports",
              "Staffing & Recruitment", "Telecommunications", "Textile", "Tourism", "Transportation", "Waste Management", "Others"
            ];
            const matchedCategory = validIndustries.find(ind => ind.toLowerCase() === (category || '').toLowerCase());
            category = matchedCategory || 'Others';

            const businessType = getCol('Business Type');
            const description = getCol('Description');
            const website = getCol('Website');
            const city = getCol('City');
            const state = getCol('State');
            const status = getCol('Status') || 'approved'; // Default approved if admin uploads it

            if (!businessName || !ownerName || !contactNumber) {
              importSummary.errors.push(`Row ${i + 2}: Missing required business fields (Name, Owner, or Contact).`);
              continue; // Skip this row
            }

            let userId = null;
            let existingUser = null;

            if (userMobile) {
              existingUser = await User.findByMobile(userMobile);
            }
            if (!existingUser && userEmail) {
              existingUser = await User.findByEmail(userEmail);
            }

            if (existingUser) {
              userId = existingUser.id;
            } else {
              // Create user if missing
              if (!userFirstName || !userMobile) {
                importSummary.errors.push(`Row ${i + 2}: User does not exist, but missing User First Name or Mobile to create one.`);
                continue;
              }

              // Password strategy: first 4 chars of firstname (lowercase) + last 4 chars of mobile
              const baseName = userFirstName.replace(/[^a-zA-Z]/g, '').toLowerCase().padEnd(4, 'a').substring(0, 4);
              const baseMobile = userMobile.slice(-4).padStart(4, '0');
              const rawPassword = `${baseName}${baseMobile}`;
              const hashedPassword = await bcrypt.hash(rawPassword, 10);

              const newUser = await User.create({
                firstName: userFirstName,
                lastName: userLastName || '',
                email: userEmail || '',
                mobile: userMobile,
                password: hashedPassword,
                registerForProfile: 0,
                acceptTerms: 1
              });
              userId = newUser.id;
            }

            // Create the business
            await Business.create({
              userId,
              businessName,
              ownerName,
              email: businessEmail,
              contactNumber,
              address,
              category,
              businessType,
              description,
              website,
              city,
              state,
              status,
              posterPhoto: null
            });

            // Send email notification if businessEmail is provided
            if (businessEmail) {
              try {
                await sendBusinessRegistrationEmails(businessEmail, ownerName, businessName);
              } catch (emailError) {
                console.error(`Failed to send import business email for row ${i + 2}:`, emailError);
              }
            }

            importSummary.success++;

          } catch (rowError) {
            console.error(`Bulk import error on row ${i + 2}:`, rowError);
            importSummary.errors.push(`Row ${i + 2}: ${rowError.message}`);
          }
        }

        res.json({
          message: "Import processing finished",
          summary: importSummary
        });
      });

  } catch (error) {
    console.error("CSV Import error:", error);
    res.status(500).json({ message: "Internal server error during import" });
  }
});


// Profile/Matrimony Excel/CSV Import
const XLSX = require('xlsx');

app.post("/api/admin/profiles/import", authenticateToken, memoryUpload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    let rows = [];
    const ext = path.extname(req.file.originalname).toLowerCase();

    if (ext === '.xlsx' || ext === '.xls') {
      // Parse Excel
      const workbook = XLSX.read(req.file.buffer, { type: 'buffer', cellDates: true });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rawData = XLSX.utils.sheet_to_json(sheet, { defval: '' });

      // Find the header row (look for "No" or "Name" or "Boy/Girl" column)
      let headerRowIndex = -1;
      const allRows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

      for (let i = 0; i < Math.min(allRows.length, 5); i++) {
        const row = allRows[i].map(c => String(c).trim().toLowerCase());
        if (row.includes('name') || row.includes('boy/girl') || row.includes('dob')) {
          headerRowIndex = i;
          break;
        }
      }

      if (headerRowIndex >= 0) {
        const headers = allRows[headerRowIndex].map(h => String(h).trim());
        for (let i = headerRowIndex + 1; i < allRows.length; i++) {
          const rowData = {};
          headers.forEach((h, idx) => {
            rowData[h] = allRows[i][idx] !== undefined ? allRows[i][idx] : '';
          });
          rows.push(rowData);
        }
      } else {
        rows = rawData;
      }
    } else if (ext === '.csv') {
      // Parse CSV
      const bufferStream = new (require('stream').PassThrough)();
      bufferStream.end(req.file.buffer);
      rows = await new Promise((resolve, reject) => {
        const results = [];
        bufferStream
          .pipe(csv())
          .on("data", (data) => results.push(data))
          .on("end", () => resolve(results))
          .on("error", reject);
      });
    } else {
      return res.status(400).json({ message: "Unsupported file format. Use .xlsx, .xls, or .csv" });
    }

    const importSummary = { success: 0, errors: [], total: 0 };

    // Filter out empty rows
    rows = rows.filter(row => {
      const name = getExcelCol(row, ['Name', 'name']);
      const dob = getExcelCol(row, ['DOB', 'dob', 'Date of Birth']);
      const gender = getExcelCol(row, ['Boy/Girl', 'Gender', 'gender']);
      return name || dob || gender;
    });

    importSummary.total = rows.length;

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        const name = String(getExcelCol(row, ['Name', 'name']) || '').trim();
        const fatherName = String(getExcelCol(row, ['Father', 'father', 'Father Name']) || '').trim();
        const genderRaw = String(getExcelCol(row, ['Boy/Girl', 'Gender', 'gender']) || '').trim().toLowerCase();
        const dobRaw = getExcelCol(row, ['DOB', 'dob', 'Date of Birth', 'Date Of Birth']);
        const nativePlace = String(getExcelCol(row, ['Native', 'native', 'Native Place']) || '').trim();
        const motherName = String(getExcelCol(row, ['Mother', 'mother', 'Mother Name']) || '').trim();
        const mosal = String(getExcelCol(row, ['Mosal', 'mosal']) || '').trim();
        const education = String(getExcelCol(row, ['Education', 'education']) || '').trim();
        const currentProfile = String(getExcelCol(row, ['Current Profile', 'current profile', 'Job', 'Occupation']) || '').trim();
        const currentLocation = String(getExcelCol(row, ['Current Location', 'current location', 'Location', 'City']) || '').trim();
        const gotra = String(getExcelCol(row, ['Gotra', 'gotra']) || '').trim();

        if (!name) {
          importSummary.errors.push(`Row ${i + 2}: Missing Name, skipped.`);
          continue;
        }

        // Parse gender
        let gender = '';
        if (genderRaw === 'boy' || genderRaw === 'male' || genderRaw === 'm') {
          gender = 'Male';
        } else if (genderRaw === 'girl' || genderRaw === 'female' || genderRaw === 'f') {
          gender = 'Female';
        } else {
          importSummary.errors.push(`Row ${i + 2}: Invalid gender "${genderRaw}" for "${name}", skipped.`);
          continue;
        }

        // Parse DOB
        let dateOfBirth = null;
        if (dobRaw) {
          if (dobRaw instanceof Date) {
            dateOfBirth = dobRaw.toISOString().split('T')[0];
          } else {
            const dobStr = String(dobRaw).trim();
            // Try DD/MM/YYYY format
            const parts = dobStr.split(/[\/\-\.]/);
            if (parts.length === 3) {
              let [d, m, y] = parts;
              if (parseInt(d) > 12) {
                // DD/MM/YYYY
                dateOfBirth = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
              } else if (parseInt(m) > 12) {
                // MM/DD/YYYY
                dateOfBirth = `${y}-${d.padStart(2, '0')}-${m.padStart(2, '0')}`;
              } else {
                // Assume DD/MM/YYYY
                dateOfBirth = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
              }
            }
          }
        }

        if (!dateOfBirth) {
          dateOfBirth = '2000-01-01'; // Default if missing
        }

        // Parse name - split into firstName and surname
        const nameParts = name.split(' ');
        const firstName = nameParts[0] || name;
        const surname = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

        // Create a dummy user for this profile (admin import)
        const dummyMobile = `IMP${Date.now()}${i}`;
        const hashedPassword = await bcrypt.hash('tapodhan123', 10);

        const newUser = await User.create({
          firstName: firstName,
          lastName: surname,
          email: null,
          mobile: dummyMobile,
          password: hashedPassword,
          registerForProfile: true,
          acceptTerms: true
        });

        // Create profile
        const profileData = {
          userId: newUser.id,
          profileFor: 'Self',
          maritalStatus: 'Unmarried',
          noOfChildren: '0',
          firstName: firstName,
          fatherName: fatherName || '-',
          surname: surname || '-',
          gender: gender,
          dateOfBirth: dateOfBirth,
          timeOfBirth: '-',
          birthPlace: nativePlace || '-',
          height: '-',
          weight: '-',
          physicalDisability: 'No',
          glasses: 'No',
          mangal: '-',
          expectation: '-',
          educationQualification: education || '-',
          educationDetails: education || '-',
          jobType: currentProfile || '-',
          jobDescription: currentProfile || '-',
          designation: '-',
          currentLocation: currentLocation || '-',
          incomeCurrency: 'INR',
          monthlyIncome: '-',
          fatherFullName: fatherName || '-',
          motherFullName: motherName || '-',
          fatherOccupation: '-',
          motherOccupation: '-',
          totalFamilyMembers: '-',
          totalBrothers: '-',
          totalSisters: '-',
          marriedBrothers: '-',
          marriedSisters: '-',
          familyType: '-',
          familyValues: gotra || '-',
          familyLocation: nativePlace || '-',
          nativePlace: nativePlace || '-',
          familyWealth: '-',
          contactPersonName: fatherName || '-',
          contactPersonRelation: 'Father',
          contactPersonNumber: '-',
          contactPersonEmail: '-',
          contactPersonAddress: nativePlace || '-',
          profilePhoto: null,
          status: 'approved'
        };

        await Profile.create(profileData);
        importSummary.success++;

      } catch (rowError) {
        console.error(`Profile import error on row ${i + 2}:`, rowError);
        importSummary.errors.push(`Row ${i + 2}: ${rowError.message}`);
      }
    }

    res.json({
      message: "Profile import completed",
      summary: importSummary
    });

  } catch (error) {
    console.error("Profile import error:", error);
    res.status(500).json({ message: "Internal server error during import" });
  }
});

// Helper to get column value by multiple possible header names
function getExcelCol(row, possibleNames) {
  for (const name of possibleNames) {
    const key = Object.keys(row).find(k => k.trim().toLowerCase() === name.toLowerCase());
    if (key && row[key] !== undefined && row[key] !== '') return row[key];
  }
  return '';
}

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

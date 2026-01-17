// index.js - MySQL version
require('dotenv').config();
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const nodemailer = require('nodemailer');

// MySQL imports
const { connectDB } = require('./mysql-config');
const { createTables } = require('./mysql-schema');
const { User, Admin, Profile, ProfileRequest, Business, Event } = require('./mysql-models');

app.use(cors({
  origin: [
    "https://tbs.web-stage.in",
    "http://localhost:5173",
    "http://localhost:5174"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Super Admin Configuration
const SUPER_ADMIN_EMAIL = "super@gmail.com";
const SUPER_ADMIN_MOBILE = "5050505050";
const SUPER_ADMIN_PASSWORD = "Su@12345";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check / root route (REQUIRED for cPanel)
app.get("/", (req, res) => {
  res.status(200).send("API working");
});

// MySQL Connection
connectDB().then(async () => {
  await createTables();
  createSuperAdmin();
}).catch((err) => console.log("DB Error:", err));

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "MY_SECRET_KEY";

// Upload Configuration
const UPLOAD_DIR = path.join(__dirname, "uploads");

if (!fs.existsSync(UPLOAD_DIR)) {
  try {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  } catch (err) {
    console.error("Failed to create upload directory:", err);
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
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
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png/i;
    const ext = path.extname(file.originalname);
    if (allowed.test(ext)) cb(null, true);
    else cb(new Error("Only images (jpg, jpeg, png) are allowed"));
  }
});

// Create a flexible upload middleware for events
const eventUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png/i;
    const ext = path.extname(file.originalname);
    if (allowed.test(ext)) cb(null, true);
    else cb(new Error("Only images (jpg, jpeg, png) are allowed"));
  }
}).any(); // Accept any field names

// Create Super Admin
async function createSuperAdmin() {
  try {
    const existingAdmin = await Admin.findByEmail(SUPER_ADMIN_EMAIL);
    if (existingAdmin) {
      console.log("Super Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(SUPER_ADMIN_PASSWORD, 10);
    await Admin.create({
      firstName: "Super",
      lastName: "Admin",
      email: SUPER_ADMIN_EMAIL,
      mobile: SUPER_ADMIN_MOBILE,
      password: hashedPassword,
      isMainAdmin: true,
      role: "super-admin",
      status: "approved"
    });

    console.log("Super Admin created successfully");
  } catch (error) {
    console.error("Error creating Super Admin:", error);
  }
}

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

// Routes

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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findByEmail(email);
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

    // Check if profile already exists
    const existingProfile = await Profile.findByUserId(userId);
    if (existingProfile) {
      return res.status(400).json({ message: "Profile already exists for this user" });
    }

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

// Get Profiles
app.get("/profiles", async (req, res) => {
  try {
    const { status, gender } = req.query;
    const filters = {};

    if (status) filters.status = status;
    if (gender) filters.gender = gender;

    const profiles = await Profile.findAll(filters);
    res.json(profiles);
  } catch (error) {
    console.error("Get profiles error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Business Registration
app.post("/business", authenticateToken, upload.single("posterPhoto"), async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log('Business registration request:', { userId, body: req.body, file: req.file });

    const existingBusiness = await Business.findByUserId(userId);
    if (existingBusiness) {
      return res.status(400).json({ message: "Business already registered for this user" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Poster photo is required" });
    }

    const { businessName, ownerName, email, contactNumber, address } = req.body;
    
    if (!businessName || !ownerName || !email || !contactNumber || !address) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const businessData = {
      ...req.body,
      userId,
      posterPhoto: req.file.filename,
      status: 'pending'
    };

    const newBusiness = await Business.create(businessData);

    // Send email notifications
    console.log('Attempting to send business registration emails...');
    try {
      await sendBusinessRegistrationEmails(email, ownerName, businessName);
      console.log('Business registration emails sent successfully');
    } catch (emailError) {
      console.error('Failed to send business registration emails:', emailError);
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

// Get user's business
app.get("/my-business", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log('Fetching business for userId:', userId);
    
    const business = await Business.findByUserId(userId);
    console.log('Found business:', business ? 'Yes' : 'No', business);
    
    if (!business) {
      return res.status(404).json({ message: "No business found" });
    }
    
    res.json(business);
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

// Serve uploaded files
app.use("/uploads", express.static(UPLOAD_DIR));

// Serve static files with no-cache headers
app.use(express.static('public', {
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
    }
  }
}));

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

    res.json({
      totalBrides,
      totalGrooms,
      totalBusiness,
      totalEvents,
      pendingBusinessRequests
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

app.post("/api/admin/events", authenticateToken, eventUpload, async (req, res) => {
  try {
    const eventData = { ...req.body };
    
    // Handle poster image (single)
    const posterFiles = req.files?.filter(file => file.fieldname === 'posterImage');
    if (posterFiles && posterFiles.length > 0) {
      eventData.posterImage = posterFiles[0].filename;
    }
    
    // Handle event images (multiple)
    const imageFiles = req.files?.filter(file => file.fieldname === 'images');
    if (imageFiles && imageFiles.length > 0) {
      eventData.images = imageFiles.map(file => file.filename);
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
      eventData.posterImage = posterFiles[0].filename;
    }
    
    // Handle event images (multiple)
    const imageFiles = req.files?.filter(file => file.fieldname === 'images');
    if (imageFiles && imageFiles.length > 0) {
      eventData.images = imageFiles.map(file => file.filename);
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

app.get("/api/admin/business/:id", authenticateToken, async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);
    if (!business) return res.status(404).json({ message: "Business not found" });
    res.json(business);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/api/admin/business/:id", authenticateToken, upload.single("posterPhoto"), async (req, res) => {
  try {
    const { id } = req.params;
    const businessData = { ...req.body };

    if (req.file) {
      businessData.posterPhoto = req.file.filename;
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

// Test SMTP Configuration
app.get("/test-smtp", async (req, res) => {
  try {
    const config = {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      user: process.env.SMTP_USER ? '***configured***' : 'NOT SET',
      pass: process.env.SMTP_PASS ? '***configured***' : 'NOT SET',
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_TO
    };
    
    res.json({ 
      message: 'SMTP Configuration',
      config,
      isConfigured: !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
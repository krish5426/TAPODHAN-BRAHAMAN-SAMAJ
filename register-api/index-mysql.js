// index.js - MySQL version
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

// MySQL imports
const { connectDB } = require('./mysql-config');
const { createTables } = require('./mysql-schema');
const { User, Admin, Profile, Business, Event } = require('./mysql-models');

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

// Super Admin Configuration
const SUPER_ADMIN_EMAIL = "super@gmail.com";
const SUPER_ADMIN_MOBILE = "5050505050";
const SUPER_ADMIN_PASSWORD = "Su@12345";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MySQL Connection
connectDB().then(async () => {
  await createTables();
  createSuperAdmin();
}).catch((err) => console.log("DB Error:", err));

// JWT Secret
const JWT_SECRET = "MY_SECRET_KEY";

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
    
    const existingBusiness = await Business.findByUserId(userId);
    if (existingBusiness) {
      return res.status(400).json({ message: "Business already registered for this user" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Poster photo is required" });
    }

    const businessData = {
      ...req.body,
      userId,
      posterPhoto: req.file.filename
    };

    const newBusiness = await Business.create(businessData);

    res.status(201).json({
      message: "Business registered successfully",
      business: newBusiness
    });
  } catch (error) {
    console.error("Business registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get Businesses
app.get("/businesses", async (req, res) => {
  try {
    const { status } = req.query;
    const filters = {};
    
    if (status) filters.status = status;

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

// Admin Routes
app.get("/api/admin/brides", authenticateToken, async (req, res) => {
  try {
    const profiles = await Profile.findAll({ gender: 'female' });
    res.json(profiles);
  } catch (error) {
    console.error("Get brides error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Serve uploaded files
app.use("/uploads", express.static(UPLOAD_DIR));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
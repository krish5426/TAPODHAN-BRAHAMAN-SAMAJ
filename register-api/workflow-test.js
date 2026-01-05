// COMPLETE WORKFLOW TEST GUIDE
// =============================

// STEP 1: SETUP - Manually add main admin to MongoDB
// Collection: mydatabase.admins
// Use the main-admin.json file provided

// STEP 2: TEST NORMAL ADMIN REGISTRATION
console.log("=== STEP 2: ADMIN REGISTRATION ===");
const adminRegisterData = {
  "firstName": "John",
  "lastName": "Admin", 
  "email": "johnadmin@gmail.com",
  "mobile": "9876543210",
  "password": "Admin@123"
};
// POST http://localhost:3000/admin/register
// Expected: "Admin registration request sent for approval!"

// STEP 3: TEST NORMAL ADMIN LOGIN (SHOULD FAIL)
console.log("=== STEP 3: ADMIN LOGIN ATTEMPT (SHOULD FAIL) ===");
const adminLoginData = {
  "email": "johnadmin@gmail.com",
  "password": "Admin@123"
};
// POST http://localhost:3000/admin/login
// Expected: "Admin account pending approval from main admin!"

// STEP 4: TEST MAIN ADMIN LOGIN (SHOULD SUCCESS)
console.log("=== STEP 4: MAIN ADMIN LOGIN (SHOULD SUCCESS) ===");
const mainAdminLoginData = {
  "email": "superadmin@gmail.com",
  "password": "Admin@123"
};
// POST http://localhost:3000/main-admin/login
// Expected: Success with token

// STEP 5: MAIN ADMIN SEES PENDING ADMIN REQUESTS
console.log("=== STEP 5: GET PENDING ADMIN REQUESTS ===");
// GET http://localhost:3000/admin/pending-requests
// Headers: Authorization: Bearer MAIN_ADMIN_TOKEN
// Expected: List of pending admin requests

// STEP 6: MAIN ADMIN APPROVES ADMIN
console.log("=== STEP 6: APPROVE ADMIN REQUEST ===");
const approveAdminData = {
  "action": "approve"
};
// PUT http://localhost:3000/admin/approve/ADMIN_ID_HERE
// Headers: Authorization: Bearer MAIN_ADMIN_TOKEN
// Expected: "Admin request approved successfully"

// STEP 7: NOW NORMAL ADMIN CAN LOGIN
console.log("=== STEP 7: ADMIN LOGIN AFTER APPROVAL (SHOULD SUCCESS) ===");
// POST http://localhost:3000/admin/login
// Body: same as step 3
// Expected: Success with admin token

// STEP 8: USER CREATES PROFILE (GOES TO PENDING)
console.log("=== STEP 8: USER CREATES PROFILE ===");
// First user must register and login to get user token
// POST http://localhost:3000/profile/create
// Headers: Authorization: Bearer USER_TOKEN
// Expected: "Profile created successfully and sent for approval"

// STEP 9: ADMIN SEES PENDING PROFILE REQUESTS
console.log("=== STEP 9: GET PENDING PROFILE REQUESTS ===");
// GET http://localhost:3000/admin/pending-profiles
// Headers: Authorization: Bearer ADMIN_TOKEN (or MAIN_ADMIN_TOKEN)
// Expected: List of pending profile requests

// STEP 10: ADMIN APPROVES PROFILE
console.log("=== STEP 10: APPROVE PROFILE REQUEST ===");
const approveProfileData = {
  "action": "approve"
};
// PUT http://localhost:3000/admin/approve-profile/REQUEST_ID_HERE
// Headers: Authorization: Bearer ADMIN_TOKEN
// Expected: "Profile approved successfully"

// STEP 11: PROFILE NOW VISIBLE IN FETCH API
console.log("=== STEP 11: FETCH PROFILES (APPROVED ONLY) ===");
// GET http://localhost:3000/profiles/fetch?gender=Male
// Expected: Only approved profiles visible

console.log("=== WORKFLOW COMPLETE ===");
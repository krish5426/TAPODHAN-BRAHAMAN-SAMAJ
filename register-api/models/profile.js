const mongoose = require("mongoose");

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
  parentBusiness: { type: String, required: true },
  subcast: { type: String, required: true },
  nativePlace: { type: String, required: true },
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
  images: {
    type: [String],
    validate: {
      validator: function (arr) { return arr.length <= 3; },
      message: "Maximum 3 images allowed"
    },
    default: []
  }
}, { timestamps: true });

module.exports = mongoose.model("Profile", profileSchema);
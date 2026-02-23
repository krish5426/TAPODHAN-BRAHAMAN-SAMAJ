import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import metromonialimg from "../../assets/images/matrimonialimg.png";
import CustomDialog from './CustomDialog';
import { API_ENDPOINTS } from '../../config/api';

const Matrimonialpersonalinfo = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [dialog, setDialog] = useState({ isOpen: false, title: '', message: '', type: 'success' });
  const [existingProfiles, setExistingProfiles] = useState([]);
  const [showProfileList, setShowProfileList] = useState(true);
  const [editingProfile, setEditingProfile] = useState(null);

  // Fetch existing profiles on component mount
  useEffect(() => {
    fetchExistingProfiles();
  }, []);

  const fetchExistingProfiles = async () => {
    try {
      const token = localStorage.getItem('user_token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch(API_ENDPOINTS.MY_MATRIMONY_PROFILES, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const profiles = await response.json();
        setExistingProfiles(profiles);
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  const handleCreateNewProfile = () => {
    setEditingProfile(null);
    resetForm();
    setShowProfileList(false);
  };

  const handleEditProfile = (profile) => {
    setEditingProfile(profile);
    setFormData({
      profileFor: profile.profileFor || 'Myself',
      maritalStatus: profile.maritalStatus || 'Single',
      noOfChildren: profile.noOfChildren || '0',
      firstName: profile.firstName || '',
      fatherName: profile.fatherName || '',
      surname: profile.surname || '',
      gender: profile.gender || '',
      dateOfBirth: profile.dateOfBirth || '',
      timeOfBirth: profile.timeOfBirth || '',
      birthPlace: profile.birthPlace || '',
      height: profile.height || '',
      weight: profile.weight || '',
      physicalDisability: profile.physicalDisability || 'No',
      glasses: profile.glasses || 'No',
      mangal: profile.mangal || 'No',
      expectation: profile.expectation || '',
      educationQualification: profile.educationQualification || '',
      educationDetails: profile.educationDetails || '',
      jobType: profile.jobType || '',
      jobDescription: profile.jobDescription || '',
      designation: profile.designation || '',
      currentLocation: profile.currentLocation || '',
      incomeCurrency: profile.incomeCurrency || 'INR',
      monthlyIncome: profile.monthlyIncome || '',
      fatherFullName: profile.fatherFullName || '',
      motherFullName: profile.motherFullName || '',
      fatherOccupation: profile.fatherOccupation || '',
      motherOccupation: profile.motherOccupation || '',
      totalFamilyMembers: profile.totalFamilyMembers || '',
      totalBrothers: profile.totalBrothers || '0',
      totalSisters: profile.totalSisters || '0',
      marriedBrothers: profile.marriedBrothers || '0',
      marriedSisters: profile.marriedSisters || '0',
      familyType: profile.familyType || 'Nuclear',
      familyValues: profile.familyValues || 'Traditional',
      familyLocation: profile.familyLocation || '',
      nativePlace: profile.nativePlace || '',
      familyWealth: profile.familyWealth || '',
      contactPersonName: profile.contactPersonName || '',
      contactPersonRelation: profile.contactPersonRelation || '',
      contactPersonNumber: profile.contactPersonNumber || '',
      contactPersonEmail: profile.contactPersonEmail || '',
      contactPersonAddress: profile.contactPersonAddress || ''
    });
    setShowProfileList(false);
  };

  const resetForm = () => {
    setFormData({
      profileFor: 'Myself',
      maritalStatus: 'Single',
      noOfChildren: '0',
      firstName: '',
      fatherName: '',
      surname: '',
      gender: '',
      dateOfBirth: '',
      timeOfBirth: '',
      birthPlace: '',
      height: '',
      weight: '',
      physicalDisability: 'No',
      glasses: 'No',
      mangal: 'No',
      expectation: '',
      educationQualification: '',
      educationDetails: '',
      jobType: '',
      jobDescription: '',
      designation: '',
      currentLocation: '',
      incomeCurrency: 'INR',
      monthlyIncome: '',
      fatherFullName: '',
      motherFullName: '',
      fatherOccupation: '',
      motherOccupation: '',
      totalFamilyMembers: '',
      totalBrothers: '0',
      totalSisters: '0',
      marriedBrothers: '0',
      marriedSisters: '0',
      familyType: 'Nuclear',
      familyValues: 'Traditional',
      familyLocation: '',
      nativePlace: '',
      familyWealth: '',
      contactPersonName: '',
      contactPersonRelation: '',
      contactPersonNumber: '',
      contactPersonEmail: '',
      contactPersonAddress: ''
    });
    setCurrentStep(1);
    setError('');
    setProfilePhoto(null);
  };

  const [formData, setFormData] = useState({
    // Step 1: Personal Information
    profileFor: 'Myself',
    maritalStatus: 'Single',
    noOfChildren: '0',
    firstName: '',
    fatherName: '',
    surname: '',
    gender: '',
    dateOfBirth: '',
    timeOfBirth: '',
    birthPlace: '',
    height: '',
    weight: '',
    physicalDisability: 'No',
    glasses: 'No',
    mangal: 'No',
    expectation: '',
    
    // Step 2: Education, Job & Family Information
    educationQualification: '',
    educationDetails: '',
    jobType: '',
    jobDescription: '',
    designation: '',
    currentLocation: '',
    incomeCurrency: 'INR',
    monthlyIncome: '',
    fatherFullName: '',
    motherFullName: '',
    fatherOccupation: '',
    motherOccupation: '',
    totalFamilyMembers: '',
    totalBrothers: '0',
    totalSisters: '0',
    marriedBrothers: '0',
    marriedSisters: '0',
    familyType: 'Nuclear',
    familyValues: 'Traditional',
    familyLocation: '',
    nativePlace: '',
    familyWealth: '',
    contactPersonName: '',
    contactPersonRelation: '',
    contactPersonNumber: '',
    contactPersonEmail: '',
    contactPersonAddress: ''
  });

  const handleDialogClose = () => {
    setDialog({ isOpen: false, title: '', message: '', type: 'success' });
    if (dialog.type === 'success') {
      setShowProfileList(true);
      // Don't navigate away, stay on the profiles page
    }
  };

  const showDialog = (title, message, type = 'success') => {
    setDialog({ isOpen: true, title, message, type });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setProfilePhoto(e.target.files[0]);
  };

  const validateStep1 = () => {
    const required = ['firstName', 'fatherName', 'surname', 'gender', 'dateOfBirth', 'timeOfBirth', 'birthPlace', 'height', 'weight'];
    return required.every(field => formData[field].trim() !== '');
  };

  const validateStep2 = () => {
    const required = ['educationQualification', 'jobType', 'designation', 'currentLocation', 'monthlyIncome', 'fatherFullName', 'motherFullName', 'totalFamilyMembers', 'familyLocation', 'nativePlace', 'contactPersonName', 'contactPersonRelation', 'contactPersonNumber', 'contactPersonEmail', 'contactPersonAddress'];
    return required.every(field => formData[field].trim() !== '');
  };

  const handleNext = () => {
    if (!validateStep1()) {
      setError('Please fill all required fields in Step 1');
      return;
    }
    setError('');
    setCurrentStep(2);
  };

  const handlePrevious = () => {
    setCurrentStep(1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateStep2()) {
      setError('Please fill all required fields');
      return;
    }

    const token = localStorage.getItem('user_token');
    if (!token) {
      setError('Please login to create a profile');
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      if (profilePhoto) {
        formDataToSend.append('profilePhoto', profilePhoto);
      }

      const url = editingProfile
        ? `${API_ENDPOINTS.ADMIN_PROFILES}/${editingProfile.id}`
        : API_ENDPOINTS.PROFILE;

      const method = editingProfile ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      const data = await response.json();

      if (response.ok) {
        const successMessage = editingProfile
          ? 'Profile updated successfully!'
          : 'Profile submitted for approval. You will be notified once reviewed.';
        showDialog(
          editingProfile ? 'Profile Updated!' : 'Profile Submitted!',
          successMessage,
          'success'
        );
        // Refresh profiles list
        fetchExistingProfiles();
      } else {
        setError(data.message || `Failed to ${editingProfile ? 'update' : 'create'} profile`);
      }
    } catch (error) {
      console.error(`Error ${editingProfile ? 'updating' : 'creating'} profile:`, error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (showProfileList) {
    return (
      <section className="register-section">
        <div className="container">
          <div className="register-wrapper">
            <div className="register-left">
              <img src={metromonialimg} alt="matrimonial info" />
            </div>

            <div className="register-right">
              <div className="header-section">
                <h2 className="header-title">
                  <strong>My Matrimony Profiles</strong>
                </h2>
                <p className="sub-text">
                  Manage your matrimony profiles. You can create multiple profiles for your children.
                </p>
              </div>

              {existingProfiles.length === 0 ? (
                <div className="no-profiles-state">
                  <p className="no-profiles-text">
                    No matrimony profiles found. Create your first profile to get started.
                  </p>
                  <button
                    onClick={handleCreateNewProfile}
                    className="read-more-btn"
                  >
                    <span>Create First Profile</span>
                  </button>
                </div>
              ) : (
                <div>
                  <div className="profile-list">
                    {existingProfiles.map((profile) => (
                      <div key={profile.id} className="profile-list-card">
                        <div className="profile-list-content">
                          <div className="profile-list-info">
                            <h3 className="profile-list-name">
                              {profile.firstName} {profile.surname}
                            </h3>
                            <p className="profile-list-details">
                              Profile for: {profile.profileFor} | Gender: {profile.gender} | Status: {profile.status}
                            </p>
                            <p className="profile-list-age">
                              Age: {new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear()} years
                            </p>
                          </div>
                          <div className="profile-list-actions">
                            <button
                              onClick={() => handleEditProfile(profile)}
                              className="read-more-btn"
                            >
                              <span>Edit</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="add-profile-btn-wrapper">
                    <button
                      onClick={handleCreateNewProfile}
                      className="read-more-btn"
                    >
                      <span>+ Add New Profile</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="register-section">
      <div className="container">
        <div className="register-wrapper">
          <div className="register-left">
            <img src={metromonialimg} alt="matrimonial info" />
          </div>

          <div className="register-right">
            <div className="header-section">
              <h2 className="header-title">
                <strong>
                  {editingProfile ? 'Edit Profile' : (currentStep === 1 ? 'Personal Information' : 'Family & Contact Information')}
                </strong>
              </h2>
              <p className="sub-text">
                {editingProfile ? 'Update profile information' : `Step ${currentStep} of 2`}
              </p>
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <form className="register-form" onSubmit={currentStep === 2 ? handleSubmit : (e) => e.preventDefault()}>
              {currentStep === 1 && (
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Profile For*</label>
                    <select name="profileFor" value={formData.profileFor} onChange={handleInputChange}>
                      <option value="Myself">Myself</option>
                      <option value="Son">Son</option>
                      <option value="Daughter">Daughter</option>
                      <option value="Brother">Brother</option>
                      <option value="Sister">Sister</option>
                      <option value="Relative">Relative</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Marital Status*</label>
                    <select name="maritalStatus" value={formData.maritalStatus} onChange={handleInputChange}>
                      <option value="Single">Single</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Number of Children</label>
                    <input type="number" name="noOfChildren" value={formData.noOfChildren} onChange={handleInputChange} min="0" />
                  </div>

                  <div className="form-group">
                    <label>First Name*</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                  </div>

                  <div className="form-group">
                    <label>Father Name*</label>
                    <input type="text" name="fatherName" value={formData.fatherName} onChange={handleInputChange} required />
                  </div>

                  <div className="form-group">
                    <label>Surname*</label>
                    <input type="text" name="surname" value={formData.surname} onChange={handleInputChange} required />
                  </div>

                  <div className="form-group">
                    <label>Gender*</label>
                    <div className="radio-group">
                      <label>
                        <input type="radio" name="gender" value="Male" checked={formData.gender === 'Male'} onChange={handleInputChange} required /> Male
                      </label>
                      <label>
                        <input type="radio" name="gender" value="Female" checked={formData.gender === 'Female'} onChange={handleInputChange} required /> Female
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Date of Birth*</label>
                    <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} required />
                  </div>

                  <div className="form-group">
                    <label>Time of Birth*</label>
                    <input type="time" name="timeOfBirth" value={formData.timeOfBirth} onChange={handleInputChange} required />
                  </div>

                  <div className="form-group">
                    <label>Birth Place*</label>
                    <input type="text" name="birthPlace" value={formData.birthPlace} onChange={handleInputChange} required />
                  </div>

                  <div className="form-group">
                    <label>Height (in cm)*</label>
                    <input type="number" name="height" value={formData.height} onChange={handleInputChange} required />
                  </div>

                  <div className="form-group">
                    <label>Weight (in kg)*</label>
                    <input type="number" name="weight" value={formData.weight} onChange={handleInputChange} required />
                  </div>

                  <div className="form-group">
                    <label>Physical Disability</label>
                    <select name="physicalDisability" value={formData.physicalDisability} onChange={handleInputChange}>
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Glasses</label>
                    <select name="glasses" value={formData.glasses} onChange={handleInputChange}>
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Mangal</label>
                    <select name="mangal" value={formData.mangal} onChange={handleInputChange}>
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>

                  <div className="form-group full-width">
                    <label>Expectation</label>
                    <textarea name="expectation" value={formData.expectation} onChange={handleInputChange} rows="3"></textarea>
                  </div>

                  <div className="form-group full-width">
                    <label>Profile Photo</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="form-grid">
                  <div className="form-group">
                    <label>Education Qualification*</label>
                    <input type="text" name="educationQualification" value={formData.educationQualification} onChange={handleInputChange} required />
                  </div>

                  <div className="form-group">
                    <label>Education Details</label>
                    <input type="text" name="educationDetails" value={formData.educationDetails} onChange={handleInputChange} />
                  </div>

                  <div className="form-group">
                    <label>Job Type*</label>
                    <select name="jobType" value={formData.jobType} onChange={handleInputChange} required>
                      <option value="">Select Job Type</option>
                      <option value="Government">Government</option>
                      <option value="Private">Private</option>
                      <option value="Business">Business</option>
                      <option value="Self-Employed">Self-Employed</option>
                      <option value="Student">Student</option>
                      <option value="Unemployed">Unemployed</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Job Description</label>
                    <input type="text" name="jobDescription" value={formData.jobDescription} onChange={handleInputChange} />
                  </div>

                  <div className="form-group">
                    <label>Designation*</label>
                    <input type="text" name="designation" value={formData.designation} onChange={handleInputChange} required />
                  </div>

                  <div className="form-group">
                    <label>Current Location*</label>
                    <input type="text" name="currentLocation" value={formData.currentLocation} onChange={handleInputChange} required />
                  </div>

                  <div className="form-group">
                    <label>Income Currency</label>
                    <select name="incomeCurrency" value={formData.incomeCurrency} onChange={handleInputChange}>
                      <option value="INR">INR</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Monthly Income*</label>
                    <input type="number" name="monthlyIncome" value={formData.monthlyIncome} onChange={handleInputChange} required />
                  </div>

                  <div className="form-group">
                    <label>Father Full Name*</label>
                    <input type="text" name="fatherFullName" value={formData.fatherFullName} onChange={handleInputChange} required />
                  </div>

                  <div className="form-group">
                    <label>Mother Full Name*</label>
                    <input type="text" name="motherFullName" value={formData.motherFullName} onChange={handleInputChange} required />
                  </div>

                  <div className="form-group">
                    <label>Father Occupation</label>
                    <input type="text" name="fatherOccupation" value={formData.fatherOccupation} onChange={handleInputChange} />
                  </div>

                  <div className="form-group">
                    <label>Mother Occupation</label>
                    <input type="text" name="motherOccupation" value={formData.motherOccupation} onChange={handleInputChange} />
                  </div>

                  <div className="form-group">
                    <label>Total Family Members*</label>
                    <input type="number" name="totalFamilyMembers" value={formData.totalFamilyMembers} onChange={handleInputChange} required min="1" />
                  </div>

                  <div className="form-group">
                    <label>Total Brothers</label>
                    <input type="number" name="totalBrothers" value={formData.totalBrothers} onChange={handleInputChange} min="0" />
                  </div>

                  <div className="form-group">
                    <label>Total Sisters</label>
                    <input type="number" name="totalSisters" value={formData.totalSisters} onChange={handleInputChange} min="0" />
                  </div>

                  <div className="form-group">
                    <label>Married Brothers</label>
                    <input type="number" name="marriedBrothers" value={formData.marriedBrothers} onChange={handleInputChange} min="0" />
                  </div>

                  <div className="form-group">
                    <label>Married Sisters</label>
                    <input type="number" name="marriedSisters" value={formData.marriedSisters} onChange={handleInputChange} min="0" />
                  </div>

                  <div className="form-group">
                    <label>Family Type</label>
                    <select name="familyType" value={formData.familyType} onChange={handleInputChange}>
                      <option value="Nuclear">Nuclear</option>
                      <option value="Joint">Joint</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Family Values</label>
                    <select name="familyValues" value={formData.familyValues} onChange={handleInputChange}>
                      <option value="Traditional">Traditional</option>
                      <option value="Modern">Modern</option>
                      <option value="Liberal">Liberal</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Family Location*</label>
                    <input type="text" name="familyLocation" value={formData.familyLocation} onChange={handleInputChange} required />
                  </div>

                  <div className="form-group">
                    <label>Native Place*</label>
                    <input type="text" name="nativePlace" value={formData.nativePlace} onChange={handleInputChange} required />
                  </div>

                  <div className="form-group">
                    <label>Family Wealth</label>
                    <input type="text" name="familyWealth" value={formData.familyWealth} onChange={handleInputChange} />
                  </div>

                  <div className="form-group">
                    <label>Contact Person Name*</label>
                    <input type="text" name="contactPersonName" value={formData.contactPersonName} onChange={handleInputChange} required />
                  </div>

                  <div className="form-group">
                    <label>Contact Person Relation*</label>
                    <input type="text" name="contactPersonRelation" value={formData.contactPersonRelation} onChange={handleInputChange} required />
                  </div>

                  <div className="form-group">
                    <label>Contact Person Number*</label>
                    <input type="tel" name="contactPersonNumber" value={formData.contactPersonNumber} onChange={handleInputChange} required />
                  </div>

                  <div className="form-group">
                    <label>Contact Person Email*</label>
                    <input type="email" name="contactPersonEmail" value={formData.contactPersonEmail} onChange={handleInputChange} required />
                  </div>

                  <div className="form-group full-width">
                    <label>Contact Person Address*</label>
                    <textarea name="contactPersonAddress" value={formData.contactPersonAddress} onChange={handleInputChange} rows="3" required></textarea>
                  </div>
                </div>
              )}

              <div className="form-button-group">
                {currentStep === 2 && (
                  <button 
                    type="button" 
                    onClick={handlePrevious}
                    className="read-more-btn"
                  >
                    <span>Previous</span>
                  </button>
                )}
                
                {currentStep === 1 ? (
                  <button 
                    type="button" 
                    onClick={handleNext}
                    className="read-more-btn full-width"
                  >
                    <span>Next</span>
                  </button>
                ) : (
                  <button 
                    type="submit" 
                    className="read-more-btn"
                    disabled={loading}
                  >
                    <span>{loading ? (editingProfile ? 'Updating Profile...' : 'Creating Profile...') : (editingProfile ? 'Update Profile' : 'Create Profile')}</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <CustomDialog
        isOpen={dialog.isOpen}
        onClose={handleDialogClose}
        title={dialog.title}
        message={dialog.message}
        type={dialog.type}
      />
    </section>
  );
};

export default Matrimonialpersonalinfo;
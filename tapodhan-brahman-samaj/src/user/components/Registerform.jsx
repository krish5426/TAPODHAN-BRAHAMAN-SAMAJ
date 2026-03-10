import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import registerImg from "../assets/images/mobile.png";
import { API_ENDPOINTS } from '../../config/api';
import { INDIAN_STATES, INDUSTRY_OPTIONS } from "../../config/constants";
import CustomDialog from "../components/CustomDialog";

const BusinessRegisterform = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    contactNumber: "",
    category: "",
    businessType: "",
    address: "",
    city: "",
    state: "",
    description: "",
    website: ""
  });
  const [posterPhoto, setPosterPhoto] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState({ isOpen: false, message: '', type: 'success' });
  const [owners, setOwners] = useState([""]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleOwnerChange = (index, value) => {
    const newOwners = [...owners];
    newOwners[index] = value;
    setOwners(newOwners);
    setFormData({
      ...formData,
      ownerName: newOwners.filter(n => n.trim() !== "").join(", ")
    });
  };

  const addOwner = () => {
    setOwners([...owners, ""]);
  };

  const removeOwner = (index) => {
    const newOwners = [...owners];
    newOwners.splice(index, 1);
    setOwners(newOwners);
    setFormData({
      ...formData,
      ownerName: newOwners.filter(n => n.trim() !== "").join(", ")
    });
  };

  const handleFileChange = (e) => {
    setPosterPhoto(e.target.files[0]);
  };

  const nextStep = (e) => {
    e.preventDefault();
    // Basic validation for Step 1
    if (!formData.businessName || !formData.ownerName || !formData.contactNumber) {
      setError("Please fill all required fields in Step 1.");
      return;
    }
    setError("");
    setStep(2);
  };

  const prevStep = () => {
    setError("");
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const token = localStorage.getItem("user_token");
    if (!token) {
      setError("login_required");
      setLoading(false);
      return;
    }

    if (!formData.address) {
      setError("Please fill all required fields in Step 2.");
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      data.append("posterPhoto", posterPhoto);

      const response = await fetch(API_ENDPOINTS.BUSINESS, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token} `
        },
        body: data
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to register business");
      }

      setDialog({ isOpen: true, message: 'Business Registered Successfully! We will let you know once approved by admin within 24 hrs.', type: 'success' });
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="register-section">
      <div className="container">
        <div className="register-wrapper">
          <div className="register-left">
            <img src={registerImg} alt="Register Business" />
          </div>

          <div className="register-right">
            <div className="header-section">
              <h2 className="header-title">
                <strong>
                  {step === 1 ? "Step 1: Basic Info" : "Step 2: Location & Details"}
                </strong>
              </h2>
            </div>

            <p className="sub-text">
              {step === 1 ? "Enter your business basics" : "Tell us where you are located"}
            </p>

            <form className="register-form" onSubmit={step === 1 ? nextStep : handleSubmit}>
              <div className="form-grid">

                {step === 1 && (
                  <>
                    <div className="form-group">
                      <label>Business Name*</label>
                      <input type="text" name="businessName" placeholder="Business Name" value={formData.businessName} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label>Owner Name*</label>
                      {owners.map((owner, index) => (
                        <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                          <input
                            type="text"
                            placeholder="Owner Name"
                            value={owner}
                            onChange={(e) => handleOwnerChange(index, e.target.value)}
                            required={index === 0}
                          />
                          {index === owners.length - 1 ? (
                            <button
                              type="button"
                              onClick={addOwner}
                              style={{
                                background: '#4CAF50', color: 'white', border: 'none',
                                width: '40px', height: '40px', borderRadius: '4px', cursor: 'pointer',
                                fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                              }}
                            >
                              +
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => removeOwner(index)}
                              style={{
                                background: '#f44336', color: 'white', border: 'none',
                                width: '40px', height: '40px', borderRadius: '4px', cursor: 'pointer',
                                fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                              }}
                            >
                              -
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label>Contact Number*</label>
                      <input type="text" name="contactNumber" placeholder="Contact Number" value={formData.contactNumber} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label>Category</label>
                      <select name="category" value={formData.category} onChange={handleChange} style={{ fontFamily: 'Inter Tight, sans-serif' }}>
                        <option value="">Select Category</option>
                        <option value="Restaurant">Restaurant</option>
                        <option value="Shop">Shop</option>
                        <option value="Service">Service</option>
                        <option value="Freelancer">Freelancer</option>
                        <option value="Education">Education</option>
                        <option value="Consultancy">Consultancy</option>
                        <option value="Medical & Health">Medical &amp; Health</option>
                        <option value="Trading">Trading</option>
                        <option value="Professional Services">Professional Services</option>
                        <option value="Karm Kand">Karm Kand</option>
                        <option value="Transport / Travel">Transport / Travel</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Business Type</label>
                      <input type="text" name="businessType" placeholder="e.g. Private, Public, Partnership" value={formData.businessType} onChange={handleChange} />
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>

                    <div className="form-group">
                      <label>State</label>
                      <select name="state" value={formData.state} onChange={handleChange} style={{ fontFamily: 'Inter Tight, sans-serif' }}>
                        <option value="">Select State</option>
                        {INDIAN_STATES.map((state) => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>City</label>
                      <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                      <label>Website</label>
                      <input type="text" name="website" placeholder="Website URL" value={formData.website} onChange={handleChange} />
                    </div>
                    <div className="form-group full-width">
                      <label>Poster Photo</label>
                      <input type="file" accept="image/*" onChange={handleFileChange} />
                    </div>
                    <div className="form-group full-width">
                      <label>Description</label>
                      <textarea name="description" placeholder="Business Description" value={formData.description} onChange={handleChange}></textarea>
                    </div>
                    <div className="form-group full-width">
                      <label>Business Address*</label>
                      <textarea name="address" placeholder="Full Address" value={formData.address} onChange={handleChange} required></textarea>
                    </div>
                  </>
                )}

              </div>

              {error === "login_required" ? (
                <div style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "rgba(0,0,0,0.5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 1000
                }}>
                  <div style={{
                    background: "white",
                    padding: "30px",
                    borderRadius: "12px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                    textAlign: "center",
                    maxWidth: "400px",
                    width: "90%",
                    fontFamily: '"Inter Tight", sans-serif'
                  }}>
                    <div style={{
                      width: "60px",
                      height: "60px",
                      background: "#b9252f",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 20px",
                      fontSize: "24px",
                      color: "white"
                    }}>
                      !
                    </div>
                    <h3 style={{ margin: "0 0 15px 0", color: "#333", letterSpacing: '0.5px' }}>Login Required</h3>
                    <p style={{ margin: "0 0 25px 0", color: "#666", lineHeight: "1.5", fontSize: '16px', letterSpacing: '0.5px' }}>
                      Please login to access business registration.
                    </p>
                    <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                      <button
                        className="read-more-btn"
                        onClick={() => navigate("/login")}
                        style={{
                          background: 'linear-gradient(180deg, #b9252f 0%, #6a2c2d 100%)',
                          border: 'none',
                          padding: '12px 25px',
                          letterSpacing: '0.5px'
                        }}
                      >
                        <span style={{ fontSize: '16px', fontWeight: '600' }}>Login</span>
                      </button>
                      <button
                        className="read-more-btn"
                        onClick={() => setError("")}
                        style={{
                          background: 'transparent',
                          border: '2px solid #b9252f',
                          padding: '10px 25px',
                          letterSpacing: '0.5px'
                        }}
                      >
                        <span style={{ color: '#b9252f', fontSize: '16px', fontWeight: '600' }}>Cancel</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                {step === 2 && (
                  <button type="button" className="read-more-btn back-btn" onClick={prevStep}>
                    <span>Back</span>
                  </button>
                )}

                <button type="submit" className="read-more-btn" disabled={loading}>
                  <span>{loading ? "Processing..." : (step === 1 ? "Continue" : "Submit")}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <CustomDialog
        isOpen={dialog.isOpen}
        message={dialog.message}
        type={dialog.type}
        onClose={() => {
          setDialog(prev => ({ ...prev, isOpen: false }));
          if (dialog.type === 'success') {
            navigate('/business-contact');
          }
        }}
      />
    </section>
  );
};

export default BusinessRegisterform;
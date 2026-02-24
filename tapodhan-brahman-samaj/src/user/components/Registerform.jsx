import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import registerImg from "../assets/images/mobile.png";
import { API_ENDPOINTS } from '../../config/api';

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
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
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

      setSuccess(true);
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

            {success ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <div style={{
                  background: "#d4edda",
                  color: "#155724",
                  padding: "20px",
                  borderRadius: "8px",
                  border: "1px solid #c3e6cb",
                  marginBottom: "20px"
                }}>
                  <h3 style={{ margin: "0 0 10px 0" }}>✓ Business Registered Successfully!</h3>
                  <p style={{ margin: 0 }}>Your business has been registered and will be visible once approved within 24 hours.</p>
                </div>
                <button
                  className="read-more-btn"
                  onClick={() => navigate("/business-contact")}
                  style={{ marginTop: "15px" }}
                >
                  <span>View Business Listings</span>
                </button>
              </div>
            ) : (
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
                        <input type="text" name="ownerName" placeholder="Owner Name" value={formData.ownerName} onChange={handleChange} required />
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
                        <select name="category" value={formData.category} onChange={handleChange} style={{ fontFamily: 'Barlow, sans-serif' }}>
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
                        <label>City</label>
                        <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} />
                      </div>
                      <div className="form-group">
                        <label>State</label>
                        <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} />
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
                      width: "90%"
                    }}>
                      <div style={{
                        width: "60px",
                        height: "60px",
                        background: "#dc3545",
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
                      <h3 style={{ margin: "0 0 15px 0", color: "#333" }}>Login Required</h3>
                      <p style={{ margin: "0 0 25px 0", color: "#666", lineHeight: "1.5" }}>
                        Please login to access business registration.
                      </p>
                      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                        <button
                          className="read-more-btn"
                          onClick={() => navigate("/login")}
                          style={{ background: "#007bff" }}
                        >
                          <span>Login</span>
                        </button>
                        <button
                          className="read-more-btn"
                          onClick={() => setError("")}
                          style={{ background: "#6c757d" }}
                        >
                          <span>Cancel</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

                <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                  {step === 2 && (
                    <button type="button" className="read-more-btn" onClick={prevStep}>
                      <span>Back</span>
                    </button>
                  )}

                  <button type="submit" className="read-more-btn" disabled={loading}>
                    <span>{loading ? "Processing..." : (step === 1 ? "Continue" : "Submit")}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessRegisterform;
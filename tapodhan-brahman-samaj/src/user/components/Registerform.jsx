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
    if (!formData.businessName || !formData.ownerName || !formData.email || !formData.contactNumber || !formData.category || !formData.businessType) {
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
      if (window.confirm("You are not logged in. Redirect to login?")) {
        // Redirect logic here if needed
      }
      setError("You must be logged in to register a business.");
      setLoading(false);
      return;
    }

    if (!formData.address || !formData.city || !formData.state) {
      setError("Please fill all required fields in Step 2.");
      setLoading(false);
      return;
    }

    if (!posterPhoto) {
      setError("Please upload a poster photo.");
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

      alert("Business registered successfully!");
      navigate("/business-contact");
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
                      <input type="text" name="ownerName" placeholder="Owner Name" value={formData.ownerName} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label>Email*</label>
                      <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label>Contact Number*</label>
                      <input type="text" name="contactNumber" placeholder="Contact Number" value={formData.contactNumber} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label>Category*</label>
                      <select name="category" value={formData.category} onChange={handleChange} required>
                        <option value="">Select Category</option>
                        <option value="Restaurant">Restaurant</option>
                        <option value="Shop">Shop</option>
                        <option value="Service">Service</option>
                        <option value="Freelancer">Freelancer</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Business Type*</label>
                      <input type="text" name="businessType" placeholder="e.g. Private, Public, Partnership" value={formData.businessType} onChange={handleChange} required />
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="form-group">
                      <label>City*</label>
                      <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label>State*</label>
                      <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label>Website</label>
                      <input type="text" name="website" placeholder="Website URL" value={formData.website} onChange={handleChange} />
                    </div>
                    <div className="form-group full-width">
                      <label>Poster Photo*</label>
                      <input type="file" accept="image/*" onChange={handleFileChange} required={!posterPhoto} />
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

              {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                {step === 2 && (
                  <button type="button" className="read-more-btn" onClick={prevStep} style={{ background: "#ccc" }}>
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
    </section>
  );
};

export default BusinessRegisterform;
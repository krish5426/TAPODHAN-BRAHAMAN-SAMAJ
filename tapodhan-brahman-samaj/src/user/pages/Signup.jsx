import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import registerImg from "../assets/images/mobile.png";
import InnerBanner from "../components/InnerBanner";
import RegisterBanner from '../assets/images/register-banner.jpg';
import { API_ENDPOINTS } from '../../config/api';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        password: '',
        registerForProfile: false,
        acceptTerms: false
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({
            ...formData,
            [e.target.name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (!formData.acceptTerms) {
            setError('You must accept the terms and conditions');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(API_ENDPOINTS.REGISTER, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            alert('Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <InnerBanner
                title="Sign Up"
                backgroundImage={RegisterBanner}
                breadcrumb={[
                    { label: "Home", link: "/" },
                    { label: "Sign Up" }
                ]}
            />
            <section className="register-section">
                <div className="container">
                    <div className="register-wrapper">
                        <div className="register-left">
                            <img src={registerImg} alt="Sign Up" />
                        </div>
                        <div className="register-right">
                            <div className="header-section">
                                <h2 className="header-title">
                                    <strong>Create your account</strong>
                                </h2>
                            </div>
                            <p className="sub-text">Fill in your details to get started</p>

                            <form className="register-form" onSubmit={handleSubmit}>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>First Name*</label>
                                        <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Last Name*</label>
                                        <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Email*</label>
                                        <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group">
                                        <label>Mobile Number*</label>
                                        <input type="text" name="mobile" placeholder="Mobile Number" value={formData.mobile} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Password*</label>
                                        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group full-width" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                                        <input type="checkbox" name="registerForProfile" checked={formData.registerForProfile} onChange={handleChange} style={{ width: 'auto' }} />
                                        <label style={{ margin: 0 }}>Register for Matrimonial Profile?</label>
                                    </div>
                                    <div className="form-group full-width" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px' }}>
                                        <input type="checkbox" name="acceptTerms" checked={formData.acceptTerms} onChange={handleChange} style={{ width: 'auto' }} required />
                                        <label style={{ margin: 0 }}>I accept the Terms & Conditions*</label>
                                    </div>
                                </div>

                                {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

                                <button type="submit" className="read-more-btn" disabled={loading}>
                                    <span>{loading ? 'Registering...' : 'Sign Up'}</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Signup;

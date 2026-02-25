import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import registerImg from "../assets/images/mobile.png";
import InnerBanner from "../components/InnerBanner";
import CustomDialog from "../components/CustomDialog";
import RegisterBanner from '../assets/images/register-banner.jpg';
import { API_ENDPOINTS } from '../../config/api';

const ForgotPassword = () => {
    const navigate = useNavigate();
    
    // Step 1: Request OTP
    const [identifier, setIdentifier] = useState('');
    
    // Step 2: Reset Password
    const [step, setStep] = useState(1);
    const [resetData, setResetData] = useState({
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(API_ENDPOINTS.FORGOT_PASSWORD, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ identifier })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to send OTP');
            }

            setStep(2);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        
        if (resetData.newPassword !== resetData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch(API_ENDPOINTS.RESET_PASSWORD, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    identifier,
                    otp: resetData.otp,
                    newPassword: resetData.newPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to reset password');
            }

            setShowSuccessDialog(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResetChange = (e) => {
        setResetData({
            ...resetData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <>
            <InnerBanner
                title="Forgot Password"
                backgroundImage={RegisterBanner}
                breadcrumb={[
                    { label: "Home", link: "/" },
                    { label: "Login", link: "/login" },
                    { label: "Forgot Password" }
                ]}
            />
            <section className="register-section">
                <div className="container">
                    <div className="register-wrapper">
                        <div className="register-left">
                            <img src={registerImg} alt="Forgot Password" />
                        </div>
                        <div className="register-right">
                            <div className="header-section">
                                <h2 className="header-title">
                                    <strong>{step === 1 ? 'Reset Password' : 'Enter OTP & New Password'}</strong>
                                </h2>
                            </div>
                            <p className="sub-text">
                                {step === 1 
                                    ? 'Enter your registered Email Address or Mobile Number to receive an OTP.' 
                                    : `An OTP was sent to ${identifier}. Please enter it below.`}
                            </p>

                            {step === 1 ? (
                                <form className="register-form" onSubmit={handleRequestOtp}>
                                    <div className="form-grid">
                                        <div className="form-group full-width">
                                            <label>Email or Mobile Number*</label>
                                            <input 
                                                type="text" 
                                                value={identifier} 
                                                onChange={(e) => setIdentifier(e.target.value)} 
                                                placeholder="Email Address or Mobile Number" 
                                                required 
                                            />
                                        </div>
                                    </div>

                                    {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

                                    <button type="submit" className="read-more-btn" disabled={loading}>
                                        <span>{loading ? 'Sending OTP...' : 'Send OTP'}</span>
                                    </button>
                                </form>
                            ) : (
                                <form className="register-form" onSubmit={handleResetPassword}>
                                    <div className="form-grid">
                                        <div className="form-group full-width">
                                            <label>6-Digit OTP*</label>
                                            <input 
                                                type="text" 
                                                name="otp" 
                                                placeholder="Enter OTP" 
                                                value={resetData.otp} 
                                                onChange={handleResetChange} 
                                                required 
                                            />
                                        </div>
                                        <div className="form-group full-width">
                                            <label>New Password*</label>
                                            <input 
                                                type="password" 
                                                name="newPassword" 
                                                placeholder="New Password" 
                                                value={resetData.newPassword} 
                                                onChange={handleResetChange} 
                                                required 
                                            />
                                        </div>
                                        <div className="form-group full-width">
                                            <label>Confirm New Password*</label>
                                            <input 
                                                type="password" 
                                                name="confirmPassword" 
                                                placeholder="Confirm New Password" 
                                                value={resetData.confirmPassword} 
                                                onChange={handleResetChange} 
                                                required 
                                            />
                                        </div>
                                    </div>

                                    {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

                                    <button type="submit" className="read-more-btn" disabled={loading}>
                                        <span>{loading ? 'Resetting Password...' : 'Reset Password'}</span>
                                    </button>
                                </form>
                            )}

                        </div>
                    </div>
                </div>
            </section>
            
            <CustomDialog 
                isOpen={showSuccessDialog}
                message="Password reset successfully! You can now log in with your new password."
                type="success"
                onClose={() => {
                    setShowSuccessDialog(false);
                    navigate('/login');
                }}
            />
        </>
    );
};

export default ForgotPassword;

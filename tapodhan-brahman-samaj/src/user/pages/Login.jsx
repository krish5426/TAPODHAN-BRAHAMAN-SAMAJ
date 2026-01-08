import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import registerImg from "../assets/images/mobile.png";
import InnerBanner from "../components/InnerBanner";
import RegisterBanner from '../assets/images/register-banner.jpg';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Store token and user info
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            alert('Login successful!');
            navigate('/'); // Redirect to home or dashboard
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <InnerBanner
                title="Login"
                backgroundImage={RegisterBanner}
                breadcrumb={[
                    { label: "Home", link: "/" },
                    { label: "Login" }
                ]}
            />
            <section className="register-section">
                <div className="container">
                    <div className="register-wrapper">
                        <div className="register-left">
                            <img src={registerImg} alt="Login" />
                        </div>
                        <div className="register-right">
                            <div className="header-section">
                                <h2 className="header-title">
                                    <strong>Welcome Back</strong>
                                </h2>
                            </div>
                            <p className="sub-text">Login to your account</p>

                            <form className="register-form" onSubmit={handleSubmit}>
                                <div className="form-grid">
                                    <div className="form-group full-width">
                                        <label>Email*</label>
                                        <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Password*</label>
                                        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                                    </div>
                                </div>

                                {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

                                <button type="submit" className="read-more-btn" disabled={loading}>
                                    <span>{loading ? 'Logging in...' : 'Login'}</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Login;

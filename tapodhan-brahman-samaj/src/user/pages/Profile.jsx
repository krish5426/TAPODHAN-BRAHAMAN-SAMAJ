import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InnerBanner from '../components/InnerBanner';
import bannerImage from '../assets/images/contact-banner.jpg';
import { API_ENDPOINTS } from '../../config/api';

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const breadcrumb = [
        { label: 'Home', link: '/' },
        { label: 'Profile' }
    ];

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('user_token');
            console.log('Token:', token);
            console.log('API URL:', API_ENDPOINTS.PROFILE);
            
            if (!token) {
                console.error('No token found');
                setLoading(false);
                return;
            }
            
            const response = await fetch(`${API_ENDPOINTS.PROFILE}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Response status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('Profile data:', data);
                setUser(data);
            } else {
                const errorText = await response.text();
                console.error('Failed to fetch profile:', response.status, errorText);
                
                // Fallback: get user data from localStorage immediately
                const userDetails = localStorage.getItem('user_details');
                if (userDetails) {
                    const userData = JSON.parse(userDetails);
                    console.log('Using fallback user data:', userData);
                    setUser(userData);
                }
            }
        } catch (error) {
            console.error('Profile fetch error:', error);
            
            // Fallback: get user data from localStorage
            const userDetails = localStorage.getItem('user_details');
            if (userDetails) {
                const userData = JSON.parse(userDetails);
                setUser(userData);
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <InnerBanner title="Profile" breadcrumb={breadcrumb} backgroundImage={bannerImage} />
                <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
                    <h2>Loading...</h2>
                </div>
            </>
        );
    }

    if (!user) {
        return (
            <>
                <InnerBanner title="Profile" breadcrumb={breadcrumb} backgroundImage={bannerImage} />
                <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
                    <h2>Profile not found</h2>
                </div>
            </>
        );
    }

    return (
        <>
            <InnerBanner title="Profile" breadcrumb={breadcrumb} backgroundImage={bannerImage} />
            <div className="container" style={{ padding: '100px 20px' }}>
            <div style={{ 
                maxWidth: '800px', 
                margin: '0 auto', 
                background: '#fff', 
                borderRadius: '12px', 
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                overflow: 'hidden'
            }}>
                <div className="my-profile" style={{ 
                    background: 'linear-gradient(135deg, #b9252f 0%, #6a2c2d 100%)', 
                    color: 'white', 
                    padding: '30px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ textAlign: 'center', flex: 1 }}>
                        <h1 style={{ margin: '0 0 10px 0', fontSize: '32px', fontWeight: '600' }}>
                            My Profile
                        </h1>
                        <p style={{ margin: 0, opacity: 0.9 }}>Account Information</p>
                    </div>
                    <button 
                        style={{
                            background: 'rgba(255,255,255,0.2)',
                            border: '2px solid rgba(255,255,255,0.3)',
                            color: 'white',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.background = 'rgba(255,255,255,0.3)';
                            e.target.style.borderColor = 'rgba(255,255,255,0.5)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.background = 'rgba(255,255,255,0.2)';
                            e.target.style.borderColor = 'rgba(255,255,255,0.3)';
                        }}
                        onClick={() => navigate('/edit-profile')}
                    >
                        ✏️ Edit Profile
                    </button>
                </div>

                <div style={{ padding: '40px' }}>
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                        gap: '30px' 
                    }}>
                        <div>
                            <div style={{ marginBottom: '25px' }}>
                                <label style={{ 
                                    display: 'block', 
                                    fontSize: '14px', 
                                    fontWeight: '600', 
                                    color: '#666', 
                                    marginBottom: '8px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    First Name
                                </label>
                                <div style={{ 
                                    fontSize: '18px', 
                                    fontWeight: '500', 
                                    color: '#333',
                                    padding: '12px 0',
                                    borderBottom: '2px solid #f0f0f0'
                                }}>
                                    {user.firstName}
                                </div>
                            </div>

                            <div style={{ marginBottom: '25px' }}>
                                <label style={{ 
                                    display: 'block', 
                                    fontSize: '14px', 
                                    fontWeight: '600', 
                                    color: '#666', 
                                    marginBottom: '8px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    Email Address
                                </label>
                                <div style={{ 
                                    fontSize: '18px', 
                                    fontWeight: '500', 
                                    color: '#333',
                                    padding: '12px 0',
                                    borderBottom: '2px solid #f0f0f0'
                                }}>
                                    {user.email}
                                </div>
                            </div>

                            <div style={{ marginBottom: '25px' }}>
                                <label style={{ 
                                    display: 'block', 
                                    fontSize: '14px', 
                                    fontWeight: '600', 
                                    color: '#666', 
                                    marginBottom: '8px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    Registered For Profile
                                </label>
                                <div style={{ 
                                    fontSize: '18px', 
                                    fontWeight: '500', 
                                    color: user.registerForProfile ? '#28a745' : '#6c757d',
                                    padding: '12px 0',
                                    borderBottom: '2px solid #f0f0f0'
                                }}>
                                    {user.registerForProfile ? 'Yes' : 'No'}
                                </div>
                            </div>
                        </div>

                        <div>
                            <div style={{ marginBottom: '25px' }}>
                                <label style={{ 
                                    display: 'block', 
                                    fontSize: '14px', 
                                    fontWeight: '600', 
                                    color: '#666', 
                                    marginBottom: '8px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    Last Name
                                </label>
                                <div style={{ 
                                    fontSize: '18px', 
                                    fontWeight: '500', 
                                    color: '#333',
                                    padding: '12px 0',
                                    borderBottom: '2px solid #f0f0f0'
                                }}>
                                    {user.lastName}
                                </div>
                            </div>

                            <div style={{ marginBottom: '25px' }}>
                                <label style={{ 
                                    display: 'block', 
                                    fontSize: '14px', 
                                    fontWeight: '600', 
                                    color: '#666', 
                                    marginBottom: '8px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    Mobile Number
                                </label>
                                <div style={{ 
                                    fontSize: '18px', 
                                    fontWeight: '500', 
                                    color: '#333',
                                    padding: '12px 0',
                                    borderBottom: '2px solid #f0f0f0'
                                }}>
                                    {user.mobile}
                                </div>
                            </div>

                            <div style={{ marginBottom: '25px' }}>
                                <label style={{ 
                                    display: 'block', 
                                    fontSize: '14px', 
                                    fontWeight: '600', 
                                    color: '#666', 
                                    marginBottom: '8px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    Member Since
                                </label>
                                <div style={{ 
                                    fontSize: '18px', 
                                    fontWeight: '500', 
                                    color: '#333',
                                    padding: '12px 0',
                                    borderBottom: '2px solid #f0f0f0'
                                }}>
                                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </>
    );
}

export default Profile;
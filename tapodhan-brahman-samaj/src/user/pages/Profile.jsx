import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InnerBanner from '../components/InnerBanner';
import bannerImage from '../assets/images/contact-banner.jpg';
import ogImg from '../assets/images/ogimg.png';
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
            
            if (!token) {
                setLoading(false);
                return;
            }
            
            const response = await fetch(`${API_ENDPOINTS.PROFILE}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setUser(data);
            } else {
                const userDetails = localStorage.getItem('user_details');
                if (userDetails) {
                    setUser(JSON.parse(userDetails));
                }
            }
        } catch (error) {
            const userDetails = localStorage.getItem('user_details');
            if (userDetails) {
                setUser(JSON.parse(userDetails));
            }
        } finally {
            setLoading(false);
        }
    };
    
    if (loading) {
        return (
            <>
                <InnerBanner title="Profile" breadcrumb={breadcrumb} backgroundImage={bannerImage} />
                <section className="my-business-section">
                    <div className="container">
                        <div className="profile-loading">
                            <h2>Loading...</h2>
                        </div>
                    </div>
                </section>
            </>
        );
    }

    if (!user) {
        return (
            <>
                <InnerBanner title="Profile" breadcrumb={breadcrumb} backgroundImage={bannerImage} />
                <section className="my-business-section">
                    <div className="container">
                        <div className="profile-loading">
                            <h2>Profile not found</h2>
                        </div>
                    </div>
                </section>
            </>
        );
    }

    return (
        <>
            <InnerBanner title="Profile" breadcrumb={breadcrumb} backgroundImage={bannerImage} />
            <section className="my-business-section">
                <div className="container">
                    <div className="business-profile-header">
                        <h1 className="business-profile-title">My Business Profile</h1>
                        <button 
                            className="business-profile-btn"
                            onClick={() => navigate('/edit-profile')}
                        >
                            EDIT BUSINESS
                        </button>
                    </div>

                    <div className="business-profile-card">
                        <div className="business-profile-content">
                            <div className="business-profile-image">
                                <img 
                                    src={ogImg} 
                                    alt="Profile" 
                                />
                            </div>
                            
                            <div className="business-profile-details">
                                <h2 className="business-name">{user.firstName} {user.lastName}</h2>
                                
                                <div className="business-info-grid">
                                    <div className="business-info-item">
                                        <strong>First Name:</strong>
                                        {user.firstName}
                                    </div>
                                    
                                    <div className="business-info-item">
                                        <strong>Last Name:</strong>
                                        {user.lastName}
                                    </div>
                                    
                                    <div className="business-info-item">
                                        <strong>Email Address:</strong>
                                        {user.email}
                                    </div>
                                    
                                    <div className="business-info-item">
                                        <strong>Mobile Number:</strong>
                                        {user.mobile}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Profile;
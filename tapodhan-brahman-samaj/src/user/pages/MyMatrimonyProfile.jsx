import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InnerBanner from '../components/InnerBanner';
import bannerImage from '../assets/images/contact-banner.jpg';
import API_BASE_URL from '../../config/api';

function MyMatrimonyProfile() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const breadcrumb = [
        { label: 'Home', link: '/' },
        { label: 'My Matrimony Profile' }
    ];

    useEffect(() => {
        fetchMatrimonyProfile();
    }, []);

    const fetchMatrimonyProfile = async () => {
        try {
            const token = localStorage.getItem('user_token');
            console.log('Token:', token ? 'Found' : 'Not found');
            
            if (!token) {
                setLoading(false);
                return;
            }
            
            const url = `${API_BASE_URL}/my-matrimony-profile`;
            console.log('Fetching from:', url);
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            console.log('Response status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('Profile data:', data);
                setProfile(data);
            } else {
                const errorData = await response.json().catch(() => ({}));
                console.error('API Error:', response.status, errorData);
            }
        } catch (error) {
            console.error('Error fetching matrimony profile:', error);
        } finally {
            setLoading(false);
        }
    };
    
    if (loading) {
        return (
            <>
                <InnerBanner title="My Matrimony Profile" breadcrumb={breadcrumb} backgroundImage={bannerImage} />
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

    if (!profile) {
        return (
            <>
                <InnerBanner title="My Matrimony Profile" breadcrumb={breadcrumb} backgroundImage={bannerImage} />
                <section className="my-business-section">
                    <div className="container">
                        <div className="profile-not-found">
                            <h2>No Matrimony Profile Found</h2>
                            <p>You haven't created a matrimony profile yet.</p>
                            <button 
                                className="user-profile-btn"
                                onClick={() => navigate('/matrimonial-personal-info')}
                            >
                                Create Matrimony Profile
                            </button>
                        </div>
                    </div>
                </section>
            </>
        );
    }

    return (
        <>
            <InnerBanner title="My Matrimony Profile" breadcrumb={breadcrumb} backgroundImage={bannerImage} />
            <section className="my-profile-section">
                <div className="container">
                    <div className="user-profile-header">
                        <h1 className="user-profile-title">My Matrimony Profile</h1>
                        <div className="profile-status">
                            <span className={`status-badge ${profile.status}`}>
                                {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
                            </span>
                        </div>
                    </div>

                    <div className="user-profile-card">
                        <div className="user-profile-content">
                            <div className="user-profile-image">
                                {profile.profilePhoto ? (
                                    <img 
                                        src={`${API_BASE_URL}/uploads/${profile.profilePhoto}`} 
                                        alt="Profile" 
                                    />
                                ) : (
                                    <div className="no-image">No Photo</div>
                                )}
                            </div>
                            
                            <div className="user-profile-details">
                                <h2 className="business-name">
                                    {profile.firstName} {profile.surname}
                                </h2>
                                
                                <div className="business-info-grid">
                                    <div className="business-info-item">
                                        <strong>Gender:</strong>
                                        {profile.gender}
                                    </div>
                                    
                                    <div className="business-info-item">
                                        <strong>Date of Birth:</strong>
                                        {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString('en-GB') : 'N/A'}
                                    </div>
                                    
                                    <div className="business-info-item">
                                        <strong>City:</strong>
                                        {profile.city || 'N/A'}
                                    </div>
                                    
                                    <div className="business-info-item">
                                        <strong>Education:</strong>
                                        {profile.educationQualification || 'N/A'}
                                    </div>
                                    
                                    <div className="business-info-item">
                                        <strong>Occupation:</strong>
                                        {profile.occupation || 'N/A'}
                                    </div>
                                    
                                    <div className="business-info-item">
                                        <strong>Contact Email:</strong>
                                        {profile.contactpersonemail || 'N/A'}
                                    </div>
                                    
                                    <div className="business-info-item">
                                        <strong>Contact Number:</strong>
                                        {profile.contactpersonnumber || 'N/A'}
                                    </div>
                                    
                                    <div className="business-info-item">
                                        <strong>Height:</strong>
                                        {profile.height || 'N/A'}
                                    </div>
                                    
                                    <div className="business-info-item">
                                        <strong>Weight:</strong>
                                        {profile.weight || 'N/A'}
                                    </div>
                                    
                                    <div className="business-info-item">
                                        <strong>Marital Status:</strong>
                                        {profile.maritalStatus || 'N/A'}
                                    </div>
                                </div>
                                
                                {profile.status === 'pending' && (
                                    <div className="status-message">
                                        <p>Your profile is pending approval by the admin.</p>
                                    </div>
                                )}
                                
                                {profile.status === 'rejected' && (
                                    <div className="status-message error">
                                        <p>Your profile was rejected. Please contact support for more information.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default MyMatrimonyProfile;
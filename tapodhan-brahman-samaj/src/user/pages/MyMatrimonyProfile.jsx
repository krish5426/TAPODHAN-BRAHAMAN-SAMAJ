import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import InnerBanner from '../components/InnerBanner';
import bannerImage from '../assets/images/contact-banner.jpg';
import profileImg from "../../assets/images/profileimg.png";
import brideDefault from "../../assets/images/defaultfemale.jpg";
import groomDefault from "../../assets/images/defaultmale.jpg";
import API_BASE_URL from '../../config/api';

function MyMatrimonyProfile() {
    const navigate = useNavigate();
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const profilesPerPage = 8;

    const breadcrumb = [
        { label: 'Home', link: '/' },
        { label: 'My Matrimony Profiles' }
    ];

    useEffect(() => {
        fetchMyMatrimonyProfiles();
    }, []);

    const fetchMyMatrimonyProfiles = async () => {
        try {
            const token = localStorage.getItem('user_token');
            console.log('Token:', token ? 'Found' : 'Not found');

            if (!token) {
                setLoading(false);
                return;
            }

            const url = `${API_BASE_URL}/my-matrimony-profiles`;
            console.log('Fetching from:', url);

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log('Response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('Profiles data:', data);
                setProfiles(data);
            } else {
                const errorData = await response.json().catch(() => ({}));
                console.error('API Error:', response.status, errorData);
            }
        } catch (error) {
            console.error('Error fetching matrimony profiles:', error);
        } finally {
            setLoading(false);
        }
    };

    const indexOfLastProfile = currentPage * profilesPerPage;
    const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
    const currentProfiles = profiles.slice(indexOfFirstProfile, indexOfLastProfile);
    const totalPages = Math.ceil(profiles.length / profilesPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return (
            <>
                <InnerBanner title="My Matrimony Profiles" breadcrumb={breadcrumb} backgroundImage={bannerImage} />
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

    return (
        <>
            <InnerBanner title="My Matrimony Profiles" breadcrumb={breadcrumb} backgroundImage={bannerImage} />

            <section className="list-section" style={{ display: profiles.length > 0 ? 'block' : 'none' }}>
                <div className="container">
                    <div className="header-section">
                        <span className="header-label">My Profiles</span>
                        <h2 className="header-title-center">
                            <strong>
                                <span>Your </span>
                                matrimony profiles
                            </strong>
                        </h2>
                        <div className="create-profile-section">
                            <button
                                className="user-profile-btn"
                                onClick={() => navigate('/matrimonial-personal-info')}
                            >
                                Create New Matrimony Profile
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="profile-section">
                <div className="container">
                    {profiles.length === 0 ? (
                        <div className="no-profiles-state">
                            <h2>No Matrimony Profiles Found</h2>
                            <p>You haven't created any matrimony profiles yet.</p>
                            <button
                                className="user-profile-btn"
                                onClick={() => navigate('/matrimonial-personal-info')}
                            >
                                Create Your First Matrimony Profile
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="profile-grid">
                                {currentProfiles.map((profile) => (
                                    <Link to={`/matrimonial-detail/${profile.id}`} key={profile.id} className="profile-card-link">
                                        <div className="profile-card">
                                            <div className="profile-img">
                                                <img
                                                    src={profile.profilePhoto ?
                                                        `${API_BASE_URL}/uploads/profile/${profile.profilePhoto}` :
                                                        (profile.gender === 'Female' ? brideDefault : groomDefault)
                                                    }
                                                    alt={`${profile.firstName} ${profile.lastName}`}
                                                />
                                                <div className={`status-badge ${profile.status}`}>
                                                    {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
                                                </div>
                                            </div>
                                            <div className="profile-content">
                                                <span className="profile-id">
                                                    Profile ID: {profile.gender === 'Female' ? 'F' : 'M'}-{profile.id}
                                                </span>
                                                <h4 className="profile-name">{profile.firstName} {profile.lastName}</h4>
                                                <p className="profile-dob">
                                                    Birth Date: {new Date(profile.dateOfBirth).toLocaleDateString()}
                                                </p>
                                                <p className="profile-info">
                                                    Age: {new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear()}
                                                </p>
                                                <p className="profile-info">
                                                    {profile.maritalStatus || 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="pagination">
                                    <button
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        «
                                    </button>
                                    {[...Array(totalPages)].map((_, index) => (
                                        <button
                                            key={index + 1}
                                            onClick={() => paginate(index + 1)}
                                            className={currentPage === index + 1 ? 'active' : ''}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        »
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </>
    );
}

export default MyMatrimonyProfile;

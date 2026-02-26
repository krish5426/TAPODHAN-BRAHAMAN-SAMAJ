import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InnerBanner from '../components/InnerBanner';
import bannerImage from '../assets/images/contact-banner.jpg';
import defaultBusinessImage from '../assets/images/default-business.png';
import { API_ENDPOINTS } from '../../config/api';

function BusinessDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [business, setBusiness] = useState(null);
    const [loading, setLoading] = useState(true);

    const breadcrumb = [
        { label: 'Home', link: '/' },
        { label: 'My Business', link: '/my-business' },
        { label: 'Business Detail' }
    ];

    useEffect(() => {
        fetchBusinessDetail();
    }, [id]);

    const fetchBusinessDetail = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('user_token');
            if (!token) {
                navigate('/login');
                return;
            }

            const response = await fetch(API_ENDPOINTS.MY_BUSINESS, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                const businesses = Array.isArray(data) ? data : (data ? [data] : []);
                const foundBusiness = businesses.find(b => b.id.toString() === id);

                if (foundBusiness) {
                    setBusiness(foundBusiness);
                } else {
                    console.error("Business not found with ID:", id);
                }
            } else {
                console.error('Failed to fetch business details');
            }
        } catch (error) {
            console.error('Error fetching business details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <InnerBanner title="Business Detail" breadcrumb={breadcrumb} backgroundImage={bannerImage} />
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

    if (!business) {
        return (
            <>
                <InnerBanner title="Business Detail" breadcrumb={breadcrumb} backgroundImage={bannerImage} />
                <section className="my-business-section">
                    <div className="container">
                        <div className="profile-not-found" style={{ textAlign: 'center', padding: '50px 0' }}>
                            <h2>Business not found</h2>
                            <button
                                className="user-profile-btn"
                                onClick={() => navigate('/my-business')}
                                style={{ marginTop: '20px' }}
                            >
                                Back to My Business
                            </button>
                        </div>
                    </div>
                </section>
            </>
        );
    }

    return (
        <>
            <InnerBanner title="Business Detail" breadcrumb={breadcrumb} backgroundImage={bannerImage} />
            <section className="my-profile-section">
                <div className="container">
                    <div className="user-profile-header">
                        <h1 className="user-profile-title"><strong><span>Business </span> Detail</strong></h1>
                        <div className="profile-status">
                            <span className={`status-badge status-${business.status?.toLowerCase() || 'pending'}`}>
                                {business.status ? business.status.charAt(0).toUpperCase() + business.status.slice(1) : 'Pending'}
                            </span>
                        </div>
                    </div>

                    <div className="user-profile-card">
                        <div className="user-profile-content">
                            <div className="user-profile-sticky-section">
                                <div className="user-profile-image">
                                    <img
                                        src={business.posterPhoto && business.posterPhoto !== "default_business.jpg"
                                            ? `${API_ENDPOINTS.UPLOADS}/${business.posterPhoto}`
                                            : defaultBusinessImage}
                                        alt={business.businessName}
                                        onError={(e) => { e.target.src = defaultBusinessImage; }}
                                    />
                                </div>
                                <h2 className="business-name">
                                    {business.businessName}
                                </h2>
                                <span className="profile-id">
                                    Business ID: {business.id}
                                </span>
                            </div>

                            <div className="user-profile-details">
                                {/* General Information Section */}
                                <div className="profile-section">
                                    <h3 className="section-title">General Information</h3>
                                    <div className="business-info-grid">
                                        <div className="business-info-item">
                                            <strong>Owner Name:</strong>
                                            {business.ownerName || 'N/A'}
                                        </div>
                                        <div className="business-info-item">
                                            <strong>Business Type:</strong>
                                            {business.businessType || 'N/A'}
                                        </div>
                                        <div className="business-info-item">
                                            <strong>Category:</strong>
                                            {business.category || 'N/A'}
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information Section */}
                                <div className="profile-section">
                                    <h3 className="section-title">Contact Information</h3>
                                    <div className="business-info-grid">
                                        <div className="business-info-item">
                                            <strong>Email:</strong>
                                            <a href={`mailto:${business.email}`} className="contact-link">{business.email || 'N/A'}</a>
                                        </div>
                                        <div className="business-info-item">
                                            <strong>Contact Number:</strong>
                                            {business.contactNumber || 'N/A'}
                                        </div>
                                        <div className="business-info-item">
                                            <strong>Website:</strong>
                                            {business.website ? (
                                                <a
                                                    href={business.website.startsWith('http://') || business.website.startsWith('https://') ? business.website : `https://${business.website}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="contact-link"
                                                >
                                                    {business.website}
                                                </a>
                                            ) : 'N/A'}
                                        </div>
                                    </div>
                                </div>

                                {/* Location Section */}
                                <div className="profile-section">
                                    <h3 className="section-title">Location</h3>
                                    <div className="business-info-grid">
                                        <div className="business-info-item">
                                            <strong>City:</strong>
                                            {business.city || 'N/A'}
                                        </div>
                                        <div className="business-info-item">
                                            <strong>State:</strong>
                                            {business.state || 'N/A'}
                                        </div>
                                        <div className="business-info-item full-width">
                                            <strong>Address:</strong>
                                            {business.address || 'N/A'}
                                        </div>
                                    </div>
                                </div>

                                {/* Description Section */}
                                <div className="profile-section">
                                    <h3 className="section-title">Business Description</h3>
                                    <div className="business-info-grid">
                                        <div className="business-info-item full-width description-text">
                                            {business.description || 'No description provided.'}
                                        </div>
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

export default BusinessDetail;

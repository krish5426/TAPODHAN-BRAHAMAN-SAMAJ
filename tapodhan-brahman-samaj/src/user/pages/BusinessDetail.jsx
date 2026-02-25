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
            <section className="my-profile-section" style={{ padding: '60px 0' }}>
                <div className="container">
                    <div className="user-profile-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                        <h1 className="user-profile-title" style={{ margin: 0 }}>Business Detail</h1>
                        <div className="profile-status">
                            <span className={`status-badge status-${business.status?.toLowerCase() || 'pending'}`} style={{ padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold' }}>
                                {business.status ? business.status.charAt(0).toUpperCase() + business.status.slice(1) : 'Pending'}
                            </span>
                        </div>
                    </div>

                    <div className="user-profile-card" style={{ display: 'flex', gap: '30px', background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 0 15px rgba(0,0,0,0.1)' }}>
                        <div className="user-profile-content" style={{ display: 'flex', width: '100%', gap: '30px', flexWrap: 'wrap' }}>
                            <div className="user-profile-sticky-section" style={{ flex: '1 1 300px', maxWidth: '300px' }}>
                                <div className="user-profile-image" style={{ marginBottom: '20px' }}>
                                    <img
                                        src={business.posterPhoto && business.posterPhoto !== "default_business.jpg" 
                                            ? `${API_ENDPOINTS.UPLOADS}/${business.posterPhoto}` 
                                            : defaultBusinessImage}
                                        alt={business.businessName}
                                        style={{ width: '100%', borderRadius: '8px', objectFit: 'cover' }}
                                        onError={(e) => { e.target.src = defaultBusinessImage; }}
                                    />
                                </div>
                                <h2 className="business-name" style={{ margin: '0 0 10px 0', fontSize: '24px' }}>
                                    {business.businessName}
                                </h2>
                                <span className="profile-id" style={{ color: '#666', fontSize: '14px' }}>
                                    Business ID: {business.id}
                                </span>
                            </div>

                            <div className="user-profile-details" style={{ flex: '1 1 500px' }}>
                                {/* General Information Section */}
                                <div className="profile-section" style={{ marginBottom: '30px' }}>
                                    <h3 className="section-title" style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', color: '#B9252F' }}>General Information</h3>
                                    <div className="business-info-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                                        <div className="business-info-item">
                                            <strong style={{ display: 'block', color: '#666', marginBottom: '5px' }}>Owner Name:</strong>
                                            {business.ownerName || 'N/A'}
                                        </div>
                                        <div className="business-info-item">
                                            <strong style={{ display: 'block', color: '#666', marginBottom: '5px' }}>Business Type:</strong>
                                            {business.businessType || 'N/A'}
                                        </div>
                                        <div className="business-info-item">
                                            <strong style={{ display: 'block', color: '#666', marginBottom: '5px' }}>Category:</strong>
                                            {business.category || 'N/A'}
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Information Section */}
                                <div className="profile-section" style={{ marginBottom: '30px' }}>
                                    <h3 className="section-title" style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', color: '#B9252F' }}>Contact Information</h3>
                                    <div className="business-info-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                                        <div className="business-info-item">
                                            <strong style={{ display: 'block', color: '#666', marginBottom: '5px' }}>Email:</strong>
                                            <a href={`mailto:${business.email}`} style={{ color: '#B9252F', textDecoration: 'none' }}>{business.email || 'N/A'}</a>
                                        </div>
                                        <div className="business-info-item">
                                            <strong style={{ display: 'block', color: '#666', marginBottom: '5px' }}>Contact Number:</strong>
                                            {business.contactNumber || 'N/A'}
                                        </div>
                                        <div className="business-info-item">
                                            <strong style={{ display: 'block', color: '#666', marginBottom: '5px' }}>Website:</strong>
                                            {business.website ? (
                                                <a 
                                                    href={business.website.startsWith('http://') || business.website.startsWith('https://') ? business.website : `https://${business.website}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    style={{ color: '#B9252F', textDecoration: 'none' }}
                                                >
                                                    {business.website}
                                                </a>
                                            ) : 'N/A'}
                                        </div>
                                    </div>
                                </div>

                                {/* Location Section */}
                                <div className="profile-section" style={{ marginBottom: '30px' }}>
                                    <h3 className="section-title" style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', color: '#B9252F' }}>Location</h3>
                                    <div className="business-info-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
                                        <div className="business-info-item">
                                            <strong style={{ display: 'block', color: '#666', marginBottom: '5px' }}>City:</strong>
                                            {business.city || 'N/A'}
                                        </div>
                                        <div className="business-info-item">
                                            <strong style={{ display: 'block', color: '#666', marginBottom: '5px' }}>State:</strong>
                                            {business.state || 'N/A'}
                                        </div>
                                        <div className="business-info-item" style={{ gridColumn: '1 / -1' }}>
                                            <strong style={{ display: 'block', color: '#666', marginBottom: '5px' }}>Address:</strong>
                                            {business.address || 'N/A'}
                                        </div>
                                    </div>
                                </div>

                                {/* Description Section */}
                                <div className="profile-section">
                                    <h3 className="section-title" style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px', color: '#B9252F' }}>Business Description</h3>
                                    <div className="business-info-grid">
                                        <div className="business-info-item full-width" style={{ lineHeight: '1.6' }}>
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

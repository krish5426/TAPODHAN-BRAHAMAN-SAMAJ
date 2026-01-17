import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import InnerBanner from '../components/InnerBanner';
import bannerImage from '../assets/images/contact-banner.jpg';
import { API_ENDPOINTS } from '../../config/api';

const MyBusiness = () => {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  const breadcrumb = [
    { label: 'Home', link: '/' },
    { label: 'My Business' }
  ];

  useEffect(() => {
    fetchMyBusiness();
  }, []);

  const fetchMyBusiness = async () => {
    try {
      const token = localStorage.getItem('user_token');
      console.log('Fetching business with token:', token ? 'Token exists' : 'No token');
      
      const response = await fetch(API_ENDPOINTS.MY_BUSINESS, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Business data:', data);
        setBusiness(data);
      } else {
        const errorData = await response.json();
        console.log('Error response:', errorData);
      }
    } catch (error) {
      console.error('Error fetching business:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <InnerBanner title="My Business" breadcrumb={breadcrumb} backgroundImage={bannerImage} />
        <div className="container" style={{padding: '100px 0', textAlign: 'center'}}>Loading...</div>
      </>
    );
  }

  if (!business) {
    return (
      <>
        <InnerBanner title="My Business" breadcrumb={breadcrumb} backgroundImage={bannerImage} />
        <div className="container" style={{padding: '100px 0', textAlign: 'center'}}>
          <h2>No Business Registered</h2>
          <p>You haven't registered a business yet.</p>
          <Link to="/business-register" className="business-hero-btn">Register Business</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <InnerBanner title="My Business" breadcrumb={breadcrumb} backgroundImage={bannerImage} />
      <section className="my-business-section">
        <div className="container">
          <div className="business-profile-header">
            <h1 className="business-profile-title">My Business Profile</h1>
            <Link to="/edit-business" className="business-profile-btn">Edit Business</Link>
          </div>
          
          <div className="business-profile-card">
            <div className="business-profile-content">
              <div className="business-profile-image">
                {business.posterPhoto && (
                  <img 
                    src={`${API_ENDPOINTS.UPLOADS}/${business.posterPhoto}`} 
                    alt={business.businessName}
                  />
                )}
              </div>
              <div className="business-profile-details">
                <h2 className="business-name">{business.businessName}</h2>
                <div className="business-info-grid">
                  <div className="business-info-item">
                    <strong>Owner:</strong> {business.ownerName}
                  </div>
                  <div className="business-info-item">
                    <strong>Email:</strong> {business.email}
                  </div>
                  <div className="business-info-item">
                    <strong>Contact:</strong> {business.contactNumber}
                  </div>
                  <div className="business-info-item">
                    <strong>Status:</strong> 
                    <span className={`status-badge status-${business.status}`}>
                      {business.status?.toUpperCase()}
                    </span>
                  </div>
                  {business.category && (
                    <div className="business-info-item">
                      <strong>Category:</strong> {business.category}
                    </div>
                  )}
                  {business.city && (
                    <div className="business-info-item">
                      <strong>City:</strong> {business.city}
                    </div>
                  )}
                </div>
                <div className="business-info-section">
                  <strong>Address:</strong>
                  <p>{business.address}</p>
                </div>
                {business.description && (
                  <div className="business-info-section">
                    <strong>Description:</strong>
                    <p>{business.description}</p>
                  </div>
                )}
                {business.website && (
                  <div className="business-info-section">
                    <strong>Website:</strong>
                    <a href={business.website} target="_blank" rel="noopener noreferrer">
                      {business.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default MyBusiness;
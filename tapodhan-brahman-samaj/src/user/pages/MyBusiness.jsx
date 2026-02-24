import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InnerBanner from '../components/InnerBanner';
import bannerImage from '../assets/images/contact-banner.jpg';
import defaultBusinessImage from '../assets/images/default-business.png';
import { API_ENDPOINTS } from '../../config/api';


function MyBusiness() {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const businessesPerPage = 8;

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
        setBusinesses(Array.isArray(data) ? data : (data ? [data] : []));
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error:', response.status, errorData);
      }
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastBusiness = currentPage * businessesPerPage;
  const indexOfFirstBusiness = indexOfLastBusiness - businessesPerPage;
  const currentBusinesses = businesses.slice(indexOfFirstBusiness, indexOfLastBusiness);
  const totalPages = Math.ceil(businesses.length / businessesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <>
        <InnerBanner title="My Business" breadcrumb={breadcrumb} backgroundImage={bannerImage} />

        <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>Loading...</div>
      </>
    );
  }

  if (!business) {
    return (
      <>
        <InnerBanner title="My Business" breadcrumb={breadcrumb} backgroundImage={bannerImage} />
        <div className="no-business-container">
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

      <section className="list-section" style={{ display: businesses.length > 0 ? 'block' : 'none' }}>
        <div className="container">

          <div className="business-profile-header">
            <h1 className="business-profile-title">My Business Profile</h1>
            <Link to="/edit-business" className="business-profile-btn">Edit Business</Link>
          </div>

          <div className="business-profile-card">
            <div className="business-profile-content">
              <div className="business-profile-image">
                <img
                  src={business.posterPhoto && business.posterPhoto !== "default_business.jpg"
                    ? `${API_ENDPOINTS.UPLOADS}/${business.posterPhoto}`
                    : defaultBusinessImage}
                  alt={business.businessName}
                  onError={(e) => { e.target.src = defaultBusinessImage; }}
                />
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

      <section className="profile-section">
        <div className="container">
          {businesses.length === 0 ? (
            <div className="no-profiles-state">
              <h2>No Business Registered</h2>
              <p>You haven't registered a business yet.</p>
              <button
                className="user-profile-btn"
                onClick={() => navigate('/business-register')}
              >
                Register Your First Business
              </button>
            </div>
          ) : (
            <>
              <div className="profile-grid">
                {currentBusinesses.map((business) => (
                  <div key={business.id} className="profile-card">
                    <div className="profile-img">
                      <img
                        src={business.posterPhoto && business.posterPhoto !== "default_business.jpg"
                          ? `${API_ENDPOINTS.UPLOADS}/${business.posterPhoto}`
                          : defaultBusinessImage}
                        alt={business.businessName}
                        onError={(e) => { e.target.src = defaultBusinessImage; }}
                      />
                      <div className={`status-badge ${business.status?.toLowerCase() || 'pending'}`}>
                        {business.status ? business.status.charAt(0).toUpperCase() + business.status.slice(1) : 'Pending'}
                      </div>
                    </div>
                    <div className="profile-content">
                      <span className="profile-id">
                        Business ID: {business.id}
                      </span>
                      <h4 className="profile-name">{business.businessName}</h4>
                      <p className="profile-info">
                        Owner: {business.ownerName}
                      </p>
                      <p className="profile-info">
                        City: {business.city || 'N/A'}
                      </p>
                      <p className="profile-info">
                        Category: {business.category || 'N/A'}
                      </p>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                        <Link to={`/business-detail/${business.id}`} className="business-profile-btn" style={{ fontSize: '13px', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none' }}>
                          <VisibilityIcon fontSize="small" /> View
                        </Link>
                        <Link to={`/edit-business/${business.id}`} className="business-profile-btn" style={{ fontSize: '13px', padding: '4px 8px', display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none' }}>
                          <EditIcon fontSize="small" /> Edit
                        </Link>
                      </div>
                    </div>
                  </div>
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

export default MyBusiness;
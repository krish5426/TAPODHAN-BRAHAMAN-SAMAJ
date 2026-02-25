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

  if (businesses.length === 0) {
    return (
      <>
        <InnerBanner title="My Business" breadcrumb={breadcrumb} backgroundImage={bannerImage} />
        <div className="no-business-container" style={{ textAlign: 'center', padding: '100px 0' }}>
          <h2>No Business Registered</h2>
          <p style={{ margin: '20px 0' }}>You haven't registered a business yet.</p>
          <Link to="/business-register" className="business-profile-btn" style={{ display: 'inline-block', textDecoration: 'none' }}>Register Business</Link>
        </div>
      </>
    );
  }

  return (
    <>
      <InnerBanner title="My Business" breadcrumb={breadcrumb} backgroundImage={bannerImage} />

      <section className="list-section" style={{ display: businesses.length > 0 ? 'block' : 'none' }}>
        <div className="container">
          <div className="header-section">
            <span className="header-label">My Businesses</span>
            <h2 className="header-title-center">
              <strong>
                <span>Your </span>
                registered businesses
              </strong>
            </h2>
            <div className="create-profile-section">
              <button
                className="user-profile-btn"
                onClick={() => navigate('/business-register')}
              >
                Register New Business
              </button>
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
                  <div key={business.id} style={{ position: 'relative' }}>
                    <Link to={`/business-detail/${business.id}`} className="profile-card-link" style={{ display: 'block' }}>
                      <div className="profile-card" style={{ height: '100%' }}>
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
                            Business ID: B-{business.id}
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
                        </div>
                      </div>
                    </Link>
                    {/* Floating Edit Button Overlay */}
                    <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 10 }}>
                        <Link to={`/edit-business/${business.id}`} onClick={(e) => e.stopPropagation()} style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '6px', borderRadius: '50%', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: '0.3s' }} className="edit-icon-hover">
                          <EditIcon fontSize="small" />
                        </Link>
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
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
      console.log('Token:', token ? 'Found' : 'Not found');

      if (!token) {
        setLoading(false);
        return;
      }

      const url = API_ENDPOINTS.MY_BUSINESS;
      console.log('Fetching from:', url);

      const response = await fetch(url, {
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
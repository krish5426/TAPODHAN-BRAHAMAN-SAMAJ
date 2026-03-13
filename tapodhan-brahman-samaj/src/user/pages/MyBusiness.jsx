import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ViewListIcon from '@mui/icons-material/ViewList';
import GridViewIcon from '@mui/icons-material/GridView';
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
  const [viewMode, setViewMode] = useState('grid');

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

      <section className="my-profile-section">
        <div className="container">
          <div className="header-section" style={{ textAlign: 'left' }}>
            <span className="header-label header-label-left">My Businesses</span>
            <h2 className="header-title" style={{ textAlign: 'left', marginBottom: '30px' }}>
              <strong>
                <span>Your </span>
                registered businesses
              </strong>
            </h2>
            <div className="create-profile-section" style={{ textAlign: 'left', margin: '20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                className="user-profile-btn"
                onClick={() => navigate('/business-register')}
              >
                Register New Business
              </button>
              <div style={{ display: 'flex', gap: '5px' }}>
                <button 
                  onClick={() => setViewMode('list')}
                  title="List View"
                  style={{ padding: '8px', background: viewMode === 'list' ? '#c1272d' : '#f0f0f0', color: viewMode === 'list' ? '#fff' : '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <ViewListIcon />
                </button>
                <button 
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                  style={{ padding: '8px', background: viewMode === 'grid' ? '#c1272d' : '#f0f0f0', color: viewMode === 'grid' ? '#fff' : '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <GridViewIcon />
                </button>
              </div>
            </div>
          </div>

          {/* Profile Grid Area */}
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
              {viewMode === 'list' ? (
                <div className="directory-table-wrapper">
                  <table className="directory-table">
                    <thead>
                      <tr>
                        <th>No.</th>
                        <th>Business Name</th>
                        <th>Owner Name</th>
                        <th>Industry</th>
                        <th>City</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentBusinesses.map((business, index) => (
                        <tr key={business.id} className={index % 2 !== 0 ? "creative" : ""}>
                          <td>{indexOfFirstBusiness + index + 1}</td>
                          <td>{business.businessName}</td>
                          <td>{business.ownerName}</td>
                          <td>{business.category || "-"}</td>
                          <td>{business.city || "-"}</td>
                          <td>
                            <span className={`status-badge status-${business.status?.toLowerCase() || 'pending'}`}>
                              {business.status ? business.status.charAt(0).toUpperCase() + business.status.slice(1) : 'Pending'}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <Link
                                to={`/business-detail/${business.id}`}
                                className="business-profile-btn"
                                style={{ padding: "6px 12px", fontSize: "12px", textDecoration: 'none', border: 'none' }}
                              >
                                View
                              </Link>
                              <Link
                                to={`/edit-business/${business.id}`}
                                className="business-profile-btn"
                                style={{ padding: "6px 12px", fontSize: "12px", textDecoration: 'none', background: '#f5f5f5', color: '#333', border: '1px solid #ddd' }}
                              >
                                Edit
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
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
                            Industry: {business.category || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </Link>
                    {/* Floating Edit Button Overlay */}
                    <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 0 }}>
                      <Link
                        to={`/edit-business/${business.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="floating-edit-btn"
                      >
                        <EditIcon fontSize="small" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              )}

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
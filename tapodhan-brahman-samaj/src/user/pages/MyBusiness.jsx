import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { API_ENDPOINTS } from '../../config/api';

const MyBusiness = () => {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

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
    return <div className="container" style={{padding: '100px 0', textAlign: 'center'}}>Loading...</div>;
  }

  if (!business) {
    return (
      <div className="container" style={{padding: '100px 0', textAlign: 'center'}}>
        <h2>No Business Registered</h2>
        <p>You haven't registered a business yet.</p>
        <Link to="/business-register" className="business-hero-btn">Register Business</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{padding: '100px 0'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
        <h1>My Business Profile</h1>
        <Link to="/edit-business" className="business-hero-btn">Edit Business</Link>
      </div>
      
      <div className="business-profile-card" style={{background: '#fff', padding: '30px', border: '1px solid #ddd', overflow: 'hidden'}}>
        <div style={{display: 'flex', gap: '30px', flexWrap: 'wrap'}}>
          <div style={{flex: '0 0 200px', minWidth: '200px'}}>
            {business.posterPhoto && (
              <img 
                src={`${API_ENDPOINTS.UPLOADS}/${business.posterPhoto}`} 
                alt={business.businessName}
                style={{width: '100%', height: '200px', objectFit: 'cover', border: '1px solid #ddd'}}
              />
            )}
          </div>
          <div style={{flex: '1', minWidth: '300px', overflow: 'hidden'}}>
            <h2 style={{color: '#b9252f', marginBottom: '20px', wordWrap: 'break-word'}}>{business.businessName}</h2>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px'}}>
              <div style={{wordWrap: 'break-word'}}>
                <strong>Owner:</strong> {business.ownerName}
              </div>
              <div style={{wordWrap: 'break-word'}}>
                <strong>Email:</strong> {business.email}
              </div>
              <div style={{wordWrap: 'break-word'}}>
                <strong>Contact:</strong> {business.contactNumber}
              </div>
              <div>
                <strong>Status:</strong> 
                <span style={{
                  color: business.status === 'approved' ? 'green' : business.status === 'rejected' ? 'red' : 'orange',
                  fontWeight: 'bold',
                  marginLeft: '5px'
                }}>
                  {business.status?.toUpperCase()}
                </span>
              </div>
              {business.category && (
                <div style={{wordWrap: 'break-word'}}>
                  <strong>Category:</strong> {business.category}
                </div>
              )}
              {business.city && (
                <div style={{wordWrap: 'break-word'}}>
                  <strong>City:</strong> {business.city}
                </div>
              )}
            </div>
            <div style={{marginTop: '20px', wordWrap: 'break-word'}}>
              <strong>Address:</strong>
              <p style={{margin: '5px 0'}}>{business.address}</p>
            </div>
            {business.description && (
              <div style={{marginTop: '20px', wordWrap: 'break-word'}}>
                <strong>Description:</strong>
                <p style={{margin: '5px 0'}}>{business.description}</p>
              </div>
            )}
            {business.website && (
              <div style={{marginTop: '20px', wordWrap: 'break-word'}}>
                <strong>Website:</strong>
                <a href={business.website} target="_blank" rel="noopener noreferrer" style={{color: '#b9252f', marginLeft: '5px', wordBreak: 'break-all'}}>
                  {business.website}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBusiness;
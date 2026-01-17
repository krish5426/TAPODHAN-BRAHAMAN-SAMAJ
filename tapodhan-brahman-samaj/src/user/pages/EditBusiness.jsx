import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL, { API_ENDPOINTS } from '../../config/api';

const EditBusiness = () => {
  const [business, setBusiness] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [posterPhoto, setPosterPhoto] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBusiness();
  }, []);

  const fetchBusiness = async () => {
    try {
      const token = localStorage.getItem('user_token');
      const response = await fetch(API_ENDPOINTS.MY_BUSINESS, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBusiness(data);
        setFormData(data);
      } else {
        navigate('/my-business');
      }
    } catch (error) {
      console.error('Error fetching business:', error);
      navigate('/my-business');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setPosterPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('user_token');
      const formDataToSend = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (formData[key] && key !== 'id' && key !== 'userId' && key !== 'createdAt' && key !== 'updatedAt') {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add poster photo if selected
      if (posterPhoto) {
        formDataToSend.append('posterPhoto', posterPhoto);
      }

      const response = await fetch(`${API_ENDPOINTS.ADMIN_BUSINESS}/${business.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        alert('Business updated successfully!');
        navigate('/my-business');
      } else {
        const errorData = await response.json();
        alert('Error updating business: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error updating business:', error);
      alert('Error updating business');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="container" style={{padding: '100px 0', textAlign: 'center'}}>Loading...</div>;
  }

  return (
    <div className="container" style={{padding: '100px 0'}}>
      <h1 style={{marginBottom: '30px'}}>Edit Business</h1>
      
      <form onSubmit={handleSubmit} style={{maxWidth: '800px'}}>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '20px'}}>
          <div>
            <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Business Name *</label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName || ''}
              onChange={handleInputChange}
              required
              style={{width: '100%', padding: '10px', border: '1px solid #ddd', boxSizing: 'border-box'}}
            />
          </div>
          <div>
            <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Owner Name *</label>
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName || ''}
              onChange={handleInputChange}
              required
              style={{width: '100%', padding: '10px', border: '1px solid #ddd', boxSizing: 'border-box'}}
            />
          </div>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '20px'}}>
          <div>
            <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleInputChange}
              required
              disabled
              style={{width: '100%', padding: '10px', border: '1px solid #ddd', backgroundColor: '#f5f5f5', color: '#666', boxSizing: 'border-box'}}
            />
          </div>
          <div>
            <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Contact Number *</label>
            <input
              type="tel"
              name="contactNumber"
              value={formData.contactNumber || ''}
              onChange={handleInputChange}
              required
              style={{width: '100%', padding: '10px', border: '1px solid #ddd', boxSizing: 'border-box'}}
            />
          </div>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '20px'}}>
          <div>
            <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Category</label>
            <select
              name="category"
              value={formData.category || ''}
              onChange={handleInputChange}
              style={{width: '100%', padding: '10px', border: '1px solid #ddd', boxSizing: 'border-box'}}
            >
              <option value="">Select Category</option>
              <option value="Restaurant">Restaurant</option>
              <option value="Retail">Retail</option>
              <option value="Services">Services</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Technology">Technology</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Construction">Construction</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Finance">Finance</option>
              <option value="Food & Beverage">Food & Beverage</option>
              <option value="Automotive">Automotive</option>
              <option value="Beauty & Wellness">Beauty & Wellness</option>
              <option value="Travel & Tourism">Travel & Tourism</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Agriculture">Agriculture</option>
              <option value="Textile">Textile</option>
              <option value="Jewelry">Jewelry</option>
              <option value="Electronics">Electronics</option>
              <option value="Other">Other</option>
              {formData.category && !['', 'Restaurant', 'Retail', 'Services', 'Healthcare', 'Education', 'Technology', 'Manufacturing', 'Construction', 'Real Estate', 'Finance', 'Food & Beverage', 'Automotive', 'Beauty & Wellness', 'Travel & Tourism', 'Entertainment', 'Agriculture', 'Textile', 'Jewelry', 'Electronics', 'Other'].includes(formData.category) && (
                <option value={formData.category}>{formData.category}</option>
              )}
            </select>
          </div>
          <div>
            <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Business Type</label>
            <input
              type="text"
              name="businessType"
              value={formData.businessType || ''}
              onChange={handleInputChange}
              style={{width: '100%', padding: '10px', border: '1px solid #ddd', boxSizing: 'border-box'}}
            />
          </div>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '20px'}}>
          <div>
            <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>City</label>
            <input
              type="text"
              name="city"
              value={formData.city || ''}
              onChange={handleInputChange}
              style={{width: '100%', padding: '10px', border: '1px solid #ddd', boxSizing: 'border-box'}}
            />
          </div>
          <div>
            <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>State</label>
            <input
              type="text"
              name="state"
              value={formData.state || ''}
              onChange={handleInputChange}
              style={{width: '100%', padding: '10px', border: '1px solid #ddd', boxSizing: 'border-box'}}
            />
          </div>
        </div>

        <div style={{marginBottom: '20px'}}>
          <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Website</label>
          <input
            type="url"
            name="website"
            value={formData.website || ''}
            onChange={handleInputChange}
            style={{width: '100%', padding: '10px', border: '1px solid #ddd'}}
          />
        </div>

        <div style={{marginBottom: '20px'}}>
          <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Address *</label>
          <textarea
            name="address"
            value={formData.address || ''}
            onChange={handleInputChange}
            required
            rows="3"
            style={{width: '100%', padding: '10px', border: '1px solid #ddd'}}
          />
        </div>

        <div style={{marginBottom: '20px'}}>
          <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Description</label>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleInputChange}
            rows="4"
            style={{width: '100%', padding: '10px', border: '1px solid #ddd'}}
          />
        </div>

        <div style={{marginBottom: '30px'}}>
          <label style={{display: 'block', marginBottom: '5px', fontWeight: 'bold'}}>Poster Photo</label>
          {business?.posterPhoto && (
            <div style={{marginBottom: '10px'}}>
              <img 
                src={`${API_ENDPOINTS.UPLOADS}/${business.posterPhoto}`}
                alt="Current poster"
                style={{width: '150px', height: '100px', objectFit: 'cover', border: '1px solid #ddd'}}
              />
              <p style={{fontSize: '12px', color: '#666', margin: '5px 0'}}>Current poster photo</p>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{width: '100%', padding: '10px', border: '1px solid #ddd'}}
          />
        </div>

        <div style={{display: 'flex', gap: '15px'}}>
          <button
            type="submit"
            disabled={saving}
            className="business-hero-btn"
            style={{padding: '12px 30px'}}
          >
            {saving ? 'Updating...' : 'Update Business'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/my-business')}
            style={{
              padding: '12px 30px',
              background: '#666',
              color: '#fff',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBusiness;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InnerBanner from '../components/InnerBanner';
import CustomDialog from '../components/CustomDialog';
import bannerImage from '../assets/images/contact-banner.jpg';
import API_BASE_URL, { API_ENDPOINTS } from '../../config/api';

const EditBusiness = () => {
  const [business, setBusiness] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [posterPhoto, setPosterPhoto] = useState(null);
  const [dialog, setDialog] = useState({ isOpen: false, message: '', type: 'success' });
  const navigate = useNavigate();

  const breadcrumb = [
    { label: 'Home', link: '/' },
    { label: 'My Business', link: '/my-business' },
    { label: 'Edit Business' }
  ];

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
        setDialog({ isOpen: true, message: 'Business updated successfully!', type: 'success' });
      } else {
        const errorData = await response.json();
        setDialog({ isOpen: true, message: 'Error updating business: ' + errorData.message, type: 'error' });
      }
    } catch (error) {
      console.error('Error updating business:', error);
      setDialog({ isOpen: true, message: 'Error updating business', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <InnerBanner title="Edit Business" breadcrumb={breadcrumb} backgroundImage={bannerImage} />
        <div className="container eb-loading">Loading...</div>
      </>
    );
  }

  return (
    <>
      <InnerBanner title="Edit Business" breadcrumb={breadcrumb} backgroundImage={bannerImage} />
      <section className="my-profile-section">
        <div className="container">
          <div className="user-profile-header">
            <h1 className="user-profile-title">Edit Business</h1>
          </div>

          <div className="user-profile-card">
            <form onSubmit={handleSubmit} className="eb-form">

              {/* Business Identity */}
              <div className="eb-section">
                <h3 className="eb-section-title">Business Information</h3>
                <div className="eb-form-grid">
                  <div className="eb-field">
                    <label className="eb-label">Business Name <span className="eb-required">*</span></label>
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName || ''}
                      onChange={handleInputChange}
                      required
                      className="eb-input"
                      placeholder="Enter business name"
                    />
                  </div>
                  <div className="eb-field">
                    <label className="eb-label">Owner Name <span className="eb-required">*</span></label>
                    <input
                      type="text"
                      name="ownerName"
                      value={formData.ownerName || ''}
                      onChange={handleInputChange}
                      required
                      className="eb-input"
                      placeholder="Enter owner name"
                    />
                  </div>
                  <div className="eb-field">
                    <label className="eb-label">Category</label>
                    <select
                      name="category"
                      value={formData.category || ''}
                      onChange={handleInputChange}
                      className="eb-input eb-select"
                    >
                      <option value="">Select Category</option>
                      <option value="Restaurant">Restaurant</option>
                      <option value="Shop">Shop</option>
                      <option value="Service">Service</option>
                      <option value="Freelancer">Freelancer</option>
                      <option value="Education">Education</option>
                      <option value="Consultancy">Consultancy</option>
                      <option value="Medical & Health">Medical &amp; Health</option>
                      <option value="Trading">Trading</option>
                      <option value="Professional Services">Professional Services</option>
                      <option value="Karm Kand">Karm Kand</option>
                      <option value="Transport / Travel">Transport / Travel</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="eb-field">
                    <label className="eb-label">Business Type</label>
                    <input
                      type="text"
                      name="businessType"
                      value={formData.businessType || ''}
                      onChange={handleInputChange}
                      className="eb-input"
                      placeholder="e.g. Pvt. Ltd., Sole Proprietor"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="eb-section">
                <h3 className="eb-section-title">Contact Details</h3>
                <div className="eb-form-grid">
                  <div className="eb-field">
                    <label className="eb-label">Email <span className="eb-required">*</span></label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ''}
                      onChange={handleInputChange}
                      required
                      disabled
                      className="eb-input eb-input-disabled"
                    />
                  </div>
                  <div className="eb-field">
                    <label className="eb-label">Contact Number <span className="eb-required">*</span></label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber || ''}
                      onChange={handleInputChange}
                      required
                      className="eb-input"
                      placeholder="Enter contact number"
                    />
                  </div>
                  <div className="eb-field">
                    <label className="eb-label">Website</label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website || ''}
                      onChange={handleInputChange}
                      className="eb-input"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="eb-section">
                <h3 className="eb-section-title">Location</h3>
                <div className="eb-form-grid">
                  <div className="eb-field">
                    <label className="eb-label">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city || ''}
                      onChange={handleInputChange}
                      className="eb-input"
                      placeholder="Enter city"
                    />
                  </div>
                  <div className="eb-field">
                    <label className="eb-label">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state || ''}
                      onChange={handleInputChange}
                      className="eb-input"
                      placeholder="Enter state"
                    />
                  </div>
                  <div className="eb-field eb-field-full">
                    <label className="eb-label">Address <span className="eb-required">*</span></label>
                    <textarea
                      name="address"
                      value={formData.address || ''}
                      onChange={handleInputChange}
                      required
                      rows="3"
                      className="eb-input eb-textarea"
                      placeholder="Enter full address"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="eb-section">
                <h3 className="eb-section-title">About the Business</h3>
                <div className="eb-field">
                  <label className="eb-label">Description</label>
                  <textarea
                    name="description"
                    value={formData.description || ''}
                    onChange={handleInputChange}
                    rows="5"
                    className="eb-input eb-textarea"
                    placeholder="Describe your business..."
                  />
                </div>
              </div>

              {/* Poster Photo */}
              <div className="eb-section">
                <h3 className="eb-section-title">Poster Photo</h3>
                {business?.posterPhoto && (
                  <div className="eb-current-photo">
                    <img
                      src={`${API_ENDPOINTS.UPLOADS}/${business.posterPhoto}`}
                      alt="Current poster"
                      className="eb-preview-img"
                    />
                    <p className="eb-photo-hint">Current poster photo</p>
                  </div>
                )}
                <div className="eb-file-wrap">
                  <input
                    type="file"
                    id="posterPhoto"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="eb-file-input"
                  />
                  <label htmlFor="posterPhoto" className="user-profile-btn eb-file-btn">
                    Choose File
                  </label>
                  {posterPhoto && <span className="eb-file-name">{posterPhoto.name}</span>}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="eb-actions">
                <button
                  type="submit"
                  disabled={saving}
                  className="user-profile-btn"
                >
                  {saving ? 'Updating...' : 'Update Business'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/my-business')}
                  className="user-profile-btn eb-cancel-btn"
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      </section>
      <CustomDialog
        isOpen={dialog.isOpen}
        message={dialog.message}
        type={dialog.type}
        onClose={() => {
          setDialog({ isOpen: false, message: '', type: 'success' });
          if (dialog.type === 'success') {
            navigate('/my-business');
          }
        }}
      />
    </>
  );
};

export default EditBusiness;
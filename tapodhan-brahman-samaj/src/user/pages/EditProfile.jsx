import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InnerBanner from '../components/InnerBanner';
import bannerImage from '../assets/images/contact-banner.jpg';
import { API_ENDPOINTS } from '../../config/api';

function EditProfile() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        mobile: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const breadcrumb = [
        { label: 'Home', link: '/' },
        { label: 'Profile', link: '/profile' },
        { label: 'Edit Profile' }
    ];

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem('user_token');
            const response = await fetch(`${API_ENDPOINTS.PROFILE}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setFormData({
                    firstName: data.firstName || '',
                    lastName: data.lastName || '',
                    mobile: data.mobile || ''
                });
            }
        } catch (error) {
            console.error('Profile fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const token = localStorage.getItem('user_token');
            const response = await fetch(`${API_ENDPOINTS.PROFILE}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Profile updated successfully!');
                navigate('/profile');
            } else {
                const error = await response.json();
                alert(error.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Update error:', error);
            alert('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <>
                <InnerBanner title="Edit Profile" breadcrumb={breadcrumb} backgroundImage={bannerImage} />
                <section className="my-profile-section">
                    <div className="container">
                        <h2>Loading...</h2>
                    </div>
                </section>
            </>
        );
    }

    return (
        <>
            <InnerBanner title="Edit Profile" breadcrumb={breadcrumb} backgroundImage={bannerImage} />
            <section className="my-profile-section">
                <div className="container">
                    <div className="user-profile-header">
                        <h1 className="user-profile-title">Edit Profile</h1>
                    </div>
                    
                    <div className="user-profile-card">
                        <form onSubmit={handleSubmit} style={{ padding: '40px', fontFamily: '"Barlow Condensed", sans-serif' }}>
                            <div style={{ marginBottom: '25px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>First Name *</label>
                                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box' }} />
                            </div>

                            <div style={{ marginBottom: '25px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>Last Name *</label>
                                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box' }} />
                            </div>

                            <div style={{ marginBottom: '25px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>Mobile Number *</label>
                                <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} required style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box' }} />
                            </div>

                            <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                                <button type="button" onClick={() => navigate('/profile')} className="user-profile-btn" style={{ background: 'transparent', color: '#b9252f', border: '2px solid #b9252f' }}>Cancel</button>
                                <button type="submit" disabled={saving} className="user-profile-btn">{saving ? 'Saving...' : 'Save Changes'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
}

export default EditProfile;

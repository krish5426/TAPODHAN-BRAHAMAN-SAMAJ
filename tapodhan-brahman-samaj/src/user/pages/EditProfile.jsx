import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
            <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
                <h2>Loading...</h2>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '100px 20px' }}>
            <div style={{ 
                maxWidth: '600px', 
                margin: '0 auto', 
                background: '#fff', 
                borderRadius: '12px', 
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                overflow: 'hidden'
            }}>
                <div style={{ 
                    background: 'linear-gradient(135deg, #b9252f 0%, #6a2c2d 100%)', 
                    color: 'white', 
                    padding: '30px',
                    textAlign: 'center'
                }}>
                    <h1 style={{ margin: '0 0 10px 0', fontSize: '32px', fontWeight: '600' }}>
                        Edit Profile
                    </h1>
                    <p style={{ margin: 0, opacity: 0.9 }}>Update your information</p>
                </div>

                <form onSubmit={handleSubmit} style={{ padding: '40px' }}>
                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ 
                            display: 'block', 
                            fontSize: '14px', 
                            fontWeight: '600', 
                            color: '#333', 
                            marginBottom: '8px'
                        }}>
                            First Name *
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '2px solid #e0e0e0',
                                borderRadius: '8px',
                                fontSize: '16px',
                                boxSizing: 'border-box',
                                transition: 'border-color 0.3s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#b9252f'}
                            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                        />
                    </div>

                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ 
                            display: 'block', 
                            fontSize: '14px', 
                            fontWeight: '600', 
                            color: '#333', 
                            marginBottom: '8px'
                        }}>
                            Last Name *
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '2px solid #e0e0e0',
                                borderRadius: '8px',
                                fontSize: '16px',
                                boxSizing: 'border-box',
                                transition: 'border-color 0.3s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#b9252f'}
                            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                        />
                    </div>

                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ 
                            display: 'block', 
                            fontSize: '14px', 
                            fontWeight: '600', 
                            color: '#333', 
                            marginBottom: '8px'
                        }}>
                            Mobile Number *
                        </label>
                        <input
                            type="tel"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            required
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '2px solid #e0e0e0',
                                borderRadius: '8px',
                                fontSize: '16px',
                                boxSizing: 'border-box',
                                transition: 'border-color 0.3s ease'
                            }}
                            onFocus={(e) => e.target.style.borderColor = '#b9252f'}
                            onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                        <button
                            type="button"
                            onClick={() => navigate('/profile')}
                            style={{
                                flex: 1,
                                padding: '15px',
                                border: '2px solid #b9252f',
                                background: 'transparent',
                                color: '#b9252f',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.background = '#f8f9fa';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.background = 'transparent';
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            style={{
                                flex: 1,
                                padding: '15px',
                                border: 'none',
                                background: 'linear-gradient(135deg, #b9252f 0%, #6a2c2d 100%)',
                                color: 'white',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: saving ? 'not-allowed' : 'pointer',
                                opacity: saving ? 0.7 : 1,
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditProfile;
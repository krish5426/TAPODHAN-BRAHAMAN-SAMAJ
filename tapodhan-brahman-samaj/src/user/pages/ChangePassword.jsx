import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InnerBanner from '../components/InnerBanner';
import CustomDialog from '../components/CustomDialog';
import bannerImage from '../assets/images/contact-banner.jpg';
import { API_ENDPOINTS } from '../../config/api';

function ChangePassword() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [saving, setSaving] = useState(false);
    const [dialog, setDialog] = useState({ isOpen: false, message: '', type: 'success' });
    const [error, setError] = useState('');

    const breadcrumb = [
        { label: 'Home', link: '/' },
        { label: 'Profile', link: '/profile' },
        { label: 'Change Password' }
    ];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (formData.newPassword !== formData.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        setSaving(true);

        try {
            const token = localStorage.getItem('user_token');
            const response = await fetch(`${API_ENDPOINTS.CHANGE_PASSWORD}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                setDialog({ isOpen: true, message: 'Password changed successfully!', type: 'success' });
            } else {
                setError(data.message || 'Failed to change password');
            }
        } catch (error) {
            console.error('Password change error:', error);
            setError('Failed to change password');
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <InnerBanner title="Change Password" breadcrumb={breadcrumb} backgroundImage={bannerImage} />
            <section className="my-profile-section">
                <div className="container">
                    <div className="user-profile-header">
                        <h1 className="user-profile-title">Change Password</h1>
                    </div>
                    
                    <div className="user-profile-card">
                        <form onSubmit={handleSubmit} style={{ padding: '40px', fontFamily: '"Inter Tight", sans-serif' }}>
                            <div style={{ marginBottom: '25px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>Current Password *</label>
                                <input type="password" name="currentPassword" placeholder="Enter Current Password" value={formData.currentPassword} onChange={handleChange} required style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box' }} />
                            </div>

                            <div style={{ marginBottom: '25px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>New Password *</label>
                                <input type="password" name="newPassword" placeholder="Enter New Password" value={formData.newPassword} onChange={handleChange} required style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box' }} />
                            </div>

                            <div style={{ marginBottom: '25px' }}>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '8px' }}>Confirm New Password *</label>
                                <input type="password" name="confirmPassword" placeholder="Confirm New Password" value={formData.confirmPassword} onChange={handleChange} required style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px', fontSize: '16px', boxSizing: 'border-box' }} />
                            </div>

                            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

                            <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                                <button type="button" onClick={() => navigate('/profile')} className="user-profile-btn" style={{ background: 'transparent', color: '#b9252f', border: '2px solid #b9252f' }}>Cancel</button>
                                <button type="submit" disabled={saving} className="user-profile-btn">{saving ? 'Saving...' : 'Change Password'}</button>
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
                        navigate('/profile');
                    }
                }}
            />
        </>
    );
}

export default ChangePassword;

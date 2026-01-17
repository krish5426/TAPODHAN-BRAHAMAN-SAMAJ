import React, { useState } from 'react';
import mail from "../assets/images/mailid.png";
import phone from "../assets/images/phonee.png";
import location from "../assets/images/location.png";
import { API_ENDPOINTS } from '../../config/api';

const Contactform = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(API_ENDPOINTS.CONTACT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        // Handle non-JSON error responses
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to send message');
        } else {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
      }

      const data = await response.json();
      setSuccess('Message sent successfully!');
      setFormData({ fullName: '', email: '', phone: '', message: '' });
    } catch (err) {
      console.error('Contact form error:', err);
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="contact-section">
      <div className="container">
        <div className="contact-content">
          <div className="contact-left">
            <div className="header-section">
              <span className="header-label">CONTACT US</span>
              <h2 className="header-title">
                <strong><span>LET'S STAY</span> CONNECTED <span>FOR A </span>
                  STRONGER COMMUNITY</strong>
              </h2>
            </div>
           

            <div className="contact-info-box">
              <div className="info-row">
                <img src={phone} alt="Phone" className="info-icon" />
                <div>
                  <h4>Phone Number</h4>
                  <p>9662377530 <br/> 9825906646</p>
                </div>
              </div>

              <div className="info-row">
                <img src={mail} alt="Email" className="info-icon" />
                <div>
                  <h4>Email Address</h4>
                  <p>ravalkb1@gmail.com <br/> maneeshdave79@gmail.com</p>
                </div>
              </div>

              <div className="info-row">
                <img src={location} alt="Location" className="info-icon" />
                <div>
                  <h4>Visit Our Office</h4>
                  <p>Lorem ipsum dolor sit amet, consectetur elit.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-right">
            <form className="contact-form" onSubmit={handleSubmit}>
              <label>FULL NAME</label>
              <input 
                type="text" 
                name="fullName"
                placeholder="Enter your full name" 
                value={formData.fullName}
                onChange={handleChange}
                required 
              />

              <div className="two-inputs">
                <div>
                  <label>EMAIL</label>
                  <input 
                    type="email" 
                    name="email"
                    placeholder="you@example.com" 
                    value={formData.email}
                    onChange={handleChange}
                    required 
                  />
                </div>

                <div>
                  <label>PHONE NUMBER</label>
                  <input 
                    type="text" 
                    name="phone"
                    placeholder="+91 XXXXXXXX" 
                    value={formData.phone}
                    onChange={handleChange}
                    required 
                  />
                </div>
              </div>

              <label>SEND US MESSAGE</label>
              <textarea 
                name="message"
                placeholder="Enter your message" 
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>

              {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
              {success && <p style={{ color: 'green', marginTop: '10px' }}>{success}</p>}

              <button type="submit" disabled={loading}>
                {loading ? 'SENDING...' : 'SEND MESSAGE'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contactform;

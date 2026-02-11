import React, { useState, useEffect } from 'react';
import InnerBanner from '../components/InnerBanner';
import AnnouncementHeader from '../components/AnnouncementHeader';
import bannerImage from '../assets/images/announcement-banner.jpg';
import announcement1 from '../assets/images/announcement1.jpeg';
import announcement2 from '../assets/images/announcement2.jpeg';
import { API_ENDPOINTS } from '../../config/api';
import '../css/style.css';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  const breadcrumb = [
    { label: 'Home', link: '/' },
    { label: 'Announcements' }
  ];

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(`${API_ENDPOINTS.ANNOUNCEMENTS || API_ENDPOINTS.EVENTS}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setAnnouncements(data);
      } else {
        console.error('Expected array of announcements, got:', data);
        setAnnouncements([]);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <InnerBanner title="Tapodhan Akshay Patram – February 2026" breadcrumb={breadcrumb} backgroundImage={bannerImage} />
        <section className="announcements-content">
          <div className="container">
            <p>Loading announcements...</p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <InnerBanner
        title="Tapodhan Akshay Patram – February 2026"
        breadcrumb={breadcrumb}
        backgroundImage={bannerImage}
      />
      
      <AnnouncementHeader />
      
      <section className="announcements-section">
        <div className="container">
          <div className="featured-announcements">
            <div className="announcement-image-card">
              <img src={announcement1} alt="Tapodhan Akshay Patram February 2026" />
            </div>
            <div className="announcement-image-card">
              <img src={announcement2} alt="Kitchen Kit Donation Information" />
            </div>
          </div>
          
          {announcements.length > 0 && (
            <div className="announcements-grid">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="announcement-card">
                  <div className="announcement-content">
                    {announcement.image && (
                      <div className="announcement-image">
                        <img src={`${API_ENDPOINTS.UPLOADS}/${announcement.image}`} alt={announcement.title} />
                      </div>
                    )}
                    <div className="announcement-detail">
                      <h3 className="announcement-title">{announcement.title}</h3>
                      {announcement.date && (
                        <span className="announcement-date">{new Date(announcement.date).toLocaleDateString()}</span>
                      )}
                      {announcement.description && (
                        <p className="announcement-description">{announcement.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Announcements;

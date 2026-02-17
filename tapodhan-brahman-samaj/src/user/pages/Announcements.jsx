import React from 'react';
import InnerBanner from '../components/InnerBanner';
import AnnouncementHeader from '../components/AnnouncementHeader';
import bannerImage from '../assets/images/announcement-banner.jpg';
import yellowPoster from '../assets/images/event-announc1.png';
import yellowPoster2 from '../assets/images/event-announc2.png';
import donorList from '../assets/images/event-list.png';
import donorList2 from '../assets/images/event-list2.png';
import { API_ENDPOINTS } from '../../config/api';
import announcement1 from '../assets/images/announcement1.jpeg';
import announcement2 from '../assets/images/announcement2.jpeg';
import '../css/style.css';

const Announcements = () => {
  const breadcrumb = [
    { label: 'Home', link: '/' },
    { label: 'Announcements' }
  ];

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
              <img src={yellowPoster} alt="Tapodhan Akshay Patram Information 1" />
            </div>
            <div className="announcement-image-card">
              <img src={donorList} alt="Donor List 1" />
            </div>
            <div className="announcement-image-card">
              <img src={yellowPoster2} alt="Tapodhan Akshay Patram Information 2" />
            </div>

            <div className="announcement-image-card">
              <img src={donorList2} alt="Donor List 2" />
            </div>
          </div>
<<<<<<< HEAD

  {
    announcements.length > 0 && (
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
    )
  }
=======
>>>>>>> d16deffa1a4e6f833524b75915bbfa7d1b6e22f9
        </div >
      </section >
    </>
  );
};

export default Announcements;

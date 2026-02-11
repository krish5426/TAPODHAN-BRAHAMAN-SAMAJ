import React from 'react';
import InnerBanner from '../components/InnerBanner';
import AnnouncementHeader from '../components/AnnouncementHeader';
import bannerImage from '../assets/images/announcement-banner.jpg';
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
              <img src={announcement1} alt="Tapodhan Akshay Patram February 2026" />
            </div>
            <div className="announcement-image-card">
              <img src={announcement2} alt="Kitchen Kit Donation Information" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Announcements;

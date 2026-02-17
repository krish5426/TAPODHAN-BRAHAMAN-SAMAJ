import React from 'react';
import InnerBanner from '../components/InnerBanner';
import AnnouncementHeader from '../components/AnnouncementHeader';
import bannerImage from '../assets/images/announcement-banner.jpg';
import yellowPoster from '../assets/images/event-announc1.png';
import yellowPoster2 from '../assets/images/event-announc2.png';
import donorList from '../assets/images/event-list.png';
import donorList2 from '../assets/images/event-list2.png';
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
        </div >
      </section >
    </>
  );
};

export default Announcements;

import React from 'react';
import InnerBanner from '../components/InnerBanner';
import AnnouncementHeader from '../components/AnnouncementHeader';
import bannerImage from '../assets/images/announcement-banner.jpg';
import infoPoster from '../assets/images/event-announc1.png';
import detailPoster from '../assets/images/event-announc2.png';
import donorList1 from '../assets/images/event-list.png';
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
        title="Announcements"
        breadcrumb={breadcrumb}
        backgroundImage={bannerImage}
      />

      <AnnouncementHeader />

      <section className="announcements-section">
        <div className="container">
          <div className="featured-announcements">
            {/* Main Information Posters */}
            <div className="announcement-posters">
              <div className="announcement-image-card">
                <img src={infoPoster} alt="Tapodhan Akshay Patram Appeal" />
              </div>
              <div className="announcement-image-card">
                <img src={detailPoster} alt="Kitchen Kit Details and QR" />
              </div>
            </div>

            {/* Donor Lists */}
            <div className="donor-lists">
              <div className="announcement-image-card">
                <img src={donorList1} alt="Donor List Page 1" />
              </div>
              <div className="announcement-image-card">
                <img src={donorList2} alt="Donor List Page 2" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Announcements;

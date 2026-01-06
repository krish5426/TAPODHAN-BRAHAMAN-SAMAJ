import React from "react";
import aboutImage from "../../assets/images/about-illustration.png";
const About = () => {
  return (
    <section className="about-section">
      <div className="container">
        <div className="row"> 
        <div className="about-content">
          <div className="header-section">
            <span className="header-label">ABOUT US</span>
             <h2 className="header-title">
              <strong> <span>UNITED BY </span>HERITAGE,
              COMMITTED <span>TO</span> HUMANITY.</strong>
            </h2>
           </div>  
            <div className="about-description">
              <p>
                Tapodhan Brahman Samaj Charitable Trust (TBSCT) is a non-profit 
                organization committed to social welfare, community upliftment, and 
                cultural values. The Trust is registered under the Gujarat Public Trust 
                Act, 2011 with Registration No. A-1090 / PATAN, and is governed by the 
                Charity Commissioner's Office, Patan, Gujarat (India).
              </p>
              
              <p>
                Established in 2013, TBSCT was founded through the vision, dedication, 
                and selfless efforts of respected members of the Tapodhan Brahman 
                Samaj, who believed in creating a platform for service, unity, and 
                community development.
              </p>
              
              <p>
                Their selfless contribution laid the foundation for the Trust's mission of 
                supporting education, healthcare, social welfare, and cultural 
                preservation.
              </p>
            </div>
            <button className="read-more-btn">
              <span>Read More</span>
            </button>
        </div>
          <div className="about-visual">
            <img src={aboutImage} alt="About Illustration" />
          </div>
          </div>
      </div>
    </section>
  );
};

export default About;
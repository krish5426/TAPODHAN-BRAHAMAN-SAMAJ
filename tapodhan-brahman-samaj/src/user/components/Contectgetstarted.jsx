import React from "react";
import communityImg from "../assets/images/Community.png";

const Contactgetstarted = () => {
  return (
    <section className="contact-section">
      <div className="container-community">
        <div className="contact-content-two">
          <div className="contact-left-side">
            <div className="header-section">
              <span className="contact-get-started">GET STARTED</span>
              <h2 className="header-title">
                <strong><span>JOIN OUR</span> COMMUNITY <span>AND</span><br />
                  GROW TOGETHER</strong>
              </h2>
            </div>
            <p className="contact-description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed de eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            <a href="/join-us" className="read-more-btn">
              <span>Join Us</span>
            </a>
          </div>
        </div>
        <div className="community-right">
          <img src={communityImg} alt="Community" />
        </div>
      </div>

    </section>
  );
};
export default Contactgetstarted;
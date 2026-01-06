import React from "react";
import registerImg from "../assets/images/mobile.png";

const BusinessRegisterform = () => {
  return (
    <section className="register-section">
      <div className="container">
        <div className="register-wrapper">

          {/* LEFT IMAGE */}
          <div className="register-left">
            <img src={registerImg} alt="Register Business" />
          </div>

          {/* RIGHT CONTENT */}
          <div className="register-right">

            {/* HEADER (same structure as Homeabout) */}
            <div className="header-section">
              <h2 className="header-title">
                <strong>
                  Register your business <span>to <br />connect </span>our community
                </strong>
              </h2>
            </div>

            {/* DESCRIPTION */}
            <p className="sub-text">
              Enter a few business details to get started
            </p>

            {/* FORM */}
            <form className="register-form">
              <div className="form-grid">

                <div className="form-group">
                  <label>Business Name*</label>
                  <input type="text" placeholder="Enter business name" />
                </div>

                <div className="form-group">
                  <label>Business Category*</label>
                  <select>
                    <option>Select category</option>
                    <option>Restaurant</option>
                    <option>Shop</option>
                    <option>Service</option>
                    <option>Freelancer</option>
                    <option>Office</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Business Type*</label>
                  <input type="text" placeholder="Eg. Private / Public" />
                </div>

                <div className="form-group">
                  <label>Business Location*</label>
                  <input type="text" placeholder="Area & City" />
                </div>

                {/* FULL WIDTH */}
                <div className="form-group full-width">
                  <label>Business Address*</label>
                  <textarea placeholder="Enter full address"></textarea>
                </div>

              </div>

              <button type="submit" className="read-more-btn">
                <span>Continue</span>
              </button>
            </form>

          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessRegisterform;
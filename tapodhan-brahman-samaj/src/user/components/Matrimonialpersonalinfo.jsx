import React from "react";
import metromonialimg from "../../assets/images/matrimonialimg.png";

const Matrimonialpersonalinfo = () => {
  return (
    <section className="register-section">
      <div className="container">
        <div className="register-wrapper">

          {/* LEFT IMAGE */}
          <div className="register-left">
            <img src={metromonialimg} alt="matrimonial info" />
          </div>

          {/* RIGHT CONTENT */}
          <div className="register-right">

            {/* HEADER */}
            <div className="header-section">
              <h2 className="header-title">
                <strong>Personal Information</strong>
              </h2>
            </div>

            {/* FORM */}
            <form className="register-form">
              <div className="form-grid">

                {/* PROFILE FOR */}
                <div className="form-group full-width">
                  <label>Profile For*</label>
                  <select>
                    <option>Myself</option>
                    <option>Son</option>
                    <option>Daughter</option>
                    <option>Brother</option>
                    <option>Sister</option>
                    <option>Relative</option>
                  </select>
                </div>

                {/* FIRST NAME */}
                <div className="form-group">
                  <label>First Name*</label>
                  <input type="text" placeholder="Enter first name" />
                </div>

                {/* SURNAME */}
                <div className="form-group">
                  <label>Surname*</label>
                  <input type="text" placeholder="Enter surname" />
                </div>

                {/* GENDER */}
                <div className="form-group">
                  <label>Gender*</label>
                  <div className="radio-group">
                    <label>
                      <input type="radio" name="gender" /> Male
                    </label>
                    <label>
                      <input type="radio" name="gender" /> Female
                    </label>
                  </div>
                </div>

                {/* CURRENT STATUS */}
                <div className="form-group">
                  <label>Current Status*</label>
                  <select>
                    <option>Single</option>
                    <option>Married</option>
                    <option>Divorced</option>
                    <option>Widowed</option>
                  </select>
                </div>

                {/* NUMBER OF CHILDREN */}
                <div className="form-group">
                  <label>Number of Children</label>
                  <input type="number" placeholder="0" />
                </div>

                {/* DATE OF BIRTH */}
                <div className="form-group">
                  <label>Date of Birth*</label>
                  <input type="date" />
                </div>

                {/* TIME OF BIRTH */}
                <div className="form-group">
                  <label>Time of Birth*</label>
                  <input type="time" />
                </div>

                {/* BIRTH PLACE */}
                <div className="form-group">
                  <label>Birth Place*</label>
                  <input type="text" placeholder="Enter city" />
                </div>

              </div>

              {/* NEXT BUTTON */}
              <button type="submit" className="read-more-btn full-width">
                <span>Next</span>
              </button>
            </form>

          </div>
        </div>
      </div>
    </section>
  );
};

export default Matrimonialpersonalinfo;
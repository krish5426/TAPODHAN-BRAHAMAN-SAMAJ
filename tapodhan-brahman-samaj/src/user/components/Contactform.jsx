import mail from "../assets/images/mailid.png";
import phone from "../assets/images/phonee.png";
import location from "../assets/images/location.png";

const Contactform = () => {
  return (
    <section className="contact-section">
      <div className="container">
        <div className="contact-content">
          <div className="contact-left">
            <div className="header-section">
              <span className="header-label">CONTACT US</span>
              <h2 className="header-title">
                <strong><span>LET'S STAY</span> CONNECTED <span>FOR A</span>
                  STRONGER COMMUNITY</strong>
              </h2>
            </div>
            <p className="contact-description-two">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            <div className="contact-info-box">
              <div className="info-row">
                <img src={phone} alt="Phone" className="info-icon" />
                <div>
                  <h4>Phone Number</h4>
                  <p>+919273728***</p>
                </div>
              </div>

              <div className="info-row">
                <img src={mail} alt="Email" className="info-icon" />
                <div>
                  <h4>Email Address</h4>
                  <p>tbsct001@gmail.com</p>
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

          {/* RIGHT FORM */}
          <div className="contact-right">
            <form className="contact-form">
              <label>FULL NAME</label>
              <input type="text" placeholder="Enter your full name" />

              <div className="two-inputs">
                <div>
                  <label>EMAIL</label>
                  <input type="email" placeholder="you@example.com" />
                </div>

                <div>
                  <label>PHONE NUMBER</label>
                  <input type="text" placeholder="+91 XXXXXXXX" />
                </div>
              </div>

              <label>SEND US MESSAGE</label>
              <textarea placeholder="you@example.com"></textarea>

              <button type="submit">SEND MESSAGE</button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contactform;
